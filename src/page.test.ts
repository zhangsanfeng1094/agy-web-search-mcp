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
    expect(html).toContain("generate_image");
    expect(html).toContain("网页搜索");
    expect(html).toContain("生成图片");
    expect(html).toContain("<h2>工具</h2>");
    expect(html).toContain("query");
    expect(html).toContain("image_name");
    expect(html).toContain("aspect_ratio");
    expect(html).toContain("images");
    expect(html).toContain("必填");
    expect(html).not.toContain('http-equiv="refresh"');
    expect(html).toContain('id="metrics-root"');
    expect(html).toContain('fetch("/health"');
    expect(html).toContain("agy-landing-view");
    expect(html).toContain("agy-landing-config-tab");
    expect(html).toContain("setInterval(refreshMetrics, 15000)");
    expect(html).toContain('id="view-playground"');
    expect(html).toContain('data-view="tools"');
    expect(html).toContain('id="tools-subview-list"');
    expect(html).toContain('id="tools-subview-test"');
    expect(html).toContain('id="tools-back-btn"');
    expect(html).toContain("返回工具列表");
    expect(html).toContain("工具测试");
    expect(html).toContain('id="pg-form"');
    expect(html).toContain('id="pg-query"');
    expect(html).toContain('id="pg-prompt"');
    expect(html).toContain('fetch("/mcp"');
    expect(html).toContain("X-Agy-Refresh-Token");
    expect(html).toContain("打开测试");
    expect(html).not.toContain('id="pg-auth"');
  });

  test("tool testing is in secondary subview of tools list", () => {
    const html = landingHtml({
      session: "missing",
      authRequired: false,
      origin: "https://example.workers.dev",
      oauthManual: true,
      metrics,
    });
    // Level 1 view has tools list with test links
    expect(html).toContain('id="tools-subview-list"');
    expect(html).toContain('href="#tools/search_web"');
    expect(html).toContain('href="#tools/generate_image"');

    // Level 2 subview has breadcrumb and playground
    expect(html).toContain('id="tools-subview-test"');
    expect(html).toContain('id="tools-back-btn"');
    expect(html).toContain('id="breadcrumb-tools-list"');
    expect(html).toContain('id="breadcrumb-tool-name"');
    expect(html).toContain('id="view-playground"');

    // Client routing handles secondary views
    expect(html).toContain("showToolsSubview");
    expect(html).toContain('rawHash.indexOf("tools/") === 0');
  });

  test("playground shows bearer field when MCP auth is on", () => {
    const html = landingHtml({
      session: "missing",
      authRequired: true,
      origin: "https://example.workers.dev",
      oauthManual: true,
      metrics,
    });
    expect(html).toContain('id="pg-auth"');
    expect(html).toContain("MCP_AUTH_TOKEN");
  });

  test("agent prompt includes url, tool, and tokens", () => {
    const text = agentConfigPrompt({
      origin: "https://example.workers.dev",
      authRequired: true,
      refreshToken: "1//tok",
    });
    expect(text).toContain("Streamable HTTP");
    expect(text).toContain("https://example.workers.dev/mcp");
    expect(text).toContain("名称：agy");
    expect(text).toContain("[mcp_servers.agy]");
    expect(text).toContain("search_web");
    expect(text).toContain("curl -L --fail -o");
    expect(text).toContain("禁止只贴远程链接");
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
