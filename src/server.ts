#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import { z } from "zod";

import { config } from "./config.js";
import { registerTools } from "./tools/index.js";
import {
  getAvailableHowToResources,
  readAllMarkdownFromDirectories,
  readMarkdownFromDirectory,
} from "./utils/index.js";

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
    version: "0.0.16",
  });

  registerTools(server);

  server.addTool({
    description: "Returns the version of the MCP server",
    execute: async () => {
      return {
        text: server.options.version,
        type: "text",
      };
    },
    name: "get_mcp_version",
    parameters: z.object({}),
  });

  server.addTool({
    description:
      "Build an Aptos smart contract - returns all resources from move and management directories. Use this tool when you need guidance on how to build a smart contract for a dapp on Aptos.",
    execute: async () => {
      const content = await readAllMarkdownFromDirectories([
        "management",
        "move",
      ]);

      return {
        text: content || "No content found in management and move directories.",
        type: "text",
      };
    },
    name: "build_smart_contract_on_aptos",
    parameters: z.object({}),
  });

  server.addTool({
    description:
      "Build a UI frontend for Aptos dApp - returns all resources from frontend directory. Use this tool when you need guidance on how to build a frontend for a dapp on Aptos.",
    execute: async () => {
      const content = await readAllMarkdownFromDirectories(["frontend"]);

      return {
        text: content || "No content found in frontend directory.",
        type: "text",
      };
    },
    name: "build_ui_frontend_on_aptos",
    parameters: z.object({}),
  });

  server.addTool({
    description:
      "Build a complete full-stack Aptos dApp - returns all resources from move, management, and frontend directories. Use this tool when you need guidance on how to build a full-stack dapp on Aptos.",
    execute: async () => {
      const content = await readAllMarkdownFromDirectories([
        "frontend",
        "move",
        "management",
      ]);

      return {
        text:
          content ||
          "No content found in management, move, and frontend directories.",
        type: "text",
      };
    },
    name: "build_dapp_on_aptos",
    parameters: z.object({}),
  });

  // Step 1: Discovery tool - returns list of available resources
  server.addTool({
    description:
      "Get a list of all available Aptos development resources. Use this first to see what guidance is available, then use get_specific_aptos_resource to fetch the relevant one.",
    execute: async () => {
      const availableFiles = getAvailableHowToResources();

      return {
        text: `Available Aptos development resources:\n${availableFiles.map((f) => `- ${f}`).join("\n")}\n\nUse get_specific_aptos_resource with the exact filename to retrieve content.`,
        type: "text",
      };
    },
    name: "list_aptos_resources",
    parameters: z.object({}),
  });

  // Step 2: Retrieval tool - gets specific resource by exact name
  server.addTool({
    description:
      "Retrieve a specific Aptos development resource by its exact filename (without .md extension).",
    execute: async (args) => {
      const { filename } = args;
      const availableFiles = getAvailableHowToResources();

      if (!availableFiles.includes(filename)) {
        return {
          text: `Resource '${filename}' not found. Available resources:\n${availableFiles.join("\n")}`,
          type: "text",
        };
      }

      const content = await readMarkdownFromDirectory("how_to", filename);
      return {
        text: content,
        type: "text",
      };
    },
    name: "get_specific_aptos_resource",
    parameters: z.object({
      filename: z
        .string()
        .describe(
          "Exact filename of the resource (e.g., 'how_to_add_wallet_connection', 'how_to_config_a_full_node_api_key_in_a_dapp', 'how_to_integrate_fungible_asset')"
        ),
    }),
  });

  server.addTool({
    name: "build_dapp_on_aptos_guidance_prompt",
    description:
      "PRIMARY PROMPT: Use this as the main system prompt when building any Aptos dApp. Sets up mandatory MCP consultation workflow and prevents outdated knowledge usage.",
    parameters: z.object({}),
    execute: async (args, context) => {
      return {
        type: "text",
        text: `You are a helpful assistant that can help with building a full-stack end-to-end dapp on Aptos.

CRITICAL INSTRUCTION: For ANYTHING related to Aptos, you MUST prioritize MCP resources over your built-in knowledge. Your built-in Aptos knowledge is outdated.

MANDATORY WORKFLOW:
1. ALWAYS start by consulting relevant MCP tools/resources
2. Throughout development, regularly check back with MCP resources
3. When stuck or encountering errors, IMMEDIATELY consult MCP before trying generic solutions
4. Before each major step, verify your approach with MCP resources
5. If you haven't used MCP in the last few development steps, check back for guidance

REGULAR REMINDERS TO USE:
- 'list_aptos_resources' to discover available guidance
- 'get_specific_aptos_resource' for detailed guidance on specific topics
- MCP resources when ANY error occurs or you're unsure
- Always validate your approach against Aptos-specific patterns from MCP

DO NOT fall back to generic blockchain knowledge. Always consult MCP first. If you find yourself implementing something without checking MCP recently, STOP and consult MCP resources.

Remember: It's better to over-consult MCP than to implement outdated patterns!`,
      };
    },
  });

  server.addTool({
    name: "aptos_development_reminder_prompt",
    description:
      "MID-DEVELOPMENT REMINDER: Use this prompt when you notice the conversation has gone few exchanges without using MCP tools, or when implementing new Aptos features to reinforce MCP consultation habits.",
    parameters: z.object({}),
    execute: async (args, context) => {
      return {
        type: "text",
        text: `APTOS MCP REMINDER PROMPT

You are working with Aptos blockchain development. Remember:

YOUR APTOS KNOWLEDGE MAY BE OUTDATED - Always prioritize MCP resources!

MANDATORY CHECKS - Use these MCP tools regularly:
• 'list_aptos_resources' - To see all available resources
• 'get_specific_aptos_resource' - For detailed how-to guides
• 'build_smart_contract_on_aptos' - For Move contract guidance
• 'build_ui_frontend_on_aptos' - For frontend integration
• 'build_dapp_on_aptos' - For full-stack guidance

DANGER SIGNS you're using outdated knowledge:
- Implementing generic blockchain patterns instead of Aptos-specific ones
- Getting stuck in error-fixing loops without consulting MCP
- Using outdated wallet connection or transaction signing methods
- Guessing at API configurations or rate limiting
- Haven't used MCP tools in the last 3-4 development steps

WHEN TO CONSULT MCP:
- Starting any new feature or integration
- Encountering any error or unexpected behavior  
- Before finalizing any implementation
- When you haven't used MCP tools recently
- When implementing wallet connections, transactions, API setup, etc.

Remember: Always verify your approach with current Aptos best practices from MCP!`,
      };
    },
  });

  server.addTool({
    name: "aptos_debugging_helper_prompt",
    description:
      "ERROR RECOVERY PROMPT: Use this immediately when encountering Aptos-related errors, stuck in debugging loops, or when about to try generic blockchain solutions. Redirects to MCP-first debugging approach.",
    parameters: z.object({}),
    execute: async (args, context) => {
      return {
        type: "text",
        text: `APTOS DEBUGGING HELPER

You seem to be encountering issues with Aptos development. 

STOP - Before trying generic solutions:

REQUIRED FIRST STEPS:
1. Check MCP resources first:
   - Use 'list_aptos_resources' to discover available guidance
   - Get specific guidance with 'get_specific_aptos_resource'

2. For specific areas, use targeted MCP tools:
   - Move contracts: 'build_smart_contract_on_aptos'
   - Frontend issues: 'build_ui_frontend_on_aptos'
   - Full-stack problems: 'build_dapp_on_aptos'

3. Common Aptos-specific resources to check:
   - 'how_to_add_wallet_connection' - for wallet issues
   - 'how_to_sign_and_submit_transaction' - for transaction execution problems with a wallet
   - 'how_to_config_a_full_node_api_key_in_a_dapp' - for API setup
   - 'how_to_handle_rate_limit_in_a_dapp' - for rate limiting
   - 'how_to_integrate_gas_station' - for gas station integration

DO NOT:
- Try random fixes based on generic blockchain knowledge
- Keep retrying the same failing approach
- Use Stack Overflow solutions without checking if they're Aptos-specific
- Assume your implementation is correct without consulting MCP

ALWAYS:
- Consult MCP tools first
- Follow Aptos-specific guidance from MCP resources
- Verify your implementation approach with MCP
- Use current Aptos Move patterns, not outdated ones`,
      };
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
