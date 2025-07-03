/// <reference types="node" />
import { FastMCP } from "fastmcp";
import { join as pathJoin, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import * as fs from "fs";
import { z } from "zod";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  /**
   * Create a new FastMCP server
   */
  const server = new FastMCP({
    name: "Aptos Build MCP",
    version: "0.0.7",
  });

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

  const resourcesDir = pathJoin(__dirname, "resources");

  const aptosResourceOptions: string[] = (() => {
    try {
      // Markdown files in resources directory
      const files = fs.readdirSync(resourcesDir);
      const markdownFiles = files
        .filter((file: string) =>
          fs.statSync(pathJoin(resourcesDir, file)).isFile()
        )
        .filter((file: string) => extname(file).toLowerCase() === ".md")
        .map((file: string) => basename(file, extname(file)));
      return [...markdownFiles];
    } catch (err) {
      console.error(`Error reading resources directories: ${err}`);
      return [];
    }
  })();

  server.addTool({
    name: "get_aptos_development_resources",
    description:
      "Intelligently retrieves relevant Aptos development resources based on the development context or specific needs. This tool can find documentation for smart contract development, frontend integration, wallet connection, deployment, and more. Use this when you need guidance on any aspect of Aptos dApp development - the tool will automatically identify and return the most relevant resources.",
    parameters: z.object({
      context: z
        .string()
        .optional()
        .describe(
          "The development context or what you're trying to accomplish (e.g., 'setting up smart contracts', 'wallet integration', 'deployment', 'full dapp development', 'move contract testing', etc.). If not provided, returns available resources overview."
        ),
      specific_resource: z
        .string()
        .optional()
        .describe(
          "If you know the exact resource name, specify it here (without .md extension)"
        ),
    }),
    execute: async ({ context, specific_resource }, serverContext) => {
      const resourcesDir = pathJoin(__dirname, "resources");

      // If specific resource is requested, return it directly
      if (specific_resource) {
        const filePath = pathJoin(resourcesDir, `${specific_resource}.md`);
        if (fs.existsSync(filePath)) {
          const content = await readFile(filePath, "utf-8");
          return {
            type: "text",
            text: content,
          };
        } else {
          return {
            type: "text",
            text: `Resource '${specific_resource}' not found. Available resources: ${aptosResourceOptions.join(", ")}`,
          };
        }
      }

      // If no context provided, return overview of available resources
      if (!context) {
        const resourcesList = aptosResourceOptions
          .map((resource) => {
            return `- ${resource.replace(/_/g, " ").replace(/^how to /, "")}`;
          })
          .join("\n");

        return {
          type: "text",
          text: `# Available Aptos Development Resources\n\nThe following resources are available to help with Aptos dApp development:\n\n${resourcesList}\n\nTo get specific guidance, describe what you're trying to accomplish (e.g., "smart contract development", "wallet integration", "full dapp setup").`,
        };
      }

      // Intelligent resource matching based on context
      const contextLower = context.toLowerCase();
      const relevantResources: string[] = [];

      // Define context-to-resource mappings
      const contextMappings = {
        move: [
          "how_to_write_a_move_smart_contract",
          "how_to_develop_smart_contract",
          "how_to_deploy_smart_contract",
        ],
        contract: [
          "how_to_write_a_move_smart_contract",
          "how_to_develop_smart_contract",
          "how_to_deploy_smart_contrac",
        ],
        dapp: [
          "how_to_configure_admin_account",
          "how_to_fund_an_account_on_aptos",
          "how_to_write_an_aptos_dapp",
          "how_to_write_a_move_smart_contract",
          "how_to_develop_smart_contract",
          "how_to_deploy_smart_contract",
          "how_to_add_wallet_connection",
          "how_to_integrate_wallet_selector_ui",
          "how_to_sign_and_submit_transaction",
          "how_to_integrate_gas_station",
        ],
        wallet: [
          "how_to_add_wallet_connection",
          "how_to_integrate_wallet_selector_ui",
        ],
        frontend: [
          "how_to_add_wallet_connection",
          "how_to_integrate_wallet_selector_ui",
          "how_to_sign_and_submit_transaction",
          "how_to_integrate_gas_station",
        ],
        ui: [
          "how_to_integrate_wallet_selector_ui",
          "how_to_add_wallet_connection",
        ],
        transaction: ["how_to_sign_and_submit_transaction"],
        account: [
          "how_to_configure_admin_account",
          "how_to_fund_an_account_on_aptos",
        ],
        deploy: [
          "how_to_publish_move_smart_contract",
          "how_to_deploy_smart_contrac",
        ],
        publish: [
          "how_to_publish_move_smart_contract",
          "how_to_deploy_smart_contrac",
        ],
        fund: ["how_to_fund_an_account_on_aptos"],
        admin: ["how_to_configure_admin_account"],
        full: ["how_to_write_an_aptos_dapp"], // For full dapp development
        complete: ["how_to_write_an_aptos_dapp"],
        setup: ["how_to_write_an_aptos_dapp", "how_to_configure_admin_account"],
        "getting started": ["how_to_write_an_aptos_dapp"],
        overview: ["how_to_write_an_aptos_dapp"],
        // Gas Station context mappings
        gas: ["how_to_integrate_gas_station"],
        sponsor: ["how_to_integrate_gas_station"],
        sponsored: ["how_to_integrate_gas_station"],
        station: ["how_to_integrate_gas_station"],
        gasless: ["how_to_integrate_gas_station"],
        fee: ["how_to_integrate_gas_station"],
      };

      // Find matching resources based on context
      for (const [keyword, resources] of Object.entries(contextMappings)) {
        if (contextLower.includes(keyword)) {
          relevantResources.push(...resources);
        }
      }

      // Remove duplicates and ensure resources exist
      const uniqueResources = [...new Set(relevantResources)].filter(
        (resource) => aptosResourceOptions.includes(resource)
      );

      // If no specific matches, default to the main guide
      if (uniqueResources.length === 0) {
        uniqueResources.push("how_to_write_an_aptos_dapp");
      }

      // Read and combine the relevant resources
      let combinedContent = `# Aptos Development Resources for: ${context}\n\n`;

      for (const resource of uniqueResources) {
        const filePath = pathJoin(resourcesDir, `${resource}.md`);
        if (fs.existsSync(filePath)) {
          const content = await readFile(filePath, "utf-8");
          combinedContent += `## ${resource
            .replace(/_/g, " ")
            .replace(/^how to /, "")
            .toUpperCase()}\n\n`;
          combinedContent += content + "\n\n---\n\n";
        }
      }

      return {
        type: "text",
        text: combinedContent,
      };
    },
  });

  /**
   * Start the server
   */
  try {
    await server.start({
      transportType: "stdio",
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

main();
