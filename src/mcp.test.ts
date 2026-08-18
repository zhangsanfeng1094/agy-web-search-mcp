import { describe, expect, test } from "bun:test";
import { extractQuery, handleRpc, searchToolDef } from "./mcp.ts";
import { handleRequest } from "./handler.ts";

describe("mcp protocol", () => {
  test("initialize and tools/list", async () => {
    const init = await handleRpc({ jsonrpc: "2.0", id: 1, method: "initialize" }, {}, { source: "missing" });
    expect(JSON.stringify(init.result)).toContain("agy-web-search");
    const list = await handleRpc({ jsonrpc: "2.0", id: 2, method: "tools/list" }, {}, { source: "missing" });
    expect(JSON.stringify(list.result)).toContain("search_web");
    expect(searchToolDef().inputSchema.required).toContain("query");
  });

  test("extractQuery", () => {
    expect(extractQuery({ query: "hello" })).toBe("hello");
    expect(extractQuery('{"query":"nested"}')).toBe("nested");
  });

  test("http initialize + notification", async () => {
    const init = await handleRequest(
      new Request("http://127.0.0.1/mcp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26" } }),
      }),
      {},
    );
    expect(init.status).toBe(200);
    const body = await init.json();
    expect(body.result.serverInfo.name).toBe("agy-web-search");

    const note = await handleRequest(
      new Request("http://127.0.0.1/mcp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
      }),
      {},
    );
    expect(note.status).toBe(202);
  });

  test("bearer auth", async () => {
    const env = { MCP_AUTH_TOKEN: "secret" };
    const unauth = await handleRequest(
      new Request("http://127.0.0.1/mcp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }),
      }),
      env,
    );
    expect(unauth.status).toBe(401);

    const auth = await handleRequest(
      new Request("http://127.0.0.1/mcp", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: "Bearer secret" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }),
      }),
      env,
    );
    expect(auth.status).toBe(200);
  });
});
