import { describe, expect, test } from "bun:test";
import { handleRequest } from "./handler.ts";
import { MetricsStore, metricsSnapshot, recordCall, resetMetrics } from "./metrics.ts";
import type { MetricsNamespace } from "./types.ts";

describe("metrics", () => {
  test("records success and failure", () => {
    resetMetrics();
    recordCall({ ok: true, ms: 120, tool: "search_web", query: "hello" });
    recordCall({ ok: false, ms: 40, tool: "search_web", query: "bad", error: "no Google session" });
    const snap = metricsSnapshot();
    expect(snap.total).toBe(2);
    expect(snap.ok).toBe(1);
    expect(snap.fail).toBe(1);
    expect(snap.lastMs).toBe(40);
    expect(snap.recent[0].query).toBe("bad");
    expect(snap.recent[1].ok).toBe(true);
  });

  test("tools/call without session is a fail", async () => {
    resetMetrics();
    const resp = await handleRequest(
      new Request("http://127.0.0.1/mcp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: { name: "search_web", arguments: { query: "today news" } },
        }),
      }),
      {},
    );
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.result.isError).toBe(true);
    const snap = metricsSnapshot();
    expect(snap.fail).toBe(1);
    expect(snap.recent[0].query).toBe("today news");
  });

  test("landing and health show stats", async () => {
    resetMetrics();
    recordCall({ ok: true, ms: 880, tool: "search_web", query: "Cloudflare Workers" });
    const page = await handleRequest(new Request("http://127.0.0.1/"), {});
    const html = await page.text();
    expect(html).toContain("监控");
    expect(html).toContain("Cloudflare Workers");
    expect(html).toContain("880ms");

    const health = await handleRequest(new Request("http://127.0.0.1/health"), {});
    const json = await health.json();
    expect(json.metrics.ok).toBe(1);
    expect(json.metrics.recent[0].query).toBe("Cloudflare Workers");
  });

  test("durable object keeps stats across requests", async () => {
    resetMetrics();
    const env = { METRICS: fakeMetricsNs() };
    const call = await handleRequest(
      new Request("http://127.0.0.1/mcp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: { name: "search_web", arguments: { query: "durable metrics" } },
        }),
      }),
      env,
    );
    expect(call.status).toBe(200);
    expect(metricsSnapshot().total).toBe(0);

    const page = await handleRequest(new Request("http://127.0.0.1/"), env);
    const html = await page.text();
    expect(html).toContain("durable metrics");
    expect(html).toContain("Durable Object");
    expect(html).not.toContain("还没有 search_web 调用");

    const health = await handleRequest(new Request("http://127.0.0.1/health"), env);
    const json = await health.json();
    expect(json.metrics.fail).toBe(1);
    expect(json.metrics.persistent).toBe(true);
    expect(json.metrics.recent[0].query).toBe("durable metrics");
  });

  test("401 increments authFail", async () => {
    resetMetrics();
    const resp = await handleRequest(
      new Request("http://127.0.0.1/mcp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }),
      }),
      { MCP_AUTH_TOKEN: "secret" },
    );
    expect(resp.status).toBe(401);
    expect(metricsSnapshot().authFail).toBe(1);
  });
});

function fakeMetricsNs(): MetricsNamespace {
  const map = new Map<string, unknown>();
  const store = new MetricsStore({
    storage: {
      get: async (key) => map.get(key) as never,
      put: async (key, value) => {
        map.set(key, value);
      },
    },
  });
  return {
    idFromName: () => "global",
    get: () => store,
  };
}
