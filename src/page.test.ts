import { describe, expect, test } from "bun:test";
import { agentConfigPrompt, landingHtml, oauthSuccessHtml, SESSION_STORAGE_KEY } from "./page.ts";
import type { MetricsSnapshot } from "./metrics.ts";

const metrics: MetricsSnapshot = {
  startedAt: 0,
  total: 0,
  ok: 0,
  fail: 0,
  authFail: 0,
  recent: [],
};

describe("browser session storage", () => {
  test("landing hydrates from localStorage", () => {
    const html = landingHtml({
      session: "missing",
      authRequired: false,
      origin: "https://example.workers.dev",
      oauthManual: true,
      metrics,
    });
    expect(html).toContain(SESSION_STORAGE_KEY);
    expect(html).toContain('id="session-status"');
    expect(html).toContain('id="agent-prompt"');
    expect(html).toContain('id="copy-agent-prompt"');
    expect(html).toContain("一键复制");
    expect(html).toContain("localStorage.getItem");
    expect(html).toContain("browser (localStorage)");
    expect(html).toContain("https://example.workers.dev/mcp");
    expect(html).toContain("search_web");
  });

  test("agent prompt includes url, tool, and tokens", () => {
    const text = agentConfigPrompt({
      origin: "https://example.workers.dev",
      authRequired: true,
      refreshToken: "1//tok",
    });
    expect(text).toContain("Streamable HTTP");
    expect(text).toContain("https://example.workers.dev/mcp");
    expect(text).toContain("search_web");
    expect(text).toContain("1//tok");
    expect(text).toContain("X-Agy-Refresh-Token");
    expect(text).toContain("MCP_AUTH_TOKEN");
    expect(text).not.toContain("还没有 Google session");
  });

  test("oauth success writes localStorage then returns home", () => {
    const html = oauthSuccessHtml({
      origin: "https://example.workers.dev",
      authRequired: true,
      refreshToken: "1//0g-test-refresh",
      email: "a<script>@x.com",
    });
    expect(html).toContain(SESSION_STORAGE_KEY);
    expect(html).toContain("1//0g-test-refresh");
    expect(html).toContain("localStorage.setItem");
    expect(html).toContain('location.replace("/")');
    expect(html).toContain("\\u003cscript>");
    expect(html).not.toContain("a<script>@x.com");
  });
});
