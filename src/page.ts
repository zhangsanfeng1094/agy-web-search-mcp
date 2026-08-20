import { SERVER_NAME, SERVER_VERSION } from "./mcp.ts";
import type { MetricsSnapshot } from "./metrics.ts";
import type { SessionSource } from "./types.ts";

const CSS = `
  :root { color-scheme: dark; }
  body { font: 15px/1.5 ui-sans-serif, system-ui, sans-serif; max-width: 720px; margin: 48px auto; padding: 0 20px; color: #e8eaed; background: #111; }
  h1 { font-size: 22px; font-weight: 620; margin: 0 0 8px; }
  h2 { font-size: 16px; font-weight: 620; margin: 28px 0 8px; }
  .muted { color: #9aa0a6; }
  code, pre, textarea { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; }
  pre { background: #1c1c1c; border: 1px solid #2a2a2a; padding: 12px 14px; overflow: auto; border-radius: 8px; }
  textarea { width: 100%; min-height: 88px; box-sizing: border-box; background: #1c1c1c; color: #e8eaed; border: 1px solid #2a2a2a; border-radius: 8px; padding: 10px 12px; }
  .ok { color: #81c995; }
  .bad { color: #f28b82; }
  a { color: #8ab4f8; }
  .btn { display: inline-block; background: #8ab4f8; color: #111; text-decoration: none; font-weight: 620; padding: 8px 14px; border-radius: 8px; border: 0; cursor: pointer; font: inherit; }
  .btn.ghost { background: transparent; color: #8ab4f8; border: 1px solid #3c4043; }
  form { margin: 16px 0; }
  ol { padding-left: 20px; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px; margin: 14px 0 8px; }
  .stat { background: #1c1c1c; border: 1px solid #2a2a2a; border-radius: 8px; padding: 10px 12px; }
  .stat .n { font-size: 22px; font-weight: 650; letter-spacing: -0.03em; }
  .stat .l { color: #9aa0a6; font-size: 12px; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 7px 8px; border-bottom: 1px solid #2a2a2a; vertical-align: top; }
  th { color: #9aa0a6; font-weight: 550; }
  td.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; }
  td.q { word-break: break-word; }
  .row { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin: 28px 0 8px; }
  .row h2 { margin: 0; }
`;

export const SESSION_STORAGE_KEY = "agy-web-search-session";

export function landingHtml(opts: {
  session: SessionSource;
  authRequired: boolean;
  origin: string;
  oauthManual: boolean;
  metrics: MetricsSnapshot;
}): string {
  const sessionLabel = {
    env: "server env (AGY_REFRESH_TOKEN)",
    header: "request header",
    file: "local agy token file",
    missing: "missing — sign in with Google",
  }[opts.session];

  const prompt = agentConfigPrompt({
    origin: opts.origin,
    authRequired: opts.authRequired,
    refreshToken: undefined,
  });
  const hint = opts.oauthManual
    ? "agy 的 OAuth 客户端只能回调 localhost。授权后浏览器会打开一个打不开的页面，把地址栏完整 URL 贴回来即可。"
    : "本机回调会自动接住授权码，登录后 session 写进这个浏览器的 localStorage。";

  return `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${SERVER_NAME} MCP</title>
<meta http-equiv="refresh" content="15">
<style>${CSS}</style>
<body data-origin="${escapeHtml(opts.origin)}" data-auth="${opts.authRequired ? "1" : "0"}">
<h1>${SERVER_NAME}</h1>
<p class="muted">Streamable HTTP MCP · ${SERVER_VERSION}</p>
<p>Session: <span id="session-status" data-source="${opts.session}" class="${opts.session === "missing" ? "bad" : "ok"}">${escapeHtml(sessionLabel)}</span></p>
<p>MCP endpoint: <code>${escapeHtml(opts.origin)}/mcp</code>${opts.authRequired ? " · Bearer token required" : ""}</p>
${metricsHtml(opts.metrics)}
<div id="login-section">
<h2 id="login-title">用 Google 登录拿 session</h2>
<p id="login-account" hidden>账号: <span id="login-email" class="ok"></span></p>
<p><a class="btn" id="login-btn" href="/oauth/login">Sign in with Google</a>
<button type="button" class="btn ghost" id="logout-btn" hidden>退出</button></p>
<p class="muted" id="login-hint">${escapeHtml(hint)}</p>
</div>
<div class="row">
<h2>给 Agent 的配置 prompt</h2>
<button type="button" class="btn" id="copy-agent-prompt">一键复制</button>
<span id="copy-agent-status" class="muted"></span>
</div>
<pre id="agent-prompt">${escapeHtml(prompt)}</pre>
<p class="muted">复制后贴给 Grok / Claude / Cursor，让它写入 MCP 配置。登录成功后 prompt 会带上 <code>X-Agy-Refresh-Token</code>（存在这个浏览器的 localStorage）。也可以再 <code>wrangler secret put AGY_REFRESH_TOKEN</code> 存到服务端。</p>
${browserSessionScript()}
</body>
</html>`;
}

