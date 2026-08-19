# agy-web-search MCP

独立的 Streamable HTTP MCP：把 agy 的 Google 登录做成可部署的 `/mcp` 端点。本地、Cloudflare Workers、Vercel Edge 共用同一套 handler。

先部署，再打开网站用 Google 登录拿 session。服务端不必事先写入 `AGY_REFRESH_TOKEN`。

## 部署（先 fork）

Cloudflare / Vercel 的「一键部署」会在你账号里**另建一份独立仓库**，不是 fork，之后没法点 Sync fork 跟上游。正确做法是先 fork，再部署这份 fork。

1. [Fork 这个仓库](https://github.com/zhangsanfeng1094/agy-web-search-mcp/fork)
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Import a repository**，选你刚 fork 出来的仓库
3. 部署完成后打开网站，点 **Sign in with Google**

内置了 agy 桌面端 OAuth 客户端，不必再填 `AGY_OAUTH_CLIENT_ID` / `AGY_OAUTH_CLIENT_SECRET`。可选：在 Worker Secrets 里加 `MCP_AUTH_TOKEN`，保护公开的 `/mcp`。

Vercel 同样先 fork，再 [Import](https://vercel.com/new) 你的 fork。Cloudflare 更合适：搜索经常超过 Vercel Hobby 的 10s 超时。

## Cloudflare Workers（本机）

```bash
git clone https://github.com/<你的用户名>/agy-web-search-mcp.git
cd agy-web-search-mcp
npx wrangler login
npx wrangler secret put MCP_AUTH_TOKEN       # 可选：自己生成一个 Bearer，保护 /mcp
npx wrangler deploy
```

打开 `https://agy-web-search-mcp.<subdomain>.workers.dev/`，点 **Sign in with Google**。

agy 用的是桌面端 OAuth 客户端，只能回调 `http://localhost:51121/oauth-callback`。授权后那个页面会打不开，把地址栏完整 URL 贴回网站即可拿到 `refresh_token` 和 Grok 配置。

上线 MCP：`https://agy-web-search-mcp.<subdomain>.workers.dev/mcp`

## Vercel

```bash
npx vercel env add MCP_AUTH_TOKEN            # 可选
npx vercel --prod
```

Hobby 默认 10s 超时，搜索偶尔会不够；Cloudflare 更合适。

## 本地

```bash
bun run dev
```

打开 `http://127.0.0.1:8787/` 登录。本机回调由服务自己接住。如果本机已经 `agy` 登录过，也会自动读 `~/.gemini/antigravity-cli/antigravity-oauth-token`。

## Grok

登录成功页会给出完整片段。远程一般是：

```toml
[mcp_servers.agy-web-search]
url = "https://agy-web-search-mcp.<subdomain>.workers.dev/mcp"
headers = { Authorization = "Bearer ${AGY_MCP_TOKEN}", "X-Agy-Refresh-Token" = "${AGY_REFRESH_TOKEN}" }
```

`AGY_MCP_TOKEN` 就是 `MCP_AUTH_TOKEN`。服务端不存 Google token；也可以事后 `wrangler secret put AGY_REFRESH_TOKEN`，这样 Grok 就不用带 `X-Agy-Refresh-Token`。

本地：

```toml
[mcp_servers.agy-web-search]
url = "http://127.0.0.1:8787/mcp"
```

## 可选：从本机 agy 文件导入

```bash
bun run import-agy
```

从 token 文件抽出 `refresh_token`，写入 `.dev.vars`（已 gitignore）。

## 环境变量

| 变量 | 作用 |
| --- | --- |
| `AGY_OAUTH_CLIENT_ID` | 可选。覆盖内置的 agy 桌面端 OAuth client id |
| `AGY_OAUTH_CLIENT_SECRET` | 可选。覆盖内置的 agy 桌面端 OAuth client secret |
| `AGY_OAUTH_REDIRECT_URI` | 可选。自己的 Web 客户端回调，例如 `https://xxx.workers.dev/oauth/callback`，部署后即可自动回跳 |
| `AGY_REFRESH_TOKEN` | 可选。服务端保存的 Google refresh token |
| `MCP_AUTH_TOKEN` | 保护 `/mcp` 的 Bearer |
| `AGY_SEARCH_PROJECT` | 默认 `default-cli-project` |
| `AGY_SEARCH_MODEL` | 默认 `gemini-3.6-flash-high` |
| `AGY_OAUTH_TOKEN_PATH` | 本地 token 文件覆盖路径 |
