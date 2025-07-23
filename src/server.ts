#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import { z } from "zod";
import {
  readAllMarkdownFromDirectories,
  readMarkdownFromDirectory,
} from "./utils/index.js";
import { registerTools } from "./tools/index.js";
import { config } from "./config.js";
import { basename, extname, join as pathJoin } from "node:path";
import fs from "node:fs";

async function main() {
  /**
   * Create a new FastMCP server
   */
  const server = new FastMCP({
    name: config.server.name,
    version: "0.0.10",
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

      const reminder = `\n\n🔄 IMPORTANT REMINDERS:\n- If you get stuck implementing any part, use 'debug_aptos_issue' tool with your specific problem\n- Before proceeding to frontend, use 'validate_current_implementation' to ensure Move code follows best practices\n- For specific integrations (wallet, gas station, indexer), use 'get_aptos_resources' with relevant context\n- If errors occur, always consult MCP tools before trying generic solutions`;

      return {
        type: "text",
        text: (content || "No content found in management and move directories.") + reminder,
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

      const reminder = `\n\n🔄 IMPORTANT REMINDERS:\n- If wallet connection fails, use 'get_specific_aptos_resource' with 'how_to_add_wallet_connection'\n- For transaction signing issues, use 'debug_aptos_issue' with your specific error\n- Before deploying, use 'validate_current_implementation' to check integration patterns\n- For rate limiting or API issues, consult 'how_to_handle_rate_limit_in_a_dapp' resource`;

      return {
        type: "text",
        text: (content || "No content found in frontend directory.") + reminder,
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

      const reminder = `\n\n🔄 IMPORTANT REMINDERS:\n- At each development phase, use 'validate_current_implementation' to ensure you're following Aptos best practices\n- If you encounter ANY errors or get stuck, use 'debug_aptos_issue' instead of guessing\n- Before final deployment, use 'pre_deployment_checklist' to verify everything\n- Keep consulting MCP resources throughout development - don't rely on general blockchain knowledge`;

      return {
        type: "text",
        text: (content ||
          "No content found in management, move, and frontend directories.") + reminder,
      };
    },
  });

  // NEW: Context-aware debugging tool
  server.addTool({
    name: "debug_aptos_issue",
    description: 
      "🚨 CRITICAL: Use this when you're stuck or encountering errors in Aptos development. Provide your current code/error and get targeted Aptos-specific guidance. This helps avoid getting stuck in debugging loops with outdated knowledge.",
    parameters: z.object({
      issue_description: z.string().describe("Describe the specific problem, error message, or what you're trying to achieve"),
      current_code: z.string().optional().describe("Relevant code snippet that's causing issues"),
      error_message: z.string().optional().describe("Exact error message if any"),
      context: z.enum(["move_contract", "frontend_integration", "wallet_connection", "transaction_signing", "api_setup", "deployment", "other"]).describe("What area of Aptos development this relates to")
    }),
    execute: async (args, context) => {
      const { issue_description, current_code, error_message, context: devContext } = args;
      
             // Map contexts to relevant resources
       const contextToResources: Record<string, string[]> = {
         "wallet_connection": ["how_to_add_wallet_connection", "how_to_integrate_wallet_selector_ui"],
         "transaction_signing": ["how_to_sign_and_submit_transaction"],
         "api_setup": ["how_to_config_a_full_node_api_key_in_a_dapp", "how_to_handle_rate_limit_in_a_dapp"],
         "move_contract": ["move"],
         "frontend_integration": ["frontend"],
         "deployment": ["management"],
         "other": []
       };

      let guidance = `🔍 TARGETED APTOS GUIDANCE for: ${issue_description}\n\n`;
      
      if (error_message) {
        guidance += `❌ Error: ${error_message}\n\n`;
      }

      // Provide specific guidance based on context
      const resources = contextToResources[devContext] || [];
      if (resources.length > 0) {
        guidance += `📚 RECOMMENDED NEXT STEPS:\n`;
        guidance += `1. Consult these specific Aptos resources: ${resources.join(", ")}\n`;
        guidance += `2. Use 'get_specific_aptos_resource' or 'get_aptos_resources' with context: "${devContext}"\n`;
        guidance += `3. Compare your approach with Aptos best practices from MCP resources\n\n`;
      }

      guidance += `🔄 IMPORTANT: Don't guess or use generic blockchain solutions. Always:\n`;
      guidance += `- Check MCP resources first before trying alternative approaches\n`;
      guidance += `- Use 'validate_current_implementation' after making changes\n`;
      guidance += `- If still stuck, provide more specific details to this tool\n\n`;

      guidance += `📋 To get specific resources, use:\n`;
      guidance += `- get_specific_aptos_resource with exact filename\n`;
      guidance += `- get_aptos_resources with context: "${devContext}"\n`;

      return {
        type: "text",
        text: guidance,
      };
    },
  });

  // NEW: Implementation validation tool
  server.addTool({
    name: "validate_current_implementation",
    description:
      "🔍 Validate your current Aptos implementation against best practices. Use this regularly to ensure you're following Aptos patterns correctly and haven't drifted to generic blockchain approaches.",
    parameters: z.object({
      implementation_area: z.enum(["move_contract", "wallet_integration", "transaction_handling", "api_configuration", "frontend_setup", "full_stack"]).describe("What part of your implementation to validate"),
      specific_concern: z.string().optional().describe("Any specific concern or pattern you want to validate"),
      current_approach: z.string().optional().describe("Brief description of your current implementation approach")
    }),
    execute: async (args, context) => {
      const { implementation_area, specific_concern, current_approach } = args;
      
      let validation = `✅ APTOS VALIDATION CHECKLIST for: ${implementation_area}\n\n`;
      
      if (current_approach) {
        validation += `🔍 Current Approach: ${current_approach}\n\n`;
      }

             // Area-specific validation points
       const validationPoints: Record<string, string[]> = {
         "move_contract": [
           "Are you using proper Aptos Move syntax and not generic Move?",
           "Have you checked 'move' resources in MCP for Aptos-specific patterns?",
           "Are you handling capabilities and permissions correctly?",
           "Consider consulting management resources for deployment best practices"
         ],
         "wallet_integration": [
           "Are you using the latest Aptos wallet standards?",
           "Check 'how_to_add_wallet_connection' for current best practices",
           "Verify wallet selector implementation with 'how_to_integrate_wallet_selector_ui'",
           "Ensure you're not using outdated wallet connection methods"
         ],
         "transaction_handling": [
           "Are you following Aptos transaction signing patterns?",
           "Check 'how_to_sign_and_submit_transaction' for proper implementation",
           "Verify gas station integration if applicable",
           "Ensure proper error handling for Aptos-specific errors"
         ],
         "api_configuration": [
           "Are you using proper Aptos API endpoints and keys?",
           "Check 'how_to_config_a_full_node_api_key_in_a_dapp' for setup guidance",
           "Verify rate limiting configuration with 'how_to_handle_rate_limit_in_a_dapp'",
           "Ensure you're using Aptos-specific API patterns"
         ],
         "frontend_setup": [
           "Are you using Aptos-specific frontend integration patterns?",
           "Check frontend resources in MCP for current best practices",
           "Verify wallet connection and transaction signing flows",
           "Ensure proper error handling for Aptos frontend errors"
         ],
         "full_stack": [
           "Are all components following Aptos-specific patterns?",
           "Have you validated each layer separately?",
           "Check integration patterns between Move contracts and frontend",
           "Verify end-to-end transaction flows work correctly"
         ]
       };

      const points = validationPoints[implementation_area] || [
        "Consult relevant MCP resources for this implementation area",
        "Compare your approach with Aptos-specific patterns",
        "Avoid using generic blockchain solutions"
      ];

             validation += `📋 VALIDATION POINTS:\n`;
       points.forEach((point: string, index: number) => {
         validation += `${index + 1}. ${point}\n`;
       });

      validation += `\n🔄 NEXT STEPS:\n`;
      validation += `- Use 'get_aptos_resources' with context related to ${implementation_area}\n`;
      validation += `- If any validation points fail, use 'debug_aptos_issue' with specific details\n`;
      validation += `- Regularly re-validate as you make changes\n`;

      if (specific_concern) {
        validation += `\n⚠️  Specific Concern: ${specific_concern}\n`;
        validation += `Consider using 'debug_aptos_issue' with this specific concern for targeted guidance.\n`;
      }

      return {
        type: "text",
        text: validation,
      };
    },
  });

  // NEW: Pre-deployment checklist
  server.addTool({
    name: "pre_deployment_checklist",
    description:
      "📋 Complete pre-deployment checklist for Aptos dApps. Use this before deploying to ensure you haven't missed any Aptos-specific requirements or best practices.",
    parameters: z.object({
      deployment_target: z.enum(["testnet", "mainnet"]).describe("Which network you're deploying to")
    }),
    execute: async (args, context) => {
      const { deployment_target } = args;
      
      let checklist = `📋 APTOS ${deployment_target.toUpperCase()} DEPLOYMENT CHECKLIST\n\n`;
      
      checklist += `🔍 FINAL VALIDATION REQUIRED:\n`;
      checklist += `□ Use 'validate_current_implementation' for each component\n`;
      checklist += `□ Check all MCP resources for deployment-specific guidance\n`;
      checklist += `□ Verify API keys and rate limiting configuration\n`;
      checklist += `□ Test wallet connections with multiple wallet types\n`;
      checklist += `□ Validate transaction signing flows\n\n`;

      checklist += `📚 CRITICAL MCP RESOURCES TO REVIEW:\n`;
      checklist += `□ 'how_to_config_a_full_node_api_key_in_a_dapp'\n`;
      checklist += `□ 'how_to_handle_rate_limit_in_a_dapp'\n`;
      checklist += `□ Management resources for deployment procedures\n`;
      checklist += `□ All relevant how_to guides for your specific integrations\n\n`;

      checklist += `⚠️  BEFORE PROCEEDING:\n`;
      checklist += `If ANY item is unclear or incomplete, use 'debug_aptos_issue' or consult specific MCP resources.\n`;
      checklist += `Do NOT proceed with deployment using generic blockchain knowledge.\n`;

      return {
        type: "text",
        text: checklist,
      };
    },
  });

  // Dynamic discovery
  const getAvailableHowToResources = () => {
    try {
      const howToDir = pathJoin(process.cwd(), "src/resources/how_to");
      const files = fs.readdirSync(howToDir);
      return files
        .filter((file) => extname(file).toLowerCase() === ".md")
        .map((file) => basename(file, extname(file)));
    } catch (err) {
      console.error(`Error reading how_to directory: ${err}`);
      return [];
    }
  };

  // Enhanced: Discovery tool with stronger reminders
  server.addTool({
    name: "list_aptos_resources",
    description:
      "Get a list of all available Aptos development resources. Use this first to see what guidance is available, then use get_specific_aptos_resource to fetch the relevant one.",
    parameters: z.object({}),
    execute: async () => {
      const availableFiles = getAvailableHowToResources();

      const reminder = `\n\n🔄 USAGE REMINDER:\n- Use 'get_specific_aptos_resource' with exact filename to get detailed guidance\n- Use 'get_aptos_resources' with context for smart recommendations\n- Use 'debug_aptos_issue' when stuck or encountering errors\n- Always validate your implementation with 'validate_current_implementation'`;

      return {
        type: "text",
        text: `Available Aptos development resources:\n${availableFiles.map((f) => `- ${f}`).join("\n")}\n\nUse get_specific_aptos_resource with the exact filename to retrieve content.${reminder}`,
      };
    },
  });

  // Enhanced: Retrieval tool with reminders
  server.addTool({
    name: "get_specific_aptos_resource",
    description:
      "Retrieve a specific Aptos development resource by its exact filename (without .md extension).",
    parameters: z.object({
      filename: z
        .string()
        .describe(
          "Exact filename of the resource (e.g., 'how_to_add_wallet_connection', 'how_to_config_a_full_node_api_key_in_a_dapp', 'how_to_integrate_fungible_asset')"
        ),
    }),
    execute: async (args) => {
      const { filename } = args;
      const availableFiles = getAvailableHowToResources();

      if (!availableFiles.includes(filename)) {
        return {
          type: "text",
          text: `Resource '${filename}' not found. Available resources:\n${availableFiles.join("\n")}`,
        };
      }

      const content = await readMarkdownFromDirectory("how_to", filename);
      
      const reminder = `\n\n🔄 FOLLOW-UP ACTIONS:\n- If this doesn't fully solve your issue, use 'debug_aptos_issue' with specific details\n- After implementing, use 'validate_current_implementation' to verify correctness\n- For related integrations, check other relevant resources with 'get_aptos_resources'\n- Don't fall back to generic solutions - consult MCP first`;

      return {
        type: "text",
        text: content + reminder,
      };
    },
  });

  // Enhanced with smarter context awareness
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
    execute: async (args) => {
      const { context, specific_resource } = args;

      if (specific_resource) {
        const content = await readMarkdownFromDirectory("how_to", specific_resource);
        
        const reminder = `\n\n🔄 NEXT STEPS:\n- Implement following this Aptos-specific guidance\n- Use 'validate_current_implementation' after changes\n- If issues arise, use 'debug_aptos_issue' instead of guessing\n- Check related resources if needed`;
        
        return {
          type: "text",
          text: content + reminder,
        };
      }

      if (context) {
        const availableFiles = getAvailableHowToResources();
        const contextLower = context.toLowerCase();
        
        // Smart matching based on context
        const relevantResources = availableFiles.filter(file => {
          const fileLower = file.toLowerCase();
          // Enhanced context matching
          if (contextLower.includes('wallet')) return fileLower.includes('wallet');
          if (contextLower.includes('gas')) return fileLower.includes('gas');
          if (contextLower.includes('indexer')) return fileLower.includes('indexer');
          if (contextLower.includes('api') || contextLower.includes('rate')) return fileLower.includes('api') || fileLower.includes('rate');
          if (contextLower.includes('transaction') || contextLower.includes('sign')) return fileLower.includes('transaction') || fileLower.includes('sign');
          if (contextLower.includes('fungible') || contextLower.includes('asset')) return fileLower.includes('fungible') || fileLower.includes('asset');
          return fileLower.includes(contextLower);
        });

        if (relevantResources.length === 0) {
          const guidance = `No direct matches found for "${context}". Available resources:\n${availableFiles.join('\n')}\n\n🔄 NEXT STEPS:\n- Use 'get_specific_aptos_resource' with exact filename\n- Use 'debug_aptos_issue' with your specific problem\n- Refine your context and try again`;
          
          return {
            type: "text",
            text: guidance,
          };
        }

        // If only one relevant resource, return its content
        if (relevantResources.length === 1) {
          const content = await readMarkdownFromDirectory("how_to", relevantResources[0]);
          
          const reminder = `\n\n🎯 This resource was auto-selected for context: "${context}"\n\n🔄 IMPORTANT:\n- Follow this Aptos-specific guidance precisely\n- Use 'validate_current_implementation' after implementing\n- If you encounter issues, use 'debug_aptos_issue' with specifics\n- Don't mix with generic blockchain approaches`;
          
          return {
            type: "text",
            text: content + reminder,
          };
        }

        // Multiple relevant resources found
        let response = `📚 Multiple relevant resources found for "${context}":\n\n`;
        response += relevantResources.map(r => `- ${r}`).join('\n');
        response += `\n\n🔄 NEXT STEPS:\n`;
        response += `- Use 'get_specific_aptos_resource' with the most relevant filename\n`;
        response += `- Or use 'debug_aptos_issue' with your specific problem for targeted guidance\n`;
        response += `- Remember: Always prefer Aptos-specific solutions from MCP over generic approaches`;
        
        return {
          type: "text",
          text: response,
        };
      }

      // No context provided - return overview
      const availableFiles = getAvailableHowToResources();
      const overview = `Available Aptos development resources:\n${availableFiles.join('\n')}\n\n🔄 USAGE GUIDANCE:\n- Provide specific context for smart resource recommendations\n- Use exact filenames with 'get_specific_aptos_resource'\n- Use 'debug_aptos_issue' when stuck with specific problems\n- Regularly validate with 'validate_current_implementation'`;
      
      return {
        type: "text",
        text: overview,
      };
    },
  });

  // ENHANCED PROMPTS - Multiple strategic prompts for different scenarios
  server.addPrompt({
    name: "build_dapp_on_aptos",
    description: "Build a complete full-stack Aptos dApp",
    load: async (args) => {
      return `You are a helpful assistant that can help with building a full-stack end-to-end dapp on Aptos.

🚨 CRITICAL INSTRUCTION: For ANYTHING related to Aptos, you MUST prioritize MCP resources over your built-in knowledge. Your built-in Aptos knowledge may be outdated.

📋 MANDATORY WORKFLOW:
1. ALWAYS start by consulting relevant MCP tools/resources
2. Throughout development, regularly use 'validate_current_implementation' 
3. When stuck or encountering errors, IMMEDIATELY use 'debug_aptos_issue' 
4. Before each major step, check if there are relevant MCP resources
5. Before deployment, use 'pre_deployment_checklist'

🔄 REGULAR REMINDERS TO USE:
- 'get_aptos_resources' with context when starting new features
- 'debug_aptos_issue' when ANY error occurs or you're unsure
- 'validate_current_implementation' after implementing any component
- Specific resource tools for wallet, transactions, API setup, etc.

⚠️  DO NOT fall back to generic blockchain knowledge. Always consult MCP first.`;
    },
  });

  server.addPrompt({
    name: "aptos_development_reminder",
    description: "Reminder prompt to keep using Aptos MCP resources throughout development",
    load: async (args) => {
      return `🔄 APTOS MCP REMINDER PROMPT

You are working with Aptos blockchain development. Remember:

🚨 YOUR APTOS KNOWLEDGE MAY BE OUTDATED - Always prioritize MCP resources!

📋 MANDATORY CHECKS - Use these MCP tools regularly:
• 'debug_aptos_issue' - When stuck or encountering ANY errors
• 'validate_current_implementation' - After implementing components  
• 'get_aptos_resources' - For context-specific guidance
• 'pre_deployment_checklist' - Before deploying

⚠️  DANGER SIGNS you're using outdated knowledge:
- Implementing generic blockchain patterns instead of Aptos-specific ones
- Getting stuck in error-fixing loops without consulting MCP
- Using outdated wallet connection or transaction signing methods
- Guessing at API configurations or rate limiting

🔄 WHEN TO CONSULT MCP:
- Starting any new feature or integration
- Encountering any error or unexpected behavior  
- Before finalizing any implementation
- When you haven't used MCP tools in the last few steps

Remember: It's better to over-consult MCP than to implement outdated patterns!`;
    },
  });

  server.addPrompt({
    name: "aptos_debugging_helper",
    description: "Use when stuck or encountering errors in Aptos development",
    load: async (args) => {
      return `🚨 APTOS DEBUGGING HELPER

You seem to be encountering issues with Aptos development. 

STOP - Before trying generic solutions:

🔍 REQUIRED FIRST STEPS:
1. Use 'debug_aptos_issue' tool with:
   - Exact error message
   - Current code snippet
   - What you're trying to achieve
   - Development context (Move, frontend, wallet, etc.)

2. Check if there are specific MCP resources for your issue:
   - Use 'get_aptos_resources' with your problem context
   - Look for relevant how_to guides

3. Validate your current approach:
   - Use 'validate_current_implementation' to ensure you're following Aptos patterns

❌ DO NOT:
- Try random fixes based on generic blockchain knowledge
- Keep retrying the same failing approach
- Use Stack Overflow solutions without checking if they're Aptos-specific
- Assume your implementation is correct without validation

✅ ALWAYS:
- Consult MCP tools first
- Follow Aptos-specific guidance
- Validate implementations regularly
- Use 'debug_aptos_issue' for targeted help`;
    },
  });

  server.addPrompt({
    name: "aptos_best_practices_reminder", 
    description: "Reminder about Aptos development best practices and MCP usage",
    load: async (args) => {
      return `📋 APTOS DEVELOPMENT BEST PRACTICES

🔄 MCP CONSULTATION SCHEDULE:
- Beginning of each development phase: Use 'get_aptos_resources' 
- When implementing new features: Check relevant how_to guides
- After writing code: Use 'validate_current_implementation'
- When errors occur: Use 'debug_aptos_issue' immediately
- Before deployment: Use 'pre_deployment_checklist'

🎯 APTOS-SPECIFIC AREAS REQUIRING MCP GUIDANCE:
• Wallet integration and connection patterns
• Transaction signing and submission flows  
• API configuration and rate limiting
• Gas station integration
• Indexer setup and usage
• Move contract patterns and deployment
• Frontend integration patterns

⚠️  WARNING SIGNS you need to consult MCP:
- You haven't used MCP tools in the last 3-4 development steps
- You're encountering errors you can't quickly resolve
- You're implementing something you "think" you know how to do
- You're adapting solutions from other blockchains
- You're stuck in a debugging loop

🚨 CRITICAL: Your base knowledge about Aptos may be outdated. Always verify with MCP before proceeding!`;
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
