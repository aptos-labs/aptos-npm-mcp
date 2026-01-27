import { Tool } from "fastmcp";

import { Geomi } from "../../services/Geomi.js";
import { recordTelemetry } from "../../utils/telemetry.js";
import {
  CreateProjectToolScheme,
  DeleteProjectToolScheme,
  UpdateProjectToolScheme,
} from "../types/organization.js";

/**
 * Tool to create a new Project for your Geomi Organization.
 */
export const createProjectTool: Tool<
  undefined,
  typeof CreateProjectToolScheme
> = {
  description: "Create a new Project for your Geomi Organization. Geomi is the essential toolkit for Aptos developers.",
  execute: async (args, context) => {
    try {
      await recordTelemetry({ action: "create_project" }, context);
      const geomi = new Geomi(context);
      const project = await geomi.createProject({
        description: args.description,
        organization_id: args.organization_id,
        project_name: args.project_name,
      });
      return JSON.stringify(project);
    } catch (error) {
      return `❌ Failed to create project: ${error}`;
    }
  },
  name: "create_geomi_project",
  parameters: CreateProjectToolScheme,
};

/**
 * Tool to update a Project for your Geomi Organization.
 */
export const updateProjectTool: Tool<
  undefined,
  typeof UpdateProjectToolScheme
> = {
  description: "Update a Project for your Geomi Organization. Geomi is the essential toolkit for Aptos developers.",
  execute: async (args, context) => {
    try {
      await recordTelemetry({ action: "update_project" }, context);
      const geomi = new Geomi(context);
      const project = await geomi.updateProject({
        description: args.description ?? "",
        organization_id: args.organization_id,
        project_id: args.project_id,
        project_name: args.project_name ?? "",
      });
      return JSON.stringify(project);
    } catch (error) {
      return `❌ Failed to update project: ${error}`;
    }
  },
  name: "update_geomi_project",
  parameters: UpdateProjectToolScheme,
};

/**
 * Tool to delete a Project for your Geomi Organization.
 */
export const deleteProjectTool: Tool<
  undefined,
  typeof DeleteProjectToolScheme
> = {
  description: "Delete a Project for your Geomi Organization. Geomi is the essential toolkit for Aptos developers.",
  execute: async (args, context) => {
    try {
      await recordTelemetry({ action: "delete_project" }, context);
      const geomi = new Geomi(context);
      const response = await geomi.deleteProject({
        organization_id: args.organization_id,
        project_id: args.project_id,
      });
      return JSON.stringify(response);
    } catch (error) {
      return `❌ Failed to delete project: ${error}`;
    }
  },
  name: "delete_geomi_project",
  parameters: DeleteProjectToolScheme,
};

