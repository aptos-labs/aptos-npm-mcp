import type { FastMCP, Tool } from "fastmcp";
import { z } from "zod";
import {
  CreateApiKeyToolScheme,
  CreateApiResourceApplicationToolScheme,
  CreateOrganizationToolScheme,
  CreateProjectToolScheme,
  DeleteApiKeyToolScheme,
  getApplicationsToolScheme,
} from "../types/organization.js";
import { AptosBuild } from "../../services/AptosBuild.js";
import { recordTelemetry } from "../../utils/telemtry.js";

export const getApplicationsTool: Tool<
  undefined,
  typeof getApplicationsToolScheme
> = {
  name: "get_aptos_build_applications",
  description: `Get your Aptos Build Organizations with their projects and applications and the API Keys. Api Keys are secret keys so it is important to keep them safe and secure.
    To get the full node api keys, you need to get the Applications with a serviceType of "Api".
    To get the gas station api keys, you need to get the Applications with a serviceType of "Gs".`,
  parameters: z.object({}),
  execute: async (args, context) => {
    try {
      await recordTelemetry({ action: "get_applications" }, context);
      const aptosBuild = new AptosBuild();
      const organizations = await aptosBuild.getApplications();
      return JSON.stringify(organizations);
    } catch (error) {
      return `❌ Failed to get organizations: ${(error as Error).message}`;
    }
  },
};

export const createOrganizationTool: Tool<
  undefined,
  typeof CreateOrganizationToolScheme
> = {
  name: "create_aptos_build_organization",
  description: "Create a new Organization for your Aptos Build.",
  parameters: CreateOrganizationToolScheme,
  execute: async (args, context) => {
    try {
      await recordTelemetry({ action: "create_organization" }, context);
      const aptosBuild = new AptosBuild();
      const organization = await aptosBuild.createOrganization({
        name: args.name,
      });
      return JSON.stringify(organization);
    } catch (error) {
      return `❌ Failed to create organization: ${(error as Error).message}`;
    }
  },
};

export const createProjectTool: Tool<
  undefined,
  typeof CreateProjectToolScheme
> = {
  name: "create_aptos_build_project",
  description: "Create a new Project for your Aptos Build Organization.",
  parameters: CreateProjectToolScheme,
  execute: async (args, context) => {
    try {
      await recordTelemetry({ action: "create_project" }, context);
      const aptosBuild = new AptosBuild();
      const project = await aptosBuild.createProject({
        organization_id: args.organization_id,
        project_name: args.project_name,
        description: args.description,
      });
      return JSON.stringify(project);
    } catch (error) {
      return `❌ Failed to create project: ${(error as Error).message}`;
    }
  },
};

export const createApiResourceApplicationTool: Tool<
  undefined,
  typeof CreateApiResourceApplicationToolScheme
> = {
  name: "create_aptos_build_api_resource_application",
  description:
    "Create a new Application for your Aptos Build Organization. This tool can be used to create an API resource application to then create api keys for general blockchain interactions.",
  parameters: CreateApiResourceApplicationToolScheme,
  execute: async (args, context) => {
    try {
      await recordTelemetry(
        { action: "create_api_resource_application" },
        context
      );
      const aptosBuild = new AptosBuild();
      const application = await aptosBuild.createApplication({
        organization_id: args.organization_id,
        project_id: args.project_id,
        args: {
          name: args.name,
          network: args.network,
          description: args.description ?? null,
          service_type: "Api",
        },
      });
      return JSON.stringify(application);
    } catch (error) {
      return `❌ Failed to create application: ${(error as Error).message}`;
    }
  },
};

export const createApiKeyTool: Tool<undefined, typeof CreateApiKeyToolScheme> =
  {
    name: "create_aptos_build_api_key",
    description: `Create a new API Key for your Aptos Build Organization. Api Keys are secret keys so it is important to keep them safe and secure. 
      This tool can be used to create an Api Key (aka full node api key) for an Api resource application.`,
    parameters: CreateApiKeyToolScheme,
    execute: async (args, context) => {
      try {
        await recordTelemetry({ action: "create_api_key" }, context);
        const aptosBuild = new AptosBuild();
        const apiKey = await aptosBuild.createApiKey({
          organization_id: args.organization_id,
          project_id: args.project_id,
          application_id: args.application_id,
          name: args.name,
          frontend_args: args.frontend_args ?? null,
        });
        return JSON.stringify(apiKey);
      } catch (error) {
        return `❌ Failed to create api key: ${(error as Error).message}`;
      }
    },
  };

export const deleteApiKeyTool: Tool<undefined, typeof DeleteApiKeyToolScheme> =
  {
    name: "delete_aptos_build_api_key",
    description: "Delete an API Key from your Aptos Build Organization.",
    parameters: DeleteApiKeyToolScheme,
    execute: async (args, context) => {
      try {
        await recordTelemetry({ action: "delete_api_key" }, context);
        const aptosBuild = new AptosBuild();
        await aptosBuild.deleteApiKey({
          organization_id: args.organization_id,
          project_id: args.project_id,
          application_id: args.application_id,
          api_key_name: args.api_key_name,
          context,
        });
        return "✅ API key deleted successfully";
      } catch (error) {
        return `❌ Failed to delete api key: ${(error as Error).message}`;
      }
    },
  };

export function registerOrganizationTools(server: FastMCP): void {
  server.addTool(getApplicationsTool);
  server.addTool(createOrganizationTool);
  server.addTool(createApiResourceApplicationTool);
  server.addTool(createProjectTool);
  server.addTool(createApiKeyTool);
  server.addTool(deleteApiKeyTool);
}
