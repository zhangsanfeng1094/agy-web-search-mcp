import type { AppEnv } from "./types.ts";

const MAX_FILES = 10;
const STORE_KEY = "s";

export type StoredFile = {
  id: string;
  name: string;
  mimeType: string;
  data: string;
  at: number;
};

type FilesState = { files: StoredFile[] };

const mem: StoredFile[] = [];

type DoStorage = {
  get<T>(key: string): Promise<T | undefined>;
  put(key: string, value: unknown): Promise<void>;
};

export class FilesStore {
  constructor(private readonly ctx: { storage: DoStorage }) {}

  async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const request = input instanceof Request && init === undefined ? input : new Request(input as RequestInfo, init);
    const cur = (await this.ctx.storage.get<FilesState>(STORE_KEY)) ?? { files: [] };
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    if (request.method === "GET") {
      const id = url.searchParams.get("id") || path.split("/").filter(Boolean)[0];
      const file = cur.files.find((f) => f.id === id);
      if (!file) return jsonResponse({ error: "not found" }, 404);
      return jsonResponse(file);
    }
    if (request.method === "POST" && (path === "/put" || path === "put")) {
      const file = (await request.json()) as StoredFile;
      if (!file?.id || !file.data) return jsonResponse({ error: "invalid file" }, 400);
      const next = putFile(cur.files, file);
      await this.ctx.storage.put(STORE_KEY, { files: next });
      return jsonResponse({ ok: true, id: file.id });
    }
    return jsonResponse({ error: "not found" }, 404);
  }
}

export type FilesClient = {
  put(file: Omit<StoredFile, "id" | "at"> & { id?: string }): Promise<string>;
  get(id: string): Promise<StoredFile | undefined>;
};

export function filesClient(env: AppEnv = {}): FilesClient {
  const ns = env.FILES;
  if (!ns) {
    return {
      put: async (file) => {
        const stored: StoredFile = {
          id: file.id || newId(),
          name: file.name,
          mimeType: file.mimeType,
          data: file.data,
          at: Date.now(),
        };
        const next = putFile(mem, stored);
        mem.length = 0;
        mem.push(...next);
        return stored.id;
      },
      get: async (id) => mem.find((f) => f.id === id),
    };
  }
  const stub = ns.get(ns.idFromName("global"));
  return {
    put: async (file) => {
      const stored: StoredFile = {
        id: file.id || newId(),
        name: file.name,
        mimeType: file.mimeType,
        data: file.data,
        at: Date.now(),
      };
      await stub.fetch("https://files/put", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stored),
      });
      return stored.id;
    },
    get: async (id) => {
      try {
        const resp = await stub.fetch(`https://files/get?id=${encodeURIComponent(id)}`);
        if (!resp.ok) return undefined;
        return (await resp.json()) as StoredFile;
      } catch {
        return undefined;
      }
    },
  };
}

export function resetFiles(): void {
  mem.length = 0;
}

function putFile(list: StoredFile[], file: StoredFile): StoredFile[] {
  const next = list.filter((f) => f.id !== file.id).concat(file);
  if (next.length > MAX_FILES) next.splice(0, next.length - MAX_FILES);
  return next;
}

function newId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
