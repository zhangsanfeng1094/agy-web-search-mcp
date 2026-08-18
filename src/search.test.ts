import { describe, expect, test } from "bun:test";
import { formatSearchResult } from "./search.ts";

describe("formatSearchResult", () => {
  test("includes text and sources", () => {
    const out = formatSearchResult("today news", {
      response: {
        candidates: [
          {
            content: { parts: [{ text: "headline summary" }] },
            groundingMetadata: {
              webSearchQueries: ["today news"],
              groundingChunks: [{ web: { uri: "https://example.com/a", title: "Example" } }],
            },
          },
        ],
      },
    });
    expect(out).toContain("headline summary");
    expect(out).toContain("[1] Example");
    expect(out).toContain("https://example.com/a");
  });
});
