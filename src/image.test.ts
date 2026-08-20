import { describe, expect, test } from "bun:test";
import {
  extensionForMime,
  fetchReference,
  parseGeneratedImage,
  parseImageArgs,
  sanitizeImageName,
} from "./image.ts";
import { fileIdFromUrl, filesClient, resetFiles } from "./files.ts";
import { handleRequest } from "./handler.ts";

describe("generate_image helpers", () => {
  test("parseImageArgs", () => {
    expect(parseImageArgs({ prompt: "a cat", image_name: "fat_cat", aspect_ratio: "16:9" })).toEqual({
      prompt: "a cat",
      imageName: "fat_cat",
      aspectRatio: "16:9",
      imageUrls: [],
    });
    expect(parseImageArgs("just a prompt").prompt).toBe("just a prompt");
    expect(() => parseImageArgs({ prompt: "x", aspect_ratio: "7:3" })).toThrow("aspect_ratio");
    expect(() => parseImageArgs({})).toThrow("prompt is required");
  });

  test("sanitizeImageName and mime extension", () => {
    expect(sanitizeImageName("Login Page Mockup!")).toBe("login_page_mockup");
    expect(sanitizeImageName("")).toBe("generated_image");
    expect(extensionForMime("image/jpeg")).toBe("jpg");
    expect(extensionForMime("image/png")).toBe("png");
  });

  test("parseGeneratedImage reads inlineData", () => {
    const img = parseGeneratedImage({
      response: {
        candidates: [
          {
            content: {
              parts: [
                { thoughtSignature: "x" } as never,
                { inlineData: { mimeType: "image/jpeg", data: "abcd" } },
              ],
            },
          },
        ],
      },
    });
    expect(img).toEqual({ mimeType: "image/jpeg", data: "abcd" });
  });
});

describe("generated files", () => {
  test("store and download", async () => {
    resetFiles();
    const id = await filesClient({}).put({
      name: "red_dot.jpg",
      mimeType: "image/jpeg",
      data: btoa("hello-image"),
    });
    const resp = await handleRequest(new Request(`http://127.0.0.1/files/${id}/red_dot.jpg`), {});
    expect(resp.status).toBe(200);
    expect(resp.headers.get("content-type")).toBe("image/jpeg");
    expect(resp.headers.get("content-disposition")).toContain("red_dot.jpg");
    expect(await resp.text()).toBe("hello-image");
  });

  test("fileIdFromUrl", () => {
    expect(fileIdFromUrl("https://example.workers.dev/files/140737efdbcc641c/animated_dog.jpg")).toBe(
      "140737efdbcc641c",
    );
    expect(fileIdFromUrl("https://example.com/other.png")).toBeUndefined();
  });

  test("fetchReference reads stored /files/ without HTTP", async () => {
    resetFiles();
    const data = btoa("dog-bytes");
    const id = await filesClient({}).put({
      name: "animated_dog.jpg",
      mimeType: "image/jpeg",
      data,
    });
    const got = await fetchReference(`https://example.workers.dev/files/${id}/animated_dog.jpg`, {});
    expect(got).toEqual({ mimeType: "image/jpeg", data });
  });
});
