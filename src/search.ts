import type { AppEnv, RequestSession } from "./types.ts";
import { getAccessToken, invalidateAccessToken } from "./session.ts";

const DEFAULT_ENDPOINT = "https://daily-cloudcode-pa.googleapis.com/v1internal:generateContent";
const DEFAULT_MODEL = "gemini-3.6-flash-high";
const DEFAULT_PROJECT = "default-cli-project";

type GenerateResponse = {
  response?: {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      groundingMetadata?: {
        webSearchQueries?: string[];
        groundingChunks?: Array<{ web?: { uri?: string; title?: string } }>;
      };
    }>;
  };
  error?: { message?: string };
};

export async function searchWeb(query: string, env: AppEnv, session: RequestSession): Promise<string> {
  query = query.trim();
  if (!query) throw new Error("query is required");

  const endpoint = env.AGY_SEARCH_ENDPOINT?.trim() || DEFAULT_ENDPOINT;
  const model = env.AGY_SEARCH_MODEL?.trim() || DEFAULT_MODEL;
  const project = env.AGY_SEARCH_PROJECT?.trim() || DEFAULT_PROJECT;

  const payload = {
    project,
    model,
    request: {
      contents: [{ role: "user", parts: [{ text: query }] }],
      tools: [{ googleSearch: {} }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
    },
  };

  let token = await getAccessToken(session, env);
  let resp = await postSearch(endpoint, token, payload);
  if (resp.status === 401 && session.refreshToken) {
    invalidateAccessToken(session);
    token = await getAccessToken(session, env);
    resp = await postSearch(endpoint, token, payload);
  }
  const raw = await resp.text();
  let parsed: GenerateResponse;
  try {
    parsed = JSON.parse(raw) as GenerateResponse;
  } catch {
    throw new Error(`search parse failed: ${raw.slice(0, 400)}`);
  }
  if (parsed.error?.message) throw new Error(`search api: ${parsed.error.message}`);
  if (!resp.ok) throw new Error(`search api http ${resp.status}: ${raw.slice(0, 400)}`);
  if (!parsed.response?.candidates?.length) throw new Error("search api returned no candidates");
  return formatSearchResult(query, parsed);
}

function postSearch(endpoint: string, token: string, payload: unknown): Promise<Response> {
  return fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "antigravity",
    },
    body: JSON.stringify(payload),
  });
}

export function formatSearchResult(query: string, parsed: GenerateResponse): string {
  const cand = parsed.response?.candidates?.[0];
  const texts = (cand?.content?.parts ?? [])
    .map((p) => p.text?.trim() ?? "")
    .filter(Boolean);
  const lines = [`Query: ${query}`, ""];
  lines.push(texts.length ? texts.join("\n") : "(no text in model response)");

  const qs = cand?.groundingMetadata?.webSearchQueries ?? [];
  if (qs.length) {
    lines.push("", "Search queries:");
    for (const q of qs) lines.push(`- ${q}`);
  }
  const chunks = cand?.groundingMetadata?.groundingChunks ?? [];
  if (chunks.length) {
    lines.push("", "Sources:");
    chunks.forEach((c, i) => {
      const title = c.web?.title?.trim() || c.web?.uri || "source";
      lines.push(`[${i + 1}] ${title}`);
      if (c.web?.uri) lines.push(`    ${c.web.uri}`);
    });
  }
  return lines.join("\n").trim();
}
