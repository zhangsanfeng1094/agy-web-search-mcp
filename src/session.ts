import type { AppEnv, RequestSession } from "./types.ts";
import { oauthClient } from "./oauth.ts";

const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";

type CachedToken = { accessToken: string; expiresAt: number };
const cache = new Map<string, CachedToken>();

export function sessionFromRequest(req: Request, env: AppEnv, file?: RequestSession): RequestSession {
  const headerRefresh = firstHeader(req, "x-agy-refresh-token");
  const headerAccess = firstHeader(req, "x-agy-access-token");
  if (headerRefresh || headerAccess) {
    return { refreshToken: headerRefresh, accessToken: headerAccess, source: "header" };
  }
  if (env.AGY_REFRESH_TOKEN || env.AGY_ACCESS_TOKEN) {
    return {
      refreshToken: env.AGY_REFRESH_TOKEN,
      accessToken: env.AGY_ACCESS_TOKEN,
      source: "env",
    };
  }
  if (file?.refreshToken || file?.accessToken) {
    return { ...file, source: "file" };
  }
  return { source: "missing" };
}

export async function getAccessToken(session: RequestSession, env: AppEnv = {}): Promise<string> {
  const refresh = session.refreshToken;
  if (refresh) {
    const hit = cache.get(refresh);
    if (hit && hit.expiresAt > Date.now() + 60_000) {
      return hit.accessToken;
    }
    return refreshAccessToken(refresh, env);
  }
  if (session.accessToken && !session.accessToken.startsWith("1//")) {
    return session.accessToken;
  }
  throw new Error("no Google session: open / and sign in with Google, or set AGY_REFRESH_TOKEN");
}

export function invalidateAccessToken(session: RequestSession): void {
  if (session.refreshToken) cache.delete(session.refreshToken);
}

async function refreshAccessToken(refresh: string, env: AppEnv): Promise<string> {
  const { id, secret } = oauthClient(env);
  const body = new URLSearchParams({
    client_id: id,
    client_secret: secret,
    refresh_token: refresh,
    grant_type: "refresh_token",
  });
  const resp = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = (await resp.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  if (!resp.ok || !json.access_token) {
    const msg = json.error_description || json.error || `http ${resp.status}`;
    throw new Error(`refresh Google token failed: ${msg}`);
  }
  cache.set(refresh, {
    accessToken: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  });
  return json.access_token;
}

function firstHeader(req: Request, name: string): string | undefined {
  const v = req.headers.get(name)?.trim();
  return v || undefined;
}
