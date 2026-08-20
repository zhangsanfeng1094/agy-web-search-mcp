import type { AppEnv, RequestSession } from "./types.ts";
import {
  DEFAULT_IMAGE_MODEL,
  cloudPost,
  cloudProject,
} from "./cloud.ts";
import { MAX_FILES, fileIdFromUrl, filesClient } from "./files.ts";

export const IMAGE_ASPECT_RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9"] as const;
export type ImageAspectRatio = (typeof IMAGE_ASPECT_RATIOS)[number];

const MAX_REF_IMAGES = 3;
const MAX_REF_BYTES = 5_000_000;
let cachedModel: { id: string; exp: number } | undefined;

export type GenerateImageInput = {
  prompt: string;
  imageName?: string;
  aspectRatio: ImageAspectRatio;
  imageUrls?: string[];
};

export type GeneratedImage = {
  name: string;
  mimeType: string;
  data: string;
  bytes: number;
  model: string;
  aspectRatio: ImageAspectRatio;
};

type GenerateResponse = {
  response?: {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
          inlineData?: { mimeType?: string; mime_type?: string; data?: string };
          inline_data?: { mimeType?: string; mime_type?: string; data?: string };
        }>;
      };
    }>;
  };
  error?: { message?: string };
};

type ModelsResponse = {
  imageGenerationModelIds?: string[];
};

export function parseImageArgs(raw: unknown): GenerateImageInput {
  const obj = asObject(raw);
  const prompt = str(obj.prompt) || str(obj.query);
  if (!prompt) throw new Error("prompt is required");
  const imageName = str(obj.image_name) || str(obj.imageName) || undefined;
  const ratioRaw = str(obj.aspect_ratio) || str(obj.aspectRatio) || "1:1";
  if (!IMAGE_ASPECT_RATIOS.includes(ratioRaw as ImageAspectRatio)) {
    throw new Error(`aspect_ratio must be one of ${IMAGE_ASPECT_RATIOS.join(", ")}`);
  }
  const urls = asStringList(obj.image_urls ?? obj.imageUrls ?? obj.image_paths ?? obj.imagePaths);
  if (urls.length > MAX_REF_IMAGES) throw new Error(`at most ${MAX_REF_IMAGES} reference images`);
  return { prompt, imageName, aspectRatio: ratioRaw as ImageAspectRatio, imageUrls: urls };
}

export function sanitizeImageName(name?: string): string {
  const s = (name || "generated_image")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  return s || "generated_image";
}

export function extensionForMime(mime: string): string {
  const m = mime.toLowerCase().split(";")[0].trim();
  if (m === "image/jpeg" || m === "image/jpg") return "jpg";
  if (m === "image/webp") return "webp";
  if (m === "image/gif") return "gif";
  return "png";
}

export function parseGeneratedImage(parsed: GenerateResponse): { mimeType: string; data: string } {
  const parts = parsed.response?.candidates?.[0]?.content?.parts ?? [];
  for (const p of parts) {
    const inline = p.inlineData || p.inline_data;
    if (inline?.data) {
      return {
        mimeType: inline.mimeType || inline.mime_type || "image/png",
        data: inline.data,
      };
    }
  }
  throw new Error("image api returned no image");
}

export async function generateImage(
  input: GenerateImageInput,
  env: AppEnv,
  session: RequestSession,
): Promise<GeneratedImage> {
  const model = env.AGY_IMAGE_MODEL?.trim() || (await resolveImageModel(env, session));
  const parts: Array<Record<string, unknown>> = [{ text: input.prompt }];
  for (const url of input.imageUrls ?? []) {
    parts.push({ inlineData: await fetchReference(url, env) });
  }
  const { status, text } = await cloudPost(env, session, "generateContent", {
    project: cloudProject(env),
    model,
    request: {
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: { aspectRatio: input.aspectRatio },
      },
    },
  });
  let parsed: GenerateResponse;
  try {
    parsed = JSON.parse(text) as GenerateResponse;
  } catch {
    throw new Error(`image parse failed: ${text.slice(0, 400)}`);
  }
  if (parsed.error?.message) throw new Error(`image api: ${parsed.error.message}`);
  if (status < 200 || status >= 300) throw new Error(`image api http ${status}: ${text.slice(0, 400)}`);
  const img = parseGeneratedImage(parsed);
  const base = sanitizeImageName(input.imageName);
  const ext = extensionForMime(img.mimeType);
  return {
    name: `${base}.${ext}`,
    mimeType: img.mimeType,
    data: img.data,
    bytes: Math.floor((img.data.length * 3) / 4),
    model,
    aspectRatio: input.aspectRatio,
  };
}

async function resolveImageModel(env: AppEnv, session: RequestSession): Promise<string> {
  if (cachedModel && cachedModel.exp > Date.now()) return cachedModel.id;
  try {
    const { status, text } = await cloudPost(env, session, "fetchAvailableModels", {
      project: cloudProject(env),
    });
    if (status >= 200 && status < 300) {
      const json = JSON.parse(text) as ModelsResponse;
      const id = json.imageGenerationModelIds?.find((m) => m.trim());
      if (id) {
        cachedModel = { id, exp: Date.now() + 10 * 60_000 };
        return id;
      }
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_IMAGE_MODEL;
}

export async function fetchReference(
  url: string,
  env: AppEnv = {},
): Promise<{ mimeType: string; data: string }> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`invalid image url: ${url}`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`image url must be http(s): ${url}`);
  }
  const fileId = fileIdFromUrl(url);
  if (fileId) {
    const stored = await filesClient(env).get(fileId);
    if (stored?.data) return { mimeType: stored.mimeType, data: stored.data };
  }
  const resp = await fetch(parsed.href);
  if (!resp.ok) {
    if (fileId) {
      throw new Error(
        `reference image not found (${resp.status}). generated files only keep the last ${MAX_FILES}; pass a public image URL or generate again: ${url}`,
      );
    }
    throw new Error(`reference image http ${resp.status}: ${url}`);
  }
  const mime = (resp.headers.get("content-type") || "image/png").split(";")[0].trim();
  if (!mime.startsWith("image/")) throw new Error(`reference is not an image: ${url}`);
  const buf = new Uint8Array(await resp.arrayBuffer());
  if (buf.byteLength > MAX_REF_BYTES) throw new Error(`reference image too large: ${url}`);
  return { mimeType: mime, data: toBase64(buf) };
}

function asObject(raw: unknown): Record<string, unknown> {
  if (raw == null) throw new Error("missing arguments");
  if (typeof raw === "string") {
    const t = raw.trim();
    if (t.startsWith("{")) return asObject(JSON.parse(t));
    return { prompt: t };
  }
  if (typeof raw === "object") return raw as Record<string, unknown>;
  throw new Error("invalid arguments");
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function asStringList(v: unknown): string[] {
  if (v == null || v === "") return [];
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  return [];
}

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
