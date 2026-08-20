import type { AppEnv, RequestSession } from "./types.ts";
import { getAccessToken, invalidateAccessToken } from "./session.ts";

export const DEFAULT_CLOUD_BASE = "https://daily-cloudcode-pa.googleapis.com/v1internal";
export const DEFAULT_PROJECT = "default-cli-project";
export const DEFAULT_SEARCH_MODEL = "gemini-3.6-flash-high";
export const DEFAULT_IMAGE_MODEL = "gemini-3.1-flash-image";

export function cloudRpcUrl(env: AppEnv, rpc: string): string {
  const custom = env.AGY_SEARCH_ENDPOINT?.trim();
  if (custom) return custom.replace(/:[^:/]+$/, `:${rpc}`);
  return `${DEFAULT_CLOUD_BASE}:${rpc}`;
}

export function cloudProject(env: AppEnv): string {
  return env.AGY_SEARCH_PROJECT?.trim() || DEFAULT_PROJECT;
}

export async function cloudPost(
  env: AppEnv,
  session: RequestSession,
  rpc: string,
  payload: unknown,
): Promise<{ status: number; text: string }> {
  const url = cloudRpcUrl(env, rpc);
  let token = await getAccessToken(session, env);
  let resp = await post(url, token, payload);
  if (resp.status === 401 && session.refreshToken) {
    invalidateAccessToken(session);
    token = await getAccessToken(session, env);
    resp = await post(url, token, payload);
  }
  const text = await resp.text();
  return { status: resp.status, text };
}

function post(url: string, token: string, payload: unknown): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "antigravity",
    },
    body: JSON.stringify(payload),
  });
}
