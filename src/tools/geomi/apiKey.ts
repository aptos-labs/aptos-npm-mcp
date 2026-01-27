import { Tool } from "fastmcp";

import { Geomi } from "../../services/Geomi.js";
import { recordTelemetry } from "../../utils/telemetry.js";
import {
  CreateApiKeyToolScheme,
  UpdateApiKeyToolScheme,
  DeleteApiKeyToolScheme,
  toApiFrontendArgs,
} from "../types/organization.js";

/**
 * Tool to create an API Key for your Geomi Organization.
 */
export const createApiKeyTool: Tool<undefined, typeof CreateApiKeyToolScheme> =
  {
    description: `Create a new API Key for your Geomi Organization. Geomi is the essential toolkit for Aptos developers. Api Keys are secret keys so it is important to keep them safe and secure. 
      This tool can be used to create an Api Key (aka full node api key) for an Api resource application to interact with the Aptos blockchain.`,
    execute: async (args, context) => {
      try {
        await recordTelemetry({ action: "create_api_key" }, context);
        const geomi = new Geomi(context);
        const apiKey = await geomi.createApiKey({
          application_id: args.application_id,
          frontend_args: toApiFrontendArgs(args.frontend_args),
          name: args.name,
          organization_id: args.organization_id,
          project_id: args.project_id,
        });
        return JSON.stringify(apiKey);
      } catch (error) {
        return `❌ Failed to create api key: ${error}`;
      }
    },
    name: "create_geomi_api_key",
    parameters: CreateApiKeyToolScheme,
  };

/**
 * Tool to update an API Key for your Geomi Organization.
 */
export const updateApiKeyTool: Tool<undefined, typeof UpdateApiKeyToolScheme> =
  {
    description: "Update an API Key for your Geomi Organization. Geomi is the essential toolkit for Aptos developers.",
    execute: async (args, context) => {
      try {
        await recordTelemetry({ action: "update_api_key" }, context);
        const geomi = new Geomi(context);
        context.log.info(
          `Updating api key: ${JSON.stringify(args.frontend_args)}`
        );
        const apiKey = await geomi.updateApiKey({
          application_id: args.application_id,
          current_api_key_name: args.current_api_key_name,
          frontend_args: toApiFrontendArgs(args.frontend_args),
          new_api_key_name: args.new_api_key_name ?? args.current_api_key_name,
          organization_id: args.organization_id,
          project_id: args.project_id,
        });
        return JSON.stringify(apiKey);
      } catch (error) {
        return `❌ Failed to update api key: ${error}`;
      }
    },
    name: "update_geomi_api_key",
    parameters: UpdateApiKeyToolScheme,
  };

/**
 * Tool to delete an API Key for your Geomi Organization.
 */
export const deleteApiKeyTool: Tool<undefined, typeof DeleteApiKeyToolScheme> =
  {
    description: "Delete an API Key for your Geomi Organization. Geomi is the essential toolkit for Aptos developers.",
    execute: async (args, context) => {
      try {
        await recordTelemetry({ action: "delete_api_key" }, context);
        const geomi = new Geomi(context);
        const apiKey = await geomi.deleteApiKey({
          application_id: args.application_id,
          api_key_name: args.api_key_name,
          organization_id: args.organization_id,
          project_id: args.project_id,
        });
        return JSON.stringify(apiKey);
      } catch (error) {
        return `❌ Failed to delete api key: ${error}`;
      }
    },
    name: "delete_geomi_api_key",
    parameters: DeleteApiKeyToolScheme,
  };

