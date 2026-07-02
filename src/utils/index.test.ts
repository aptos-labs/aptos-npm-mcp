import { describe, expect, it } from "vitest";

import {
  getAvailableHowToResources,
  readAllMarkdownFromDirectories,
  readMarkdownFromDirectory,
} from "./index.js";

describe("getAvailableHowToResources", () => {
  it("returns markdown resources without file extensions", () => {
    const resources = getAvailableHowToResources();

    expect(resources.length).toBeGreaterThan(0);
    expect(resources).toContain("how_to_add_wallet_connection");
    expect(resources.every((resource) => !resource.endsWith(".md"))).toBe(true);
  });
});

describe("readMarkdownFromDirectory", () => {
  it("reads a known how-to resource", async () => {
    const content = await readMarkdownFromDirectory(
      "how_to",
      "how_to_add_wallet_connection",
    );

    expect(content).toContain("wallet");
    expect(content.length).toBeGreaterThan(100);
  });

  it("returns a helpful message for missing resources", async () => {
    const content = await readMarkdownFromDirectory(
      "how_to",
      "this_resource_does_not_exist",
    );

    expect(content).toContain("File not found");
  });
});

describe("readAllMarkdownFromDirectories", () => {
  it("combines content from multiple resource directories", async () => {
    const content = await readAllMarkdownFromDirectories(["frontend", "move"]);

    expect(content).toContain("FRONTEND RESOURCES");
    expect(content).toContain("MOVE RESOURCES");
    expect(content.length).toBeGreaterThan(100);
  });
});
