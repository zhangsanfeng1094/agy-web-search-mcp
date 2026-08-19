import type { AppEnv } from "./types.ts";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
const COOKIE = "agy_oauth";
const MANUAL_REDIRECT = "http://localhost:51121/oauth-callback";

export const OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/cloud-platform",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/cclog",
  "https://www.googleapis.com/auth/experimentsandconfigs",
];

export type OauthPending = {
  state: string;
  verifier: string;
  redirectUri: string;
};

export type OauthTokens = {
  refreshToken: string;
  accessToken: string;
  email?: string;
};

export function isLoopbackHost(host: string): boolean {
  const h = host.replace(/^\[|\]$/g, "").toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

export function oauthRedirectUri(origin: string, env: AppEnv = {}): string {
  const custom = env.AGY_OAUTH_REDIRECT_URI?.trim();
  if (custom) return custom.replace(/\/+$/, "");
  const url = new URL(origin);
  if (isLoopbackHost(url.hostname)) return `${url.origin}/oauth/callback`;
  return MANUAL_REDIRECT;
}

export function oauthIsManual(origin: string, env: AppEnv = {}): boolean {
  if (env.AGY_OAUTH_REDIRECT_URI?.trim()) return false;
  return !isLoopbackHost(new URL(origin).hostname);
}

export async function createPending(redirectUri: string): Promise<OauthPending> {
  const verifier = base64Url(randomBytes(32));
  return { state: base64Url(randomBytes(24)), verifier, redirectUri };
}

export async function buildAuthUrl(pending: OauthPending, env: AppEnv): Promise<string> {
  const { id } = oauthClient(env);
  const challenge = await pkceChallenge(pending.verifier);
  const url = new URL(AUTH_URL);
  url.searchParams.set("client_id", id);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", pending.redirectUri);
  url.searchParams.set("scope", OAUTH_SCOPES.join(" "));
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", pending.state);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  return url.toString();
}

export async function exchangeCode(
  code: string,
  pending: OauthPending,
  env: AppEnv,
): Promise<OauthTokens> {
  const { id, secret } = oauthClient(env);
  const resp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: id,
      client_secret: secret,
      code,
      grant_type: "authorization_code",
      redirect_uri: pending.redirectUri,
      code_verifier: pending.verifier,
    }),
  });
  const json = (await resp.json()) as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!resp.ok || !json.access_token) {
    throw new Error(json.error_description || json.error || `token http ${resp.status}`);
  }
  if (!json.refresh_token) {
    throw new Error("Google did not return a refresh_token; retry and grant consent");
  }
  const email = await fetchEmail(json.access_token);
  return { refreshToken: json.refresh_token, accessToken: json.access_token, email };
}

export function parseCallbackInput(raw: string): { code: string; state?: string } {
  const t = raw.trim();
  if (!t) throw new Error("empty callback");
  if (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("localhost")) {
    const href = t.startsWith("localhost") ? `http://${t}` : t;
    return fromSearch(new URL(href).searchParams);
  }
  if (t.includes("code=")) {
    const q = t.includes("?") ? t.slice(t.indexOf("?") + 1) : t.replace(/^\?/, "");
    return fromSearch(new URLSearchParams(q));
  }
  if (t.length >= 20 && !/\s/.test(t)) return { code: t };
  throw new Error("unrecognized callback; paste the full localhost URL");
}

export async function pendingCookie(pending: OauthPending, env: AppEnv, secure: boolean): Promise<string> {
  const token = await signPending(pending, env);
  const parts = [
    `${COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=900",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearPendingCookie(secure: boolean): string {
  const parts = [`${COOKIE}=`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export async function readPending(req: Request, env: AppEnv): Promise<OauthPending | undefined> {
  const raw = cookieValue(req, COOKIE);
  if (!raw) return undefined;
  return verifyPending(raw, env);
}

export function assertState(pending: OauthPending, state?: string): void {
  if (state && state !== pending.state) throw new Error("oauth state mismatch");
}

function fromSearch(params: URLSearchParams): { code: string; state?: string } {
  const err = params.get("error");
  if (err) throw new Error(params.get("error_description") || err);
  const code = params.get("code")?.trim();
  if (!code) throw new Error("callback URL missing code");
  return { code, state: params.get("state") ?? undefined };
}

export const DEFAULT_OAUTH_CLIENT_ID = baked(
  "a2pta2pqbGpsam9ja3cuNzIpKTM0aDJoazY5KD9oaW8sLjU2NTAybj1uamk/KnQ7KiopdD01NT02Py8pPyg5NTQuPzQudDk1Nw==",
);
export const DEFAULT_OAUTH_CLIENT_SECRET = baked("HRUZCQoCdxFvYhwNCG5ibBY+FhBrNxYYYikCGW4gbCseGzw=");

function baked(s: string): string {
  const raw = atob(s);
  let out = "";
  for (let i = 0; i < raw.length; i++) out += String.fromCharCode(raw.charCodeAt(i) ^ 0x5a);
  return out;
}

export function oauthClient(env: AppEnv = {}): { id: string; secret: string } {
  return {
    id: env.AGY_OAUTH_CLIENT_ID?.trim() || DEFAULT_OAUTH_CLIENT_ID,
    secret: env.AGY_OAUTH_CLIENT_SECRET?.trim() || DEFAULT_OAUTH_CLIENT_SECRET,
  };
}

async function fetchEmail(accessToken: string): Promise<string | undefined> {
  try {
    const resp = await fetch(USERINFO_URL, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!resp.ok) return undefined;
    const json = (await resp.json()) as { email?: string };
    return json.email?.trim() || undefined;
  } catch {
    return undefined;
  }
}

async function pkceChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(digest));
}

async function signPending(pending: OauthPending, env: AppEnv): Promise<string> {
  const payload = base64Url(new TextEncoder().encode(JSON.stringify({ ...pending, exp: Date.now() + 900_000 })));
  const sig = await hmac(signingKey(env), payload);
  return `${payload}.${sig}`;
}

async function verifyPending(token: string, env: AppEnv): Promise<OauthPending | undefined> {
  const i = token.lastIndexOf(".");
  if (i < 0) return undefined;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expect = await hmac(signingKey(env), payload);
  if (!timingSafeEqual(sig, expect)) return undefined;
  try {
    const json = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as OauthPending & { exp?: number };
    if (!json.state || !json.verifier || !json.redirectUri) return undefined;
    if (json.exp && json.exp < Date.now()) return undefined;
    return { state: json.state, verifier: json.verifier, redirectUri: json.redirectUri };
  } catch {
    return undefined;
  }
}

function signingKey(env: AppEnv): string {
  return oauthClient(env).secret;
}

async function hmac(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return base64Url(new Uint8Array(sig));
}

function cookieValue(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    if (part.slice(0, i).trim() !== name) continue;
    return part.slice(i + 1).trim();
  }
  return undefined;
}

function randomBytes(n: number): Uint8Array {
  const out = new Uint8Array(n);
  crypto.getRandomValues(out);
  return out;
}

function base64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
