import type { AppEnv, RequestSession } from "./types.ts";
import { sessionFromRequest } from "./session.ts";
import { handleRpc, isNotification, SERVER_NAME, SERVER_VERSION, type RpcRequest } from "./mcp.ts";
import { landingHtml } from "./page.ts";

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Accept, Mcp-Session-Id, MCP-Protocol-Version, Mcp-Protocol-Version, Mcp-Method, Mcp-Name, Last-Event-ID, X-Agy-Refresh-Token, X-Agy-Access-Token",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, MCP-Protocol-Version",
};

export async function handleRequest(
  req: Request,
  env: AppEnv,
  fileSession?: RequestSession,
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const session = sessionFromRequest(req, env, fileSession);

  if (req.method === "GET" && (path === "/" || path === "/health")) {
    if (path === "/health" || wantsJson(req)) {
      return json(
        {
          ok: true,
          name: SERVER_NAME,
          version: SERVER_VERSION,
          session: session.source,
          authRequired: Boolean(env.MCP_AUTH_TOKEN),
        },
        200,
      );
    }
    return new Response(
      landingHtml({
        session: session.source,
        authRequired: Boolean(env.MCP_AUTH_TOKEN),
        origin: url.origin,
      }),
      { status: 200, headers: { ...CORS, "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  if (req.method === "GET" && path === "/mcp") {
    return json({ error: "method not allowed; POST JSON-RPC to /mcp" }, 405);
  }

  if (req.method === "DELETE" && path === "/mcp") {
    return new Response(null, { status: 405, headers: CORS });
  }

  if (req.method === "POST" && (path === "/mcp" || path === "/")) {
    const authErr = checkAuth(req, env);
    if (authErr) return authErr;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return json({ jsonrpc: "2.0", error: { code: -32700, message: "parse error" } }, 400);
    }

    if (Array.isArray(body)) {
      const requests = body as RpcRequest[];
      if (requests.every(isNotificationOrResponse)) {
        return new Response(null, { status: 202, headers: CORS });
      }
      const out = [];
      for (const item of requests) {
        if (isNotificationOrResponse(item)) continue;
        out.push(await handleRpc(item, env, session));
      }
      return json(out, 200);
    }

    const msg = body as RpcRequest;
    if (isNotificationOrResponse(msg)) {
      return new Response(null, { status: 202, headers: CORS });
    }
    const result = await handleRpc(msg, env, session);
    return json(result, 200);
  }

  return json({ error: "not found" }, 404);
}

function isNotificationOrResponse(msg: RpcRequest): boolean {
  if (!msg || typeof msg !== "object") return true;
  if (msg.method && isNotification(msg)) return true;
  if (!msg.method && (msg.result !== undefined || msg.error !== undefined)) return true;
  return false;
}

function checkAuth(req: Request, env: AppEnv): Response | null {
  const expected = env.MCP_AUTH_TOKEN?.trim();
  if (!expected) return null;
  const got = req.headers.get("authorization") ?? "";
  const token = got.toLowerCase().startsWith("bearer ") ? got.slice(7).trim() : "";
  if (token && timingSafeEqual(token, expected)) return null;
  return json({ error: "unauthorized" }, 401);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function wantsJson(req: Request): boolean {
  return (req.headers.get("accept") ?? "").includes("application/json");
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
