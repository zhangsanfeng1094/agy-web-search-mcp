import type { AppEnv } from "./types.ts";

export type MetricEvent = {
  at: number;
  ok: boolean;
  ms: number;
  tool: string;
  query?: string;
  error?: string;
};

export type MetricsSnapshot = {
  startedAt: number;
  total: number;
  ok: number;
  fail: number;
  authFail: number;
  lastAt?: number;
  lastOkAt?: number;
  lastFailAt?: number;
  lastMs?: number;
  avgMs?: number;
  p95Ms?: number;
  recent: MetricEvent[];
  persistent?: boolean;
};

export type MetricsState = {
  startedAt: number;
  ok: number;
  fail: number;
  authFail: number;
  recent: MetricEvent[];
  latencies: number[];
};

const MAX_RECENT = 30;
const MAX_LATENCIES = 200;
const STORE_KEY = "s";

let mem = emptyState();

export function emptyState(now = Date.now()): MetricsState {
  return { startedAt: now, ok: 0, fail: 0, authFail: 0, recent: [], latencies: [] };
}

export function recordCall(event: Omit<MetricEvent, "at">): MetricEvent {
  mem = applyCall(mem, event);
  return mem.recent[mem.recent.length - 1];
}

export function recordAuthFail(): void {
  mem = applyAuthFail(mem);
}

export function metricsSnapshot(): MetricsSnapshot {
  return toSnapshot(mem);
}

export function resetMetrics(): void {
  mem = emptyState();
}

export function applyCall(state: MetricsState, event: Omit<MetricEvent, "at">, now = Date.now()): MetricsState {
  const row: MetricEvent = {
    at: now,
    ok: event.ok,
    ms: Math.max(0, Math.round(event.ms)),
    tool: event.tool || "search_web",
    query: clip(event.query, 80),
    error: event.ok ? undefined : clip(event.error, 160),
  };
  const recent = state.recent.concat(row);
  if (recent.length > MAX_RECENT) recent.splice(0, recent.length - MAX_RECENT);
  const latencies = state.latencies.concat(row.ms);
  if (latencies.length > MAX_LATENCIES) latencies.splice(0, latencies.length - MAX_LATENCIES);
  return {
    ...state,
    recent,
    latencies,
    ok: state.ok + (row.ok ? 1 : 0),
    fail: state.fail + (row.ok ? 0 : 1),
  };
}

export function applyAuthFail(state: MetricsState): MetricsState {
  return { ...state, authFail: state.authFail + 1 };
}

export function toSnapshot(state: MetricsState, persistent = false): MetricsSnapshot {
  const total = state.ok + state.fail;
  const last = state.recent[state.recent.length - 1];
  return {
    startedAt: state.startedAt,
    total,
    ok: state.ok,
    fail: state.fail,
    authFail: state.authFail,
    lastAt: last?.at,
    lastOkAt: lastMatch(state.recent, true),
    lastFailAt: lastMatch(state.recent, false),
    lastMs: last?.ms,
    avgMs: total ? Math.round(state.latencies.reduce((a, b) => a + b, 0) / state.latencies.length) : undefined,
    p95Ms: percentile(state.latencies, 0.95),
    recent: state.recent.slice().reverse(),
    persistent,
  };
}

type DoStorage = {
  get<T>(key: string): Promise<T | undefined>;
  put(key: string, value: unknown): Promise<void>;
};

export class MetricsStore {
  constructor(private readonly ctx: { storage: DoStorage }) {}

  async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const request = input instanceof Request && init === undefined ? input : new Request(input as RequestInfo, init);
    const cur = (await this.ctx.storage.get<MetricsState>(STORE_KEY)) ?? emptyState();
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    if (request.method === "GET") {
      return jsonResponse(toSnapshot(cur, true));
    }
    if (request.method === "POST" && (path === "/record" || path === "record")) {
      const event = (await request.json()) as Omit<MetricEvent, "at">;
      const next = applyCall(cur, event);
      await this.ctx.storage.put(STORE_KEY, next);
      return jsonResponse({ ok: true });
    }
    if (request.method === "POST" && (path === "/auth-fail" || path === "auth-fail")) {
      const next = applyAuthFail(cur);
      await this.ctx.storage.put(STORE_KEY, next);
      return jsonResponse({ ok: true });
    }
    return jsonResponse({ error: "not found" }, 404);
  }
}

export type MetricsClient = {
  snapshot(): Promise<MetricsSnapshot>;
  record(event: Omit<MetricEvent, "at">): Promise<void>;
  recordAuthFail(): Promise<void>;
};

export function metricsClient(env: AppEnv = {}): MetricsClient {
  const ns = env.METRICS;
  if (!ns) {
    return {
      snapshot: async () => toSnapshot(mem, false),
      record: async (event) => {
        recordCall(event);
      },
      recordAuthFail: async () => {
        recordAuthFail();
      },
    };
  }
  const stub = ns.get(ns.idFromName("global"));
  return {
    snapshot: async () => {
      try {
        const resp = await stub.fetch("https://metrics/");
        if (!resp.ok) return toSnapshot(mem, false);
        return (await resp.json()) as MetricsSnapshot;
      } catch {
        return toSnapshot(mem, false);
      }
    },
    record: async (event) => {
      try {
        await stub.fetch("https://metrics/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event),
        });
      } catch {
        recordCall(event);
      }
    },
    recordAuthFail: async () => {
      try {
        await stub.fetch("https://metrics/auth-fail", { method: "POST" });
      } catch {
        recordAuthFail();
      }
    },
  };
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function lastMatch(recent: MetricEvent[], wantOk: boolean): number | undefined {
  for (let i = recent.length - 1; i >= 0; i--) {
    if (recent[i].ok === wantOk) return recent[i].at;
  }
  return undefined;
}

function percentile(values: number[], p: number): number | undefined {
  if (!values.length) return undefined;
  const sorted = values.slice().sort((a, b) => a - b);
  const i = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * p) - 1));
  return sorted[i];
}

function clip(s: string | undefined, n: number): string | undefined {
  if (!s) return undefined;
  const t = s.replace(/\s+/g, " ").trim();
  if (!t) return undefined;
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}