export function oauthWaitHtml(opts: { authUrl: string; error?: string }): string {
  return `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Google 登录 · ${SERVER_NAME}</title>
<style>${CSS}</style>
<h1>完成 Google 授权</h1>
<p class="muted">agy 桌面端 OAuth 只能回调 localhost，部署后需要手动贴回回调 URL。</p>
<ol>
  <li>打开 <a href="${escapeHtml(opts.authUrl)}" target="_blank" rel="noopener">Google 授权页</a></li>
  <li>登录并同意权限</li>
  <li>浏览器会跳到 <code>http://localhost:51121/oauth-callback?code=...</code>，页面打不开是正常的</li>
  <li>复制地址栏完整 URL，粘贴到下面</li>
</ol>
${opts.error ? `<p class="bad">${escapeHtml(opts.error)}</p>` : ""}
<form method="post" action="/oauth/complete">
  <textarea name="callback" required placeholder="http://localhost:51121/oauth-callback?code=..."></textarea>
  <p><button class="btn" type="submit">完成登录</button>
  <a class="btn ghost" href="/">返回</a></p>
</form>
</html>`;
}

export function oauthSuccessHtml(opts: {
  origin: string;
  authRequired: boolean;
  refreshToken: string;
  email?: string;
}): string {
  const grok = grokSnippet(opts.origin, opts.authRequired, opts.refreshToken);
  return `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>已拿到 session · ${SERVER_NAME}</title>
<style>${CSS}</style>
<body>
<h1>已拿到 Google session</h1>
<p>账号: <span class="ok">${escapeHtml(opts.email || "(unknown)")}</span></p>
<p class="muted">已写入这个浏览器的 localStorage，正在返回首页…</p>
<h2>refresh_token</h2>
<pre>${escapeHtml(opts.refreshToken)}</pre>
<h2>Grok</h2>
<pre>${escapeHtml(grok)}</pre>
<p><a class="btn ghost" href="/">如果没有自动跳转，点这里</a></p>
${browserSessionScript({ refreshToken: opts.refreshToken, email: opts.email })}
</body>
</html>`;
}

export function oauthErrorHtml(message: string): string {
  return `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>登录失败 · ${SERVER_NAME}</title>
<style>${CSS}</style>
<h1>登录失败</h1>
<p class="bad">${escapeHtml(message)}</p>
<p><a class="btn" href="/oauth/login">重试</a> <a class="btn ghost" href="/">返回</a></p>
</html>`;
}

