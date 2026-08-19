import { homedir } from "node:os";
import { createHash, randomBytes } from "node:crypto";
import { join } from "node:path";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const tokenPath =
  process.env.AGY_OAUTH_TOKEN_PATH ||
  join(homedir(), ".gemini", "antigravity-cli", "antigravity-oauth-token");
const projectPath = join(homedir(), ".gemini", "antigravity-cli", "cache", "default_project_id.txt");
const dest = join(import.meta.dir, "..", ".dev.vars");

if (!existsSync(tokenPath)) {
  console.error(`no agy token at ${tokenPath}`);
  console.error("先在本机跑一次 agy 完成 Google 登录");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(tokenPath, "utf8")) as {
  token?: { refresh_token?: string; access_token?: string };
  refresh_token?: string;
};
const refresh = raw.token?.refresh_token || raw.refresh_token;
if (!refresh) {
  console.error("token file has no refresh_token; re-login with agy");
  process.exit(1);
}

const existing = existsSync(dest) ? parseVars(readFileSync(dest, "utf8")) : {};
const mcpToken = existing.MCP_AUTH_TOKEN || process.env.MCP_AUTH_TOKEN || randomToken();
const project =
  process.env.AGY_SEARCH_PROJECT ||
  (existsSync(projectPath) ? readFileSync(projectPath, "utf8").trim() : "") ||
  "default-cli-project";

const vars: Record<string, string> = {
  ...existing,
  AGY_REFRESH_TOKEN: refresh,
  AGY_SEARCH_PROJECT: project,
  AGY_SEARCH_MODEL: existing.AGY_SEARCH_MODEL || "gemini-3.6-flash-high",
  MCP_AUTH_TOKEN: mcpToken,
};
if (process.env.AGY_OAUTH_CLIENT_ID) vars.AGY_OAUTH_CLIENT_ID = process.env.AGY_OAUTH_CLIENT_ID;
if (process.env.AGY_OAUTH_CLIENT_SECRET) vars.AGY_OAUTH_CLIENT_SECRET = process.env.AGY_OAUTH_CLIENT_SECRET;

writeFileSync(
  dest,
  Object.entries(vars)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n") + "\n",
  { mode: 0o600 },
);

const fingerprint = createHash("sha256").update(refresh).digest("hex").slice(0, 8);
console.log(`wrote ${dest}`);
console.log(`refresh_token fingerprint ${fingerprint}`);
console.log(`MCP_AUTH_TOKEN ${mcpToken}`);
console.log(`
不必先导入也能部署：打开网站 Sign in with Google 即可。

Cloudflare:
  npx wrangler login
  npx wrangler secret put MCP_AUTH_TOKEN      # ${mcpToken}
  npx wrangler deploy
  # 可选：登录页复制 refresh_token 后再
  # npx wrangler secret put AGY_REFRESH_TOKEN

Vercel:
  npx vercel env add MCP_AUTH_TOKEN
  npx vercel --prod

Grok (after deploy, replace URL):
[mcp_servers.agy-web-search]
url = "https://agy-web-search-mcp.<subdomain>.workers.dev/mcp"
headers = { Authorization = "Bearer ${mcpToken}", "X-Agy-Refresh-Token" = "\${AGY_REFRESH_TOKEN}" }
`);

function parseVars(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

function randomToken(): string {
  return randomBytes(24).toString("base64url");
}
