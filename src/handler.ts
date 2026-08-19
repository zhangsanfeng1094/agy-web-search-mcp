import type { AppEnv, RequestSession } from "./types.ts";
import { sessionFromRequest } from "./session.ts";
import {
  extractQuery,
  handleRpc,
  isNotification,
  SERVER_NAME,
  SERVER_VERSION,
  type RpcRequest,
  type RpcResponse,
} from "./mcp.ts";
import { landingHtml, oauthErrorHtml, oauthSuccessHtml, oauthWaitHtml } from "./page.ts";
import { metricsSnapshot, recordAuthFail, recordCall } from "./metrics.ts";
import {
  assertState,
  buildAuthUrl,
  clearPendingCookie,
  createPending,
  exchangeCode,
  oauthIsManual,
  oauthRedirectUri,
  parseCallbackInput,
  pendingCookie,
  readPending,
} from "./oauth.ts";

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
          metrics: metricsSnapshot(),
        },
        200,
      );
    }
    return html(
      landingHtml({
        session: session.source,
        authRequired: Boolean(env.MCP_AUTH_TOKEN),
        origin: url.origin,
        oauthManual: oauthIsManual(url.origin, env),
        metrics: metricsSnapshot(),
      }),
    );
  }

  if (path === "/oauth/login" && req.method === "GET") {
    return startOauth(url, env);
  }
  if (path === "/oauth/callback" && req.method === "GET") {
    return finishOauth(req, url, env, url.search);
  }
  if (path === "/oauth/complete" && req.method === "POST") {
    return finishOauthPosted(req, url, env);
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
        out.push(await invokeRpc(item, env, session));
      }
      return json(out, 200);
    }

    const msg = body as RpcRequest;
    if (isNotificationOrResponse(msg)) {
      return new Response(null, { status: 202, headers: CORS });
    }
    const result = await invokeRpc(msg, env, session);
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
  recordAuthFail();
  return json({ error: "unauthorized" }, 401);
}

async function invokeRpc(req: RpcRequest, env: AppEnv, session: RequestSession): Promise<RpcResponse> {
  const t0 = Date.now();
  const result = await handleRpc(req, env, session);
  if (req.method === "tools/call") recordToolCall(req, result, Date.now() - t0);
  return result;
}

function recordToolCall(req: RpcRequest, result: RpcResponse, ms: number): void {
  const params = (req.params ?? {}) as { name?: string; arguments?: unknown };
  let query: string | undefined;
  try {
    query = extractQuery(params.arguments);
  } catch {
    query = undefined;
  }
  const toolError = result.result as { isError?: boolean; content?: Array<{ text?: string }> } | undefined;
  const failed = Boolean(result.error) || Boolean(toolError?.isError);
  recordCall({
    ok: !failed,
    ms,
    tool: params.name || "unknown",
    query,
    error: result.error?.message || (failed ? toolError?.content?.[0]?.text : undefined),
  });
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

function html(body: string, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: { ...CORS, "Content-Type": "text/html; charset=utf-8", ...extra },
  });
}

async function startOauth(url: URL, env: AppEnv): Promise<Response> {
  try {
    const pending = await createPending(oauthRedirectUri(url.origin, env));
    const authUrl = await buildAuthUrl(pending, env);
    const cookie = await pendingCookie(pending, env, url.protocol === "https:");
    if (oauthIsManual(url.origin, env)) {
      return html(oauthWaitHtml({ authUrl }), 200, { "Set-Cookie": cookie });
    }
    return new Response(null, {
      status: 302,
      headers: { ...CORS, Location: authUrl, "Set-Cookie": cookie },
    });
  } catch (err) {
    return html(oauthErrorHtml(err instanceof Error ? err.message : String(err)), 400);
  }
}

async function finishOauthPosted(req: Request, url: URL, env: AppEnv): Promise<Response> {
  const form = await req.formData().catch(() => null);
  const raw = String(form?.get("callback") ?? "");
  return finishOauth(req, url, env, raw);
}

async function finishOauth(req: Request, url: URL, env: AppEnv, raw: string): Promise<Response> {
  const secure = url.protocol === "https:";
  try {
    const pending = await readPending(req, env);
    if (!pending) throw new Error("oauth session expired; start again from /oauth/login");
    const parsed = parseCallbackInput(raw.trim() || url.href);
    assertState(pending, parsed.state);
    const tokens = await exchangeCode(parsed.code, pending, env);
    return html(
      oauthSuccessHtml({
        origin: url.origin,
        authRequired: Boolean(env.MCP_AUTH_TOKEN),
        refreshToken: tokens.refreshToken,
        email: tokens.email,
      }),
      200,
      { "Set-Cookie": clearPendingCookie(secure) },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (oauthIsManual(url.origin, env)) {
      try {
        const pending = await readPending(req, env);
        if (pending) {
          const authUrl = await buildAuthUrl(pending, env);
          return html(oauthWaitHtml({ authUrl, error: message }), 400);
        }
      } catch {
        // fall through to generic error
      }
    }
    return html(oauthErrorHtml(message), 400, { "Set-Cookie": clearPendingCookie(secure) });
  }
}