function metricsHtml(m: MetricsSnapshot): string {
  const rate = m.total ? `${Math.round((m.ok / m.total) * 100)}%` : "—";
  const rows = m.recent.length
    ? m.recent
        .map((e) => {
          const err = e.error ? `<div class="muted">${escapeHtml(e.error)}</div>` : "";
          return `<tr>
            <td class="mono">${escapeHtml(fmtTime(e.at))}</td>
            <td class="${e.ok ? "ok" : "bad"}">${e.ok ? "ok" : "fail"}</td>
            <td class="mono">${escapeHtml(fmtMs(e.ms))}</td>
            <td class="q">${escapeHtml(e.query || e.tool)}${err}</td>
          </tr>`;
        })
        .join("")
    : `<tr><td colspan="4" class="muted">还没有 search_web 调用</td></tr>`;
  return `<h2>监控</h2>
<div class="stats">
  ${statBox(String(m.total), "总调用")}
  ${statBox(String(m.ok), "成功", "ok")}
  ${statBox(String(m.fail), "失败", m.fail ? "bad" : undefined)}
  ${statBox(rate, "成功率", m.fail && m.ok === 0 ? "bad" : "ok")}
  ${statBox(m.lastMs != null ? fmtMs(m.lastMs) : "—", "最近耗时")}
  ${statBox(m.avgMs != null ? fmtMs(m.avgMs) : "—", "平均耗时")}
  ${statBox(m.p95Ms != null ? fmtMs(m.p95Ms) : "—", "P95")}
  ${statBox(String(m.authFail), "未授权", m.authFail ? "bad" : undefined)}
</div>
<p class="muted">${m.total ? `自 ${escapeHtml(fmtTime(m.startedAt))} 起。` : ""}${
    m.persistent
      ? "跨请求保存在 Cloudflare Durable Object。"
      : "记在当前进程内存里，重启或 Worker 冷启动会清零。"
  }每 15 秒刷新。</p>
<table>
  <thead><tr><th>时间</th><th>结果</th><th>耗时</th><th>查询</th></tr></thead>
  <tbody>${rows}</tbody>
</table>`;
}

function statBox(n: string, label: string, tone?: "ok" | "bad"): string {
  return `<div class="stat"><div class="n${tone ? ` ${tone}` : ""}">${escapeHtml(n)}</div><div class="l">${escapeHtml(label)}</div></div>`;
}

function fmtMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(ms >= 10_000 ? 0 : 1)}s` : `${ms}ms`;
}

function fmtTime(at: number): string {
  return new Date(at).toISOString().replace("T", " ").slice(0, 19) + "Z";
}

function jsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function browserSessionScript(justLoggedIn?: { refreshToken: string; email?: string }): string {
  return `<script>
