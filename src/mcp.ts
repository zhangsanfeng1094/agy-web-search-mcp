import type { AppEnv, RequestSession } from "./types.ts";
import { searchWeb } from "./search.ts";
import { generateImage, parseImageArgs } from "./image.ts";
import { filesClient } from "./files.ts";

export const SERVER_NAME = "agy-web-search";
export const SERVER_VERSION = "0.4.0";
const SUPPORTED = new Set(["2024-11-05", "2025-03-26", "2025-06-18", "2026-07-28"]);

export type RpcRequest = {
  jsonrpc?: string;
  id?: unknown;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: unknown;
};

export type RpcResponse = {
  jsonrpc: "2.0";
  id?: unknown;
  result?: unknown;
  error?: { code: number; message: string };
};

export type RpcContext = {
  origin?: string;
};

export type ToolContent =
  | { type: "text"; text: string }
  | { type: "image"; data: string; mimeType: string };

export function isNotification(msg: RpcRequest): boolean {
  return msg.id === undefined || msg.id === null;
}

export function searchToolDef() {
  return {
    name: "search_web",
    description:
      "Search the live web using the Antigravity/agy Google session (Cloud Code googleSearch). Use for news, current events, and facts that need citations.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query, including dates or locale when relevant.",
        },
      },
      required: ["query"],
    },
  };
}

export function generateImageToolDef() {
  return {
    name: "generate_image",
    description:
      "Generate or edit an image with the Antigravity/agy Google session (Cloud Code image model). Returns the image file (bytes) plus a short-lived download URL. Use for UI mockups, icons, and assets. When drawing UI, omit device frames unless asked.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "What the image should depict, or how to edit the given images.",
        },
        image_name: {
          type: "string",
          description:
            "Short lowercase name with underscores, max 3 words, e.g. login_page_mockup. Used as the filename.",
        },
        aspect_ratio: {
          type: "string",
          enum: ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9"],
          description: "Defaults to 1:1.",
        },
        image_urls: {
          type: "array",
          items: { type: "string" },
          description: "Optional http(s) images to edit, combine, or use as references. Max 3.",
        },
      },
      required: ["prompt"],
    },
  };
}

export async function handleRpc(
  req: RpcRequest,
  env: AppEnv,
  session: RequestSession,
  ctx: RpcContext = {},
): Promise<RpcResponse> {
  const id = req.id;
  switch (req.method) {
    case "initialize": {
      const client = (req.params as { protocolVersion?: string } | undefined)?.protocolVersion;
      return {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: client && SUPPORTED.has(client) ? client : "2025-03-26",
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
        },
      };
    }
    case "ping":
      return { jsonrpc: "2.0", id, result: {} };
    case "tools/list":
      return { jsonrpc: "2.0", id, result: { tools: [searchToolDef(), generateImageToolDef()] } };
    case "tools/call": {
      try {
        const content = await callTool(req.params, env, session, ctx);
        return {
          jsonrpc: "2.0",
          id,
          result: { content },
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          jsonrpc: "2.0",
          id,
          result: { content: [{ type: "text", text: message }], isError: true },
        };
      }
    }
    default:
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `method not found: ${req.method ?? ""}` },
      };
  }
}

async function callTool(
  params: unknown,
  env: AppEnv,
  session: RequestSession,
  ctx: RpcContext,
): Promise<ToolContent[]> {
  const p = (params ?? {}) as { name?: string; arguments?: unknown };
  if (p.name === "search_web") {
    const text = await searchWeb(extractQuery(p.arguments), env, session);
    return [{ type: "text", text }];
  }
  if (p.name === "generate_image") {
    const input = parseImageArgs(p.arguments);
    const img = await generateImage(input, env, session);
    let urlLine = "";
    try {
      const id = await filesClient(env).put({
        name: img.name,
        mimeType: img.mimeType,
        data: img.data,
      });
      if (ctx.origin) urlLine = `\nDownload: ${ctx.origin}/files/${id}/${encodeURIComponent(img.name)}`;
    } catch {
      // still return the file in the tool result
    }
    const text =
      `Saved ${img.name} (${img.bytes} bytes, ${img.mimeType}, ${img.aspectRatio}, ${img.model})` + urlLine;
    return [
      { type: "text", text },
      { type: "image", data: img.data, mimeType: img.mimeType },
    ];
  }
  throw new Error(`unknown tool: ${p.name ?? ""}`);
}

export function extractQuery(raw: unknown): string {
  if (raw == null) throw new Error("missing arguments");
  if (typeof raw === "string") {
    const t = raw.trim();
    if (t.startsWith("{")) return extractQuery(JSON.parse(t));
    if (t) return t;
    throw new Error("query is required");
  }
  if (typeof raw === "object" && raw && "query" in raw) {
    const q = String((raw as { query?: unknown }).query ?? "").trim();
    if (!q) throw new Error("query is required");
    return q;
  }
  throw new Error("invalid arguments");
}

export function extractToolQuery(name: string | undefined, args: unknown): string | undefined {
  if (name === "generate_image") {
    try {
      return parseImageArgs(args).prompt;
    } catch {
      return undefined;
    }
  }
  try {
    return extractQuery(args);
  } catch {
    return undefined;
  }
}

