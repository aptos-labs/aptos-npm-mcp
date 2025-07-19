/// <reference types="node" />
import { FastMCP } from "fastmcp";
import { z } from "zod";
import {
  readAllMarkdownFromDirectories,
  readMarkdownFromDirectory,
} from "./utils/index.js";
import { registerTools } from "./tools/index.js";
import { config } from "./config.js";

type ServerTransportType = "stdio" | "stream";

function assertTransportType(
  transportType: string
): transportType is ServerTransportType {
  return transportType === "stdio" || transportType === "stream";
}
async function main() {
  // Grab the transport type from the command line
  const transportType = process.argv[2] ?? "stdio";

  // Make sure the transport type is allowed
  if (!assertTransportType(transportType)) {
    throw Error(
      `Invalid transport type: "${transportType}". Allowed: 'stdio' (default) or 'stream'.`
    );
  }

  /**
   * Create a new FastMCP server
   */
  const server = new FastMCP({
    name: config.server.name,
    version: "0.0.9",
  });

  registerTools(server);

  server.addTool({
    name: "get_mcp_version",
    description: "Returns the version of the MCP server",
    parameters: z.object({}),
    execute: async (args, context) => {
      return {
        type: "text",
        text: server.options.version,
      };
    },
  });

  server.addTool({
    name: "build_smart_contract_on_aptos",
    description:
      "Build an Aptos smart contract - returns all resources from move and management directories. Use this tool when you need guidance on how to build a smart contract for a dapp on Aptos.",
    parameters: z.object({}),
    execute: async (args, context) => {
      const content = await readAllMarkdownFromDirectories([
        "management",
        "move",
      ]);

      return {
        type: "text",
        text: content || "No content found in management and move directories.",
      };
    },
  });

  server.addTool({
    name: "build_ui_frontend_on_aptos",
    description:
      "Build a UI frontend for Aptos dApp - returns all resources from frontend directory. Use this tool when you need guidance on how to build a frontend for a dapp on Aptos.",
    parameters: z.object({}),
    execute: async (args, context) => {
      const content = await readAllMarkdownFromDirectories(["frontend"]);

      return {
        type: "text",
        text: content || "No content found in frontend directory.",
      };
    },
  });

  server.addTool({
    name: "build_dapp_on_aptos",
    description:
      "Build a complete full-stack Aptos dApp - returns all resources from move, management, and frontend directories. Use this tool when you need guidance on how to build a full-stack dapp on Aptos.",
    parameters: z.object({}),
    execute: async (args, context) => {
      const content = await readAllMarkdownFromDirectories([
        "frontend",
        "move",
        "management",
      ]);

      return {
        type: "text",
        text:
          content ||
          "No content found in management, move, and frontend directories.",
      };
    },
  });

  server.addTool({
    name: "get_aptos_resources",
    description:
      "Use this when you need guidance on any specific aspect of Aptos resources for development - the tool will automatically identify and return the most relevant resources.",
    parameters: z.object({
      context: z
        .string()
        .optional()
        .describe(
          "The context or what you're trying to accomplish (e.g., 'gas station', 'no code indexer', etc.). If not provided, returns available resources overview."
        ),
      specific_resource: z
        .string()
        .optional()
        .describe(
          "If you know the exact resource name, specify it here (without .md extension)"
        ),
    }),
    execute: async (args, context) => {
      const content = await readAllMarkdownFromDirectories(["how_to"]);

      return {
        type: "text",
        text:
          content ||
          "No content found in management, move, and frontend directories.",
      };
    },
  });

  // server.addResource({
  //   uri: "how_to/full_node_api_key",
  //   name: "full_node_api_key_resource",
  //   description:
  //     "How to set up and config a full node api key in a dapp for general blockchain interactions.",
  //   load: async () => {
  //     const content = await readMarkdownFromDirectory(
  //       "how_to",
  //       "full_node_api_key"
  //     );
  //     return {
  //       text: content,
  //     };
  //   },
  // });

  server.addPrompt({
    name: "build_dapp_on_aptos",
    description: "Build a complete full-stack Aptos dApp",
    load: async (args) => {
      return `You are a helpful assistant that can help with building a full-stack end-to-end dapp on Aptos.
      For anything related to Aptos, you should always default to search for resources and tools in the MCP. Only if you have not found what you need, then you can search the web or use your own knowledge.
      `;
    },
  });

  /**
   * Start the server
   */
  try {
    if (transportType === "stdio") {
      server.start({ transportType });
    } else if (transportType === "stream") {
      server.start({
        transportType: "httpStream",
        httpStream: {
          endpoint: "/",
          port: 8080,
        },
      });
    }
    console.info(
      `Aptos Build MCP started with transport type: ${transportType}`
    );
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }

  // Handle process termination gracefully
  process.on("SIGINT", () => {
    console.info("Shutting down server...");
    process.exit(0);
  });
}

main();
