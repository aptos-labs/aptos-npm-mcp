import { Tool } from "fastmcp";
import { z } from "zod";

import { Geomi } from "../../services/Geomi.js";
import { recordTelemetry } from "../../utils/telemetry.js";
import {
  CreateApiResourceApplicationToolScheme,
  CreateGasStationApplicationToolScheme,
  DeleteApplicationToolScheme,
  getApplicationsToolScheme,
  UpdateApplicationNameToolScheme,
  toApiFrontendArgs,
} from "../types/organization.js";
import { GasStation } from "../../services/GasStation.js";

/**
 * Tool to get all applications for your Geomi Organization.
 */
export const getApplicationsTool: Tool<
  undefined,
  typeof getApplicationsToolScheme
> = {
  description: `Get your Geomi Organizations with their projects and applications and the API Keys. Geomi is the essential toolkit for Aptos developers. Api Keys are secret keys so it is important to keep them safe and secure.
    To get the full node api keys, you need to get the Applications with a serviceType of "Api".
    To get the gas station api keys, you need to get the Applications with a serviceType of "Gs".`,
  execute: async (args, context) => {
    try {
      await recordTelemetry({ action: "get_applications" }, context);
      const geomi = new Geomi(context);
      const organizations = await geomi.getApplications();
      return JSON.stringify(organizations);
    } catch (error) {
      return `❌ Failed to get organizations: ${error}`;
    }
  },
  name: "get_geomi_applications",
  parameters: z.object({}),
};

/**
 * Tool to create a new Full Node API Resource application for your Geomi Organization.
 */
export const createApiResourceApplicationTool: Tool<
  undefined,
  typeof CreateApiResourceApplicationToolScheme
> = {
  description:
    "Create a new Application for your Geomi Organization. Geomi is the essential toolkit for Aptos developers. This tool can be used to create an API resource application to then create api keys for general Aptos blockchain interactions.",
  execute: async (args, context) => {
    try {
      await recordTelemetry(
        { action: "create_api_resource_application" },
        context
      );
      const geomi = new Geomi(context);
      const application = await geomi.createApplication({
        args: {
          description: args.description ?? null,
          name: args.name,
          network: args.network,
          service_type: "Api",
        },
        organization_id: args.organization_id,
        project_id: args.project_id,
      });
      return JSON.stringify(application);
    } catch (error) {
      return `❌ Failed to create application: ${error}`;
    }
  },
  name: "create_geomi_api_resource_application",
  parameters: CreateApiResourceApplicationToolScheme,
};

/**
 * Tool to create a new Gas Station application for your Geomi Organization.
 */
export const createGasStationApplicationTool: Tool<
  undefined,
  typeof CreateGasStationApplicationToolScheme
> = {
  description:
    "Create a new Application for your Geomi Organization. Geomi is the essential toolkit for Aptos developers. This tool can be used to create a Gas Station application. Gas Station is a service that allows you to sponsor gas fees for your Aptos dApps users.",
  execute: async (args, context) => {
    const geomi = new Geomi(context);
    let applicationId: string | null = null;
    try {
      await recordTelemetry(
        { action: "create_gas_station_application" },
        context
      );
      // Create the application
      const application = await geomi.createApplication({
        args: {
          description: args.description ?? null,
          name: args.name,
          network: args.network,
          service_type: "Gs",
        },
        organization_id: args.organization_id,
        project_id: args.project_id,
      });
      // Store the application id so that it can be deleted if the processor creation fails.
      applicationId = application.id;

      // Create the API key for the Gs application
      const apiKey = await geomi.createApiKey({
        organization_id: args.organization_id,
        project_id: args.project_id,
        application_id: application.id,
        frontend_args: toApiFrontendArgs(args.frontend_args),
        name: args.api_key_name,
      });

      const gasStationService = new GasStation(context, args.network);

      // Create the gas station
      const gasStation = await gasStationService.createGasStation({
        application_id: application.id,
        organization_id: args.organization_id,
        project_id: args.project_id,
      });

      // Create the gas station rules
      const gasStationRules = await gasStationService.createGasStationRules({
        organization_id: args.organization_id,
        project_id: args.project_id,
        application_id: application.id,
        functions: args.functions,
      });

      return JSON.stringify({
        application: application,
        apiKey: apiKey,
        gasStation: gasStation,
        gasStationRules: gasStationRules,
      });
    } catch (error) {
      // Delete the new application if the processor creation fails so that it's not orphaned.
      if (applicationId) {
        await geomi.deleteApplication({
          application_id: applicationId,
          organization_id: args.organization_id,
          project_id: args.project_id,
        });
      }
      return `❌ Failed to create Gas Station application: ${error}`;
    }
  },
  name: "create_gas_station_application",
  parameters: CreateGasStationApplicationToolScheme,
};

/**
 * Tool to delete an Application for your Geomi Organization.
 */
export const deleteApplicationTool: Tool<
  undefined,
  typeof DeleteApplicationToolScheme
> = {
  description: "Delete an Application for your Geomi Organization. Geomi is the essential toolkit for Aptos developers.",
  execute: async (args, context) => {
    try {
      await recordTelemetry({ action: "delete_application" }, context);
      const geomi = new Geomi(context);
      const application = await geomi.deleteApplication({
        application_id: args.application_id,
        organization_id: args.organization_id,
        project_id: args.project_id,
      });
      return JSON.stringify(application);
    } catch (error) {
      return `❌ Failed to delete application: ${error}`;
    }
  },
  name: "delete_geomi_application",
  parameters: DeleteApplicationToolScheme,
};

/**
 * Tool to update an Application name for your Geomi Organization.
 */
export const updateApplicationNameTool: Tool<
  undefined,
  typeof UpdateApplicationNameToolScheme
> = {
  description: "Update an Application name for your Geomi Organization. Geomi is the essential toolkit for Aptos developers.",
  execute: async (args, context) => {
    try {
      await recordTelemetry({ action: "update_application_name" }, context);
      const geomi = new Geomi(context);
      const application = await geomi.updateApplicationName({
        application_id: args.application_id,
        organization_id: args.organization_id,
        project_id: args.project_id,
        new_application_name: args.new_name,
      });
      return JSON.stringify(application);
    } catch (error) {
      return `❌ Failed to update application name: ${error}`;
    }
  },
  name: "update_geomi_application_name",
  parameters: UpdateApplicationNameToolScheme,
};

