import { homedir } from "node:os";
import { join } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import type { AppEnv, RequestSession } from "./types.ts";
import { handleRequest } from "./handler.ts";

const port = Number(process.env.PORT || 8787);
const env = loadEnv();
const fileSession = loadAgyFile();

const server = Bun.serve({
  hostname: "127.0.0.1",
  port,
  fetch(req) {
    return handleRequest(req, env, fileSession);
  },
});

const origin = `http://127.0.0.1:${server.port}`;
console.log(`agy MCP  ${origin}/mcp`);
console.log(`login               ${origin}/`);
console.log(`session             ${fileSession?.refreshToken || env.AGY_REFRESH_TOKEN ? (env.AGY_REFRESH_TOKEN ? "env" : "agy token file") : "MISSING — open / to sign in"}`);
if (env.MCP_AUTH_TOKEN) console.log("auth                Bearer MCP_AUTH_TOKEN");
console.log(`\nGrok:\n[mcp_servers.agy]\nurl = "${origin}/mcp"${
  env.MCP_AUTH_TOKEN ? `\nheaders = { Authorization = "Bearer \${AGY_MCP_TOKEN}" }` : ""
}\n`);

function loadEnv(): AppEnv {
  const out: AppEnv = { ...process.env } as AppEnv;
  const path = join(import.meta.dir, "..", ".dev.vars");
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) (out as Record<string, string>)[k] = v;
  }
  return out;
}

function loadAgyFile(): RequestSession | undefined {
  const path =
    process.env.AGY_OAUTH_TOKEN_PATH ||
    join(homedir(), ".gemini", "antigravity-cli", "antigravity-oauth-token");
  if (!existsSync(path)) return undefined;
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as {
      token?: { refresh_token?: string; access_token?: string };
      refresh_token?: string;
      access_token?: string;
    };
    const refreshToken = raw.token?.refresh_token || raw.refresh_token;
    const accessToken = raw.token?.access_token || raw.access_token;
    if (!refreshToken && !accessToken) return undefined;
    return { refreshToken, accessToken, source: "file" };
  } catch {
    return undefined;
  }
}
