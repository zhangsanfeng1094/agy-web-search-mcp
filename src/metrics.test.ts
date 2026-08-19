import { describe, expect, test } from "bun:test";
import { handleRequest } from "./handler.ts";
import { metricsSnapshot, recordCall, resetMetrics } from "./metrics.ts";

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
