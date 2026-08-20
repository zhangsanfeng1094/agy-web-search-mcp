# agy-web-search MCP

独立的 Streamable HTTP MCP：把 agy 的 Google 登录做成可部署的 `/mcp` 端点。Agent 里的名称是 `agy`，工具是 `search_web`（网页搜索）和 `generate_image`（生成图片）。本地、Cloudflare Workers、Vercel Edge 共用同一套 handler。

先部署，再打开网站用 Google 登录拿 session。服务端不必事先写入 `AGY_REFRESH_TOKEN`。

## 一键部署

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/zhangsanfeng1094/agy-web-search-mcp)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zhangsanfeng1094/agy-web-search-mcp&project-name=agy-web-search-mcp&repository-name=agy-web-search-mcp&env=MCP_AUTH_TOKEN&envDescription=Optional%20Bearer%20token%20that%20protects%20/mcp)

内置了 agy 桌面端 OAuth 客户端，部署完直接打开网站 **Sign in with Google**。不必再填 `AGY_OAUTH_CLIENT_ID` / `AGY_OAUTH_CLIENT_SECRET`。

可选：设一个 `MCP_AUTH_TOKEN`，保护公开的 `/mcp`。Cloudflare 更合适：搜索经常超过 Vercel Hobby 的 10s 超时。

## Cloudflare Workers

```bash
npx wrangler login
npx wrangler secret put MCP_AUTH_TOKEN       # 可选：自己生成一个 Bearer，保护 /mcp
npx wrangler deploy
```

打开 `https://agy-web-search-mcp.<subdomain>.workers.dev/`，点 **Sign in with Google**。

agy 用的是桌面端 OAuth 客户端，只能回调 `http://localhost:51121/oauth-callback`。授权后那个页面会打不开，把地址栏完整 URL 贴回网站。登录成功后 session 写在这个浏览器的 `localStorage`，首页会显示已登录，并给出带 `X-Agy-Refresh-Token` 的 Grok 配置。

上线 MCP：`https://agy-web-search-mcp.<subdomain>.workers.dev/mcp`

首页监控在 Cloudflare 上记到 Durable Object，Grok 调 `/mcp` 之后刷新网站能看到成功/失败/耗时。本地 `bun run dev` 仍是进程内存。

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

侧边栏 **工具测试** 可以直接调 `search_web` / `generate_image`（和 Agent 一样 `POST /mcp`），不必先配 MCP 客户端。生图支持上传本地参考图，浏览器会读成 base64。调用会出现在监控里。

## Grok

登录成功后首页点 **一键复制**，把 prompt 贴给 Agent，让它写入 MCP 配置。token 来自这个浏览器的 `localStorage`。远程一般是：

```toml
[mcp_servers.agy]
url = "https://agy-web-search-mcp.<subdomain>.workers.dev/mcp"
headers = { Authorization = "Bearer ${AGY_MCP_TOKEN}", "X-Agy-Refresh-Token" = "${AGY_REFRESH_TOKEN}" }
```

`AGY_MCP_TOKEN` 就是 `MCP_AUTH_TOKEN`。页面 storage 只给网页自己用；Grok 调 `/mcp` 时必须带 header。也可以事后 `wrangler secret put AGY_REFRESH_TOKEN`，这样 Grok 就不用带 `X-Agy-Refresh-Token`。

本地：

```toml
[mcp_servers.agy]
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
| `AGY_IMAGE_MODEL` | 可选。覆盖 `fetchAvailableModels` 里的生图模型，默认 `gemini-3.1-flash-image` |
| `AGY_OAUTH_TOKEN_PATH` | 本地 token 文件覆盖路径 |
