import { describe, expect, test } from "bun:test";
import {
  imagePlaygroundHtml,
  playgroundClientJs,
  playgroundHtml,
  searchPlaygroundHtml,
} from "./playground.ts";

describe("playground", () => {
  test("renders search_web dedicated interface", () => {
    const html = searchPlaygroundHtml(false);
    expect(html).toContain('id="pg-search-form"');
    expect(html).toContain('id="pg-search-query"');
    expect(html).toContain('id="pg-search-run"');
    expect(html).toContain('id="pg-search-console"');
    expect(html).toContain('id="pg-search-history"');
    expect(html).toContain("网页搜索");
    expect(html).toContain("search_web");
    expect(html).not.toContain('id="pg-search-auth"');
  });

  test("renders generate_image dedicated interface", () => {
    const html = imagePlaygroundHtml(false);
    expect(html).toContain('id="pg-image-form"');
    expect(html).toContain('id="pg-image-prompt"');
    expect(html).toContain('id="pg-image-aspect"');
    expect(html).toContain('id="pg-image-drop"');
    expect(html).toContain('id="pg-image-files"');
    expect(html).toContain('id="pg-image-run"');
    expect(html).toContain('id="pg-image-console"');
    expect(html).toContain('id="pg-image-history"');
    expect(html).toContain("生成图片");
    expect(html).toContain("generate_image");
    expect(html).toContain("16:9");
    expect(html).not.toContain('id="pg-image-auth"');
  });

  test("renders auth field when required", () => {
    const searchAuth = searchPlaygroundHtml(true);
    expect(searchAuth).toContain('id="pg-search-auth"');
    expect(searchAuth).toContain("MCP_AUTH_TOKEN");

    const imageAuth = imagePlaygroundHtml(true);
    expect(imageAuth).toContain('id="pg-image-auth"');
    expect(imageAuth).toContain("MCP_AUTH_TOKEN");
  });

  test("legacy playgroundHtml renders both interfaces", () => {
    const html = playgroundHtml(false);
    expect(html).toContain('id="pg-search-form"');
    expect(html).toContain('id="pg-image-form"');
  });

  test("client posts tools/call to /mcp for both tools", () => {
    const js = playgroundClientJs();
    expect(js).toContain('fetch("/mcp"');
    expect(js).toContain('method: "tools/call"');
    expect(js).toContain("X-Agy-Refresh-Token");
    expect(js).toContain("search_web");
    expect(js).toContain("generate_image");
    expect(js).toContain("image_urls");
    expect(js).toContain("images");
  });
});
