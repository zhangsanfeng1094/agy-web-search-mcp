# agy-web-search MCP

独立的 Streamable HTTP MCP：把本机 `agy` 的 Google 登录做成可部署的 `/mcp` 端点。本地、Cloudflare Workers、Vercel Edge 共用同一套 handler。

## 本地（自动读 Google session）

本机已经 `agy` 登录过的话，直接：

```bash
bun run dev
```

会读 `~/.gemini/antigravity-cli/antigravity-oauth-token`，监听 `http://127.0.0.1:8787/mcp`。

Grok：

```toml
[mcp_servers.agy-web-search]
url = "http://127.0.0.1:8787/mcp"
```

## 导出 session，准备部署

```bash
bun run import-agy
```

从 agy token 文件抽出 `refresh_token`，写入 `.dev.vars`（已 gitignore），并打印一个 `MCP_AUTH_TOKEN`。

## Cloudflare Workers

```bash
npx wrangler login
npx wrangler secret put AGY_REFRESH_TOKEN    # 粘贴 refresh_token
npx wrangler secret put MCP_AUTH_TOKEN       # 粘贴 import-agy 打印的 token
npx wrangler secret put AGY_OAUTH_CLIENT_ID
npx wrangler secret put AGY_OAUTH_CLIENT_SECRET
npx wrangler deploy
```

上线地址：`https://agy-web-search-mcp.<subdomain>.workers.dev/mcp`

## Vercel

```bash
npx vercel env add AGY_REFRESH_TOKEN
npx vercel env add MCP_AUTH_TOKEN
npx vercel env add AGY_OAUTH_CLIENT_ID
npx vercel env add AGY_OAUTH_CLIENT_SECRET
npx vercel --prod
```

Hobby 默认 10s 超时，搜索偶尔会不够；Cloudflare 更合适。

## Grok 远程

```toml
[mcp_servers.agy-web-search]
url = "https://agy-web-search-mcp.<subdomain>.workers.dev/mcp"
headers = { Authorization = "Bearer ${AGY_MCP_TOKEN}" }
```

`AGY_MCP_TOKEN` 就是 `MCP_AUTH_TOKEN`。也可以不把 Google token 放服务端，每次请求带：

```toml
headers = { Authorization = "Bearer ${AGY_MCP_TOKEN}", "X-Agy-Refresh-Token" = "${AGY_REFRESH_TOKEN}" }
```

## 环境变量

| 变量 | 作用 |
| --- | --- |
| `AGY_REFRESH_TOKEN` | agy Google refresh token |
| `AGY_OAUTH_CLIENT_ID` | agy 桌面端 OAuth client id（不要提交到 git） |
| `AGY_OAUTH_CLIENT_SECRET` | agy 桌面端 OAuth client secret（不要提交到 git） |
| `MCP_AUTH_TOKEN` | 保护 `/mcp` 的 Bearer |
| `AGY_SEARCH_PROJECT` | 默认 `default-cli-project` |
| `AGY_SEARCH_MODEL` | 默认 `gemini-3.6-flash-high` |
| `AGY_OAUTH_TOKEN_PATH` | 本地 token 文件覆盖路径 |
