import { describe, expect, it } from "vitest";

import { config } from "./config.js";

describe("config", () => {
  it("exposes expected server configuration", () => {
    expect(config.server.name).toBe("Aptos MCP Server");
  });

  it("exposes geomi and gas station endpoints", () => {
    expect(config.geomi.adminUrl).toBe(
      "https://admin.api.aptoslabs.com/api/rspc",
    );
    expect(config.gas_station.testnetUrl).toBe(
      "https://api.testnet.aptoslabs.com/gs/v1",
    );
    expect(config.gas_station.mainnetUrl).toBe(
      "https://api.mainnet.aptoslabs.com/gs/v1",
    );
  });

  it("builds analytics URLs with the measurement id", () => {
    expect(config.ga.url).toContain("G-LXY7NNQBTG");
    expect(config.ga.urlDebug).toContain("G-LXY7NNQBTG");
  });
});
