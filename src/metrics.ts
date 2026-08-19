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
};

const MAX_RECENT = 30;
const MAX_LATENCIES = 200;

const startedAt = Date.now();
const recent: MetricEvent[] = [];
const latencies: number[] = [];
let ok = 0;
let fail = 0;
let authFail = 0;

export function recordCall(event: Omit<MetricEvent, "at">): MetricEvent {
  const row: MetricEvent = {
    at: Date.now(),
    ok: event.ok,
    ms: Math.max(0, Math.round(event.ms)),
    tool: event.tool || "search_web",
    query: clip(event.query, 80),
    error: event.ok ? undefined : clip(event.error, 160),
  };
  recent.push(row);
  if (recent.length > MAX_RECENT) recent.shift();
  latencies.push(row.ms);
  if (latencies.length > MAX_LATENCIES) latencies.shift();
  if (row.ok) ok += 1;
  else fail += 1;
  return row;
}

export function recordAuthFail(): void {
  authFail += 1;
}

export function metricsSnapshot(): MetricsSnapshot {
  const total = ok + fail;
  const last = recent[recent.length - 1];
  return {
    startedAt,
    total,
    ok,
    fail,
    authFail,
    lastAt: last?.at,
    lastOkAt: lastMatch(true),
    lastFailAt: lastMatch(false),
    lastMs: last?.ms,
    avgMs: total ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : undefined,
    p95Ms: percentile(latencies, 0.95),
    recent: recent.slice().reverse(),
  };
}

export function resetMetrics(): void {
  recent.length = 0;
  latencies.length = 0;
  ok = 0;
  fail = 0;
  authFail = 0;
}

function lastMatch(wantOk: boolean): number | undefined {
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
