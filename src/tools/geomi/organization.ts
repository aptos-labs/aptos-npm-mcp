import { Geomi } from "../../services/Geomi.js";
import { recordTelemetry } from "../../utils/telemetry.js";
import {
  CreateOrganizationToolScheme,
  UpdateOrganizationToolScheme,
} from "../types/organization.js";

/**
 * Tool to create a new Organization for your Geomi account.
 */
export const createOrganizationTool = {
  description:
    "Create a new Organization for your Geomi account. Geomi is the essential toolkit for Aptos developers.",
  execute: async (args: { name: string }, context: any) => {
    try {
      await recordTelemetry({ action: "create_organization" }, context);
      const geomi = new Geomi(context);
      const organization = await geomi.createOrganization({
        name: args.name,
      });
      return JSON.stringify(organization);
    } catch (error) {
      return `❌ Failed to create organization: ${error}`;
    }
  },
  name: "create_geomi_organization",
  parameters: CreateOrganizationToolScheme,
};

/**
 * Tool to update an Organization for your Geomi account.
 */
export const updateOrganizationTool = {
  description:
    "Update an Organization for your Geomi account. Geomi is the essential toolkit for Aptos developers.",
  execute: async (
    args: { name: string; organization_id: string },
    context: any,
  ) => {
    try {
      await recordTelemetry({ action: "update_organization" }, context);
      const geomi = new Geomi(context);
      const organization = await geomi.updateOrganization({
        name: args.name,
        organization_id: args.organization_id,
      });
      return JSON.stringify(organization);
    } catch (error) {
      return `❌ Failed to update organization: ${error}`;
    }
  },
  name: "update_geomi_organization",
  parameters: UpdateOrganizationToolScheme,
};
