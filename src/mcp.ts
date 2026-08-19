import type { AppEnv, RequestSession } from "./types.ts";
import { searchWeb } from "./search.ts";

export const SERVER_NAME = "agy-web-search";
export const SERVER_VERSION = "0.3.3";
const SUPPORTED = new Set(["2024-11-05", "2025-03-26", "2025-06-18", "2026-07-28"]);

export type RpcRequest = {
  jsonrpc?: string;
  id?: unknown;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: unknown;
};

export type RpcResponse = {
  jsonrpc: "2.0";
  id?: unknown;
  result?: unknown;
  error?: { code: number; message: string };
};

export function isNotification(msg: RpcRequest): boolean {
  return msg.id === undefined || msg.id === null;
}

export function searchToolDef() {
  return {
    name: "search_web",
    description:
      "Search the live web using the Antigravity/agy Google session (Cloud Code googleSearch). Use for news, current events, and facts that need citations.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query, including dates or locale when relevant.",
        },
      },
      required: ["query"],
    },
  };
}

export async function handleRpc(
  req: RpcRequest,
  env: AppEnv,
  session: RequestSession,
): Promise<RpcResponse> {
  const id = req.id;
  switch (req.method) {
    case "initialize": {
      const client = (req.params as { protocolVersion?: string } | undefined)?.protocolVersion;
      return {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: client && SUPPORTED.has(client) ? client : "2025-03-26",
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
        },
      };
    }
    case "ping":
      return { jsonrpc: "2.0", id, result: {} };
    case "tools/list":
      return { jsonrpc: "2.0", id, result: { tools: [searchToolDef()] } };
    case "tools/call": {
      try {
        const text = await callTool(req.params, env, session);
        return {
          jsonrpc: "2.0",
          id,
          result: { content: [{ type: "text", text }] },
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          jsonrpc: "2.0",
          id,
          result: { content: [{ type: "text", text: message }], isError: true },
        };
      }
    }
    default:
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `method not found: ${req.method ?? ""}` },
      };
  }
}

async function callTool(params: unknown, env: AppEnv, session: RequestSession): Promise<string> {
  const p = (params ?? {}) as { name?: string; arguments?: unknown };
  if (p.name !== "search_web") throw new Error(`unknown tool: ${p.name ?? ""}`);
  return searchWeb(extractQuery(p.arguments), env, session);
}

export function extractQuery(raw: unknown): string {
  if (raw == null) throw new Error("missing arguments");
  if (typeof raw === "string") {
    const t = raw.trim();
    if (t.startsWith("{")) return extractQuery(JSON.parse(t));
    if (t) return t;
    throw new Error("query is required");
  }
  if (typeof raw === "object" && raw && "query" in raw) {
    const q = String((raw as { query?: unknown }).query ?? "").trim();
    if (!q) throw new Error("query is required");
    return q;
  }
  throw new Error("invalid arguments");
}
