import type { AppEnv, RequestSession } from "./types.ts";
import { DEFAULT_SEARCH_MODEL, cloudPost, cloudProject } from "./cloud.ts";

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

  const model = env.AGY_SEARCH_MODEL?.trim() || DEFAULT_SEARCH_MODEL;
  const { status, text } = await cloudPost(env, session, "generateContent", {
    project: cloudProject(env),
    model,
    request: {
      contents: [{ role: "user", parts: [{ text: query }] }],
      tools: [{ googleSearch: {} }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
    },
  });
  let parsed: GenerateResponse;
  try {
    parsed = JSON.parse(text) as GenerateResponse;
  } catch {
    throw new Error(`search parse failed: ${text.slice(0, 400)}`);
  }
  if (parsed.error?.message) throw new Error(`search api: ${parsed.error.message}`);
  if (status < 200 || status >= 300) throw new Error(`search api http ${status}: ${text.slice(0, 400)}`);
  if (!parsed.response?.candidates?.length) throw new Error("search api returned no candidates");
  return formatSearchResult(query, parsed);
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
      if (c.web?.uri) lines.push(`    ${c.web?.uri}`);
    });
  }
  return lines.join("\n").trim();
}
