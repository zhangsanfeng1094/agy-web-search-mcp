import type { AppEnv } from "../src/types.ts";
import { handleRequest } from "../src/handler.ts";

export const config = { runtime: "edge", maxDuration: 60 };

export default function handler(req: Request): Promise<Response> {
  const env: AppEnv = {
    AGY_REFRESH_TOKEN: process.env.AGY_REFRESH_TOKEN,
    AGY_ACCESS_TOKEN: process.env.AGY_ACCESS_TOKEN,
    AGY_OAUTH_CLIENT_ID: process.env.AGY_OAUTH_CLIENT_ID,
    AGY_OAUTH_CLIENT_SECRET: process.env.AGY_OAUTH_CLIENT_SECRET,
    AGY_OAUTH_REDIRECT_URI: process.env.AGY_OAUTH_REDIRECT_URI,
    AGY_SEARCH_PROJECT: process.env.AGY_SEARCH_PROJECT,
    AGY_SEARCH_MODEL: process.env.AGY_SEARCH_MODEL,
    AGY_SEARCH_ENDPOINT: process.env.AGY_SEARCH_ENDPOINT,
    MCP_AUTH_TOKEN: process.env.MCP_AUTH_TOKEN,
  };
  return handleRequest(req, env);
}
