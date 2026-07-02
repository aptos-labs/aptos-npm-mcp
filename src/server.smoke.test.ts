import { existsSync } from "node:fs";
import { join } from "node:path";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { FastMCP } from "fastmcp";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

import { config } from "./config.js";
import { registerTools } from "./tools/index.js";

const serverPath = join(process.cwd(), "dist/server.js");

describe("server smoke test", () => {
  let client: Client | undefined;
  let transport: StdioClientTransport | undefined;

  afterEach(async () => {
    if (client) {
      await client.close();
      client = undefined;
    }

    if (transport) {
      await transport.close();
      transport = undefined;
    }
  });

  it("bootstraps FastMCP with zod tool registration", () => {
    const server = new FastMCP({
      name: config.server.name,
      version: "0.0.22",
    });

    registerTools(server);

    server.addTool({
      name: "get_mcp_version",
      description: "Returns the version of the MCP server",
      parameters: z.object({}),
      execute: async () => ({
        type: "text" as const,
        text: "0.0.22",
      }),
    });

    expect(server.options.name).toBe("Aptos MCP Server");
  });

  beforeAll(() => {
    expect(
      existsSync(serverPath),
      "dist/server.js must exist; run npm run build before tests",
    ).toBe(true);
  });

  it("starts the built MCP server and serves get_mcp_version", async () => {
    transport = new StdioClientTransport({
      command: "node",
      args: [serverPath],
      stderr: "pipe",
    });
    client = new Client({ name: "aptos-mcp-smoke-test", version: "1.0.0" });

    await client.connect(transport);

    const { tools } = await client.listTools();
    expect(tools.some((tool) => tool.name === "get_mcp_version")).toBe(true);

    const result = await client.callTool({
      name: "get_mcp_version",
      arguments: {},
    });

    expect(result.content).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "text",
          text: "0.0.22",
        }),
      ]),
    );
  });
});
