import { SERVER_NAME, SERVER_VERSION } from "./mcp.ts";
import type { SessionSource } from "./types.ts";

export function landingHtml(opts: {
  session: SessionSource;
  authRequired: boolean;
  origin: string;
}): string {
  const sessionLabel = {
    env: "server env (AGY_REFRESH_TOKEN)",
    header: "request header",
    file: "local agy token file",
    missing: "missing — import your agy login",
  }[opts.session];

  return `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${SERVER_NAME} MCP</title>
<style>
  :root { color-scheme: dark; }
  body { font: 15px/1.5 ui-sans-serif, system-ui, sans-serif; max-width: 720px; margin: 48px auto; padding: 0 20px; color: #e8eaed; background: #111; }
  h1 { font-size: 22px; font-weight: 620; margin: 0 0 8px; }
  .muted { color: #9aa0a6; }
  code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; }
  pre { background: #1c1c1c; border: 1px solid #2a2a2a; padding: 12px 14px; overflow: auto; border-radius: 8px; }
  .ok { color: #81c995; }
  .bad { color: #f28b82; }
  a { color: #8ab4f8; }
</style>
<h1>${SERVER_NAME}</h1>
<p class="muted">Streamable HTTP MCP · ${SERVER_VERSION}</p>
<p>Session: <span class="${opts.session === "missing" ? "bad" : "ok"}">${sessionLabel}</span></p>
<p>MCP endpoint: <code>${opts.origin}/mcp</code>${opts.authRequired ? " · Bearer token required" : ""}</p>
<h2>Grok</h2>
<pre>[mcp_servers.agy-web-search]
url = "${opts.origin}/mcp"${opts.authRequired ? `
headers = { Authorization = "Bearer \${AGY_MCP_TOKEN}" }` : ""}</pre>
<h2>拿 Google session</h2>
<ol>
  <li>本机先 <code>agy</code> 登录（token 在 <code>~/.gemini/antigravity-cli/antigravity-oauth-token</code>）</li>
  <li>本地开发：<code>bun run dev</code> 会自动读这个文件</li>
  <li>部署：<code>bun run import-agy</code> 再 <code>npx wrangler secret put AGY_REFRESH_TOKEN</code></li>
</ol>
<p class="muted">也可以在每次请求带 <code>X-Agy-Refresh-Token</code>，服务端不存 Google token。</p>
</html>`;
}
