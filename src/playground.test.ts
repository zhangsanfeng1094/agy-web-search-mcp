import { describe, expect, test } from "bun:test";
import { playgroundClientJs, playgroundHtml } from "./playground.ts";

describe("playground", () => {
  test("renders both tool forms", () => {
    const html = playgroundHtml(false);
    expect(html).toContain('id="pg-form"');
    expect(html).toContain('data-tool="search_web"');
    expect(html).toContain('data-tool="generate_image"');
    expect(html).toContain('id="pg-query"');
    expect(html).toContain('id="pg-prompt"');
    expect(html).toContain('id="pg-aspect"');
    expect(html).toContain("16:9");
    expect(html).toContain('id="pg-files"');
    expect(html).not.toContain('id="pg-auth"');
  });

  test("client posts tools/call to /mcp", () => {
    const js = playgroundClientJs();
    expect(js).toContain('fetch("/mcp"');
    expect(js).toContain('method: "tools/call"');
    expect(js).toContain("X-Agy-Refresh-Token");
    expect(js).toContain("image_urls");
    expect(js).toContain("images");
  });
});
