import { describe, expect, test } from "bun:test";
import { handleRequest } from "./handler.ts";
import {
  assertState,
  buildAuthUrl,
  createPending,
  DEFAULT_OAUTH_CLIENT_ID,
  isLoopbackHost,
  oauthClient,
  oauthIsManual,
  oauthRedirectUri,
  parseCallbackInput,
  pendingCookie,
  readPending,
} from "./oauth.ts";

const env = {
  AGY_OAUTH_CLIENT_ID: "test-client.apps.googleusercontent.com",
  AGY_OAUTH_CLIENT_SECRET: "test-secret",
};

describe("oauth helpers", () => {
  test("uses built-in agy client when env is empty", () => {
    expect(oauthClient({}).id).toBe(DEFAULT_OAUTH_CLIENT_ID);
    expect(oauthClient(env).id).toBe(env.AGY_OAUTH_CLIENT_ID);
  });

  test("loopback vs remote redirect", () => {
    expect(isLoopbackHost("127.0.0.1")).toBe(true);
    expect(isLoopbackHost("localhost")).toBe(true);
    expect(isLoopbackHost("agy-web-search-mcp.example.workers.dev")).toBe(false);
    expect(oauthRedirectUri("http://127.0.0.1:8787")).toBe("http://127.0.0.1:8787/oauth/callback");
    expect(oauthRedirectUri("https://example.workers.dev")).toBe("http://localhost:51121/oauth-callback");
    expect(oauthIsManual("https://example.workers.dev")).toBe(true);
    expect(oauthIsManual("http://127.0.0.1:8787")).toBe(false);
    expect(oauthRedirectUri("https://example.workers.dev", { AGY_OAUTH_REDIRECT_URI: "https://example.workers.dev/oauth/callback" })).toBe(
      "https://example.workers.dev/oauth/callback",
    );
    expect(oauthIsManual("https://example.workers.dev", { AGY_OAUTH_REDIRECT_URI: "https://example.workers.dev/oauth/callback" })).toBe(false);
  });

  test("parseCallbackInput", () => {
    expect(parseCallbackInput("http://localhost:51121/oauth-callback?code=abc&state=s1")).toEqual({
      code: "abc",
      state: "s1",
    });
    expect(parseCallbackInput("?code=xyz")).toEqual({ code: "xyz", state: undefined });
    expect(parseCallbackInput("just-a-long-enough-code")).toEqual({ code: "just-a-long-enough-code" });
    expect(() => parseCallbackInput("http://localhost:51121/oauth-callback?error=access_denied")).toThrow("access_denied");
  });

  test("buildAuthUrl + pending cookie", async () => {
    const pending = await createPending("http://127.0.0.1:8787/oauth/callback");
    const url = new URL(await buildAuthUrl(pending, env));
    expect(url.origin + url.pathname).toBe("https://accounts.google.com/o/oauth2/v2/auth");
    expect(url.searchParams.get("client_id")).toBe(env.AGY_OAUTH_CLIENT_ID);
    expect(url.searchParams.get("redirect_uri")).toBe(pending.redirectUri);
    expect(url.searchParams.get("state")).toBe(pending.state);
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("access_type")).toBe("offline");
    assertState(pending, pending.state);
    expect(() => assertState(pending, "nope")).toThrow("state mismatch");

    const setCookie = await pendingCookie(pending, env, false);
    const token = setCookie.split(";")[0].slice("agy_oauth=".length);
    const req = new Request("http://127.0.0.1/oauth/callback", { headers: { cookie: `agy_oauth=${token}` } });
    const got = await readPending(req, env);
    expect(got).toEqual(pending);
  });
});

describe("oauth http", () => {
  test("landing shows login without oauth env", async () => {
    const resp = await handleRequest(new Request("http://127.0.0.1:8787/"), {});
    expect(resp.status).toBe(200);
    const body = await resp.text();
    expect(body).toContain("/oauth/login");
    expect(body).toContain("Sign in with Google");
    expect(body).not.toContain("先配置");
  });

  test("local /oauth/login redirects to Google", async () => {
    const resp = await handleRequest(new Request("http://127.0.0.1:8787/oauth/login"), {});
    expect(resp.status).toBe(302);
    const loc = resp.headers.get("location") ?? "";
    expect(loc.startsWith("https://accounts.google.com/")).toBe(true);
    expect(loc).toContain(`client_id=${DEFAULT_OAUTH_CLIENT_ID}`);
    expect(loc).toContain("redirect_uri=http%3A%2F%2F127.0.0.1%3A8787%2Foauth%2Fcallback");
    expect(resp.headers.get("set-cookie") ?? "").toContain("agy_oauth=");
  });

  test("remote /oauth/login shows paste form", async () => {
    const resp = await handleRequest(new Request("https://example.workers.dev/oauth/login"), env);
    expect(resp.status).toBe(200);
    const body = await resp.text();
    expect(body).toContain("oauth/complete");
    expect(body).toContain("localhost:51121");
    expect(body).toContain("accounts.google.com");
  });

  test("callback without cookie fails", async () => {
    const resp = await handleRequest(new Request("http://127.0.0.1:8787/oauth/callback?code=abc&state=s"), env);
    expect(resp.status).toBe(400);
    expect(await resp.text()).toContain("oauth session expired");
  });
});
