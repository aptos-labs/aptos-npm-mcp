import { describe, expect, it } from "vitest";

import { loadEnvFromFile } from "./load-env.js";

describe("loadEnvFromFile", () => {
  it("does not throw when .env is missing", () => {
    expect(() => loadEnvFromFile()).not.toThrow();
  });
});