(function () {
  var KEY = ${jsonForScript(SESSION_STORAGE_KEY)};
  var justLoggedIn = ${justLoggedIn ? jsonForScript({ refreshToken: justLoggedIn.refreshToken, email: justLoggedIn.email || "" }) : "null"};
  if (justLoggedIn && justLoggedIn.refreshToken) {
    localStorage.setItem(KEY, JSON.stringify({
      refreshToken: justLoggedIn.refreshToken,
      email: justLoggedIn.email || "",
      savedAt: Date.now()
    }));
    location.replace("/");
    return;
  }
  var origin = document.body.getAttribute("data-origin") || "";
  var auth = document.body.getAttribute("data-auth") === "1";
  var s = null;
  try {
    s = JSON.parse(localStorage.getItem(KEY) || "null");
  } catch (e) {
    s = null;
  }
  if (s && typeof s.refreshToken === "string" && s.refreshToken) {
    var status = document.getElementById("session-status");
    if (status && status.getAttribute("data-source") === "missing") {
      status.className = "ok";
      status.textContent = s.email ? ("browser (" + s.email + ")") : "browser (localStorage)";
      var promptEl = document.getElementById("agent-prompt");
      if (promptEl) promptEl.textContent = agentClientPrompt(origin, auth, s.refreshToken);
    }
    var title = document.getElementById("login-title");
    var account = document.getElementById("login-account");
    var emailEl = document.getElementById("login-email");
    var loginBtn = document.getElementById("login-btn");
    var logout = document.getElementById("logout-btn");
    var hint = document.getElementById("login-hint");
    if (title) title.textContent = "浏览器里已有 session";
    if (account) account.hidden = false;
    if (emailEl) emailEl.textContent = s.email || "(unknown)";
    if (loginBtn) loginBtn.textContent = "重新登录";
    if (logout) {
      logout.hidden = false;
      logout.addEventListener("click", function () {
        localStorage.removeItem(KEY);
        location.reload();
      });
    }
    if (hint) {
      hint.textContent = "session 存在这个浏览器的 localStorage。点一键复制，把 prompt 贴给 Agent 写入 MCP 配置。";
    }
  }
  var copyBtn = document.getElementById("copy-agent-prompt");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var el = document.getElementById("agent-prompt");
      var text = el ? el.textContent || "" : "";
      copyText(text).then(function (ok) {
        var st = document.getElementById("copy-agent-status");
        if (st) st.textContent = ok ? "已复制，去贴给 Agent" : "复制失败，请手动选中";
        if (ok) setTimeout(function () { if (st) st.textContent = ""; }, 2500);
      });
    });
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }
  function grokClientSnippet(origin, authRequired, refreshToken) {
    var headers = [];
    if (authRequired) headers.push('Authorization = "Bearer \${AGY_MCP_TOKEN}"');
    if (refreshToken) headers.push('"X-Agy-Refresh-Token" = "' + refreshToken + '"');
    var headerLine = headers.length ? "\\nheaders = { " + headers.join(", ") + " }" : "";
    return "[mcp_servers.agy-web-search]\\nurl = \\"" + origin + "/mcp\\"" + headerLine;
  }
  function agentClientPrompt(origin, authRequired, refreshToken) {
    var lines = [
      "请把下面这个 Streamable HTTP MCP 加到你的 MCP 配置里。",
      "Grok 直接用这段 TOML；其他客户端按同样的 url 和 headers 写成自己的格式。不要改 URL 和 header 的值。",
      "",
      "名称：agy-web-search",
      "传输：Streamable HTTP",
      "端点：" + origin + "/mcp",
      "工具：search_web(query) — 查新闻、近况和需要引用的事实；generate_image(prompt, image_name?, aspect_ratio?) — 生成图片文件",
      "",
      grokClientSnippet(origin, authRequired, refreshToken)
    ];
    if (authRequired) {
      lines.push("", "Authorization 里的 \${AGY_MCP_TOKEN} 换成你部署时设的 MCP_AUTH_TOKEN。");
    }
    if (!refreshToken) {
      lines.push("", "还没有 Google session。先打开网站 Sign in with Google，再复制一次；或自行补上 X-Agy-Refresh-Token。");
    }
    return lines.join("\\n");
  }
})();
</script>`;
}

export function agentConfigPrompt(opts: {
  origin: string;
  authRequired: boolean;
  refreshToken?: string;
}): string {
  const lines = [
    "请把下面这个 Streamable HTTP MCP 加到你的 MCP 配置里。",
    "Grok 直接用这段 TOML；其他客户端按同样的 url 和 headers 写成自己的格式。不要改 URL 和 header 的值。",
    "",
    "名称：agy-web-search",
    "传输：Streamable HTTP",
    `端点：${opts.origin}/mcp`,
    "工具：search_web(query) — 查新闻、近况和需要引用的事实；generate_image(prompt, image_name?, aspect_ratio?) — 生成图片文件",
    "",
    grokSnippet(opts.origin, opts.authRequired, opts.refreshToken),
  ];
  if (opts.authRequired) {
    lines.push("", "Authorization 里的 ${AGY_MCP_TOKEN} 换成你部署时设的 MCP_AUTH_TOKEN。");
  }
  if (!opts.refreshToken) {
    lines.push("", "还没有 Google session。先打开网站 Sign in with Google，再复制一次；或自行补上 X-Agy-Refresh-Token。");
  }
  return lines.join("\n");
}

function grokSnippet(origin: string, authRequired: boolean, refreshToken?: string): string {
  const headers: string[] = [];
  if (authRequired) headers.push('Authorization = "Bearer ${AGY_MCP_TOKEN}"');
  if (refreshToken) headers.push(`"X-Agy-Refresh-Token" = "${refreshToken}"`);
  const headerLine = headers.length ? `\nheaders = { ${headers.join(", ")} }` : "";
  return `[mcp_servers.agy-web-search]\nurl = "${origin}/mcp"${headerLine}`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}
