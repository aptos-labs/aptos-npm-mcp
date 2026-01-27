import { FastMCP } from "fastmcp";

import {
  createApiKeyTool,
  deleteApiKeyTool,
  updateApiKeyTool,
} from "./apiKey.js";
import {
  createApiResourceApplicationTool,
  createGasStationApplicationTool,
  deleteApplicationTool,
  updateApplicationNameTool,
} from "./applications.js";
import { getApplicationsTool } from "./applications.js";
import {
  createOrganizationTool,
  updateOrganizationTool,
} from "./organization.js";
import {
  createProjectTool,
  deleteProjectTool,
  updateProjectTool,
} from "./projects.js";

export function registerGeomiTools(server: FastMCP): void {
  // get all user's organizations + projects + applications + api keys
  server.addTool(getApplicationsTool);
  // Create tools
  server.addTool(createOrganizationTool);
  server.addTool(createProjectTool);
  server.addTool(createApiResourceApplicationTool);
  server.addTool(createGasStationApplicationTool);
  server.addTool(createApiKeyTool);
  // Update tools
  server.addTool(updateOrganizationTool);
  server.addTool(updateProjectTool);
  server.addTool(updateApplicationNameTool);
  server.addTool(updateApiKeyTool);
  // Delete tools
  server.addTool(deleteApplicationTool);
  server.addTool(deleteProjectTool);
  server.addTool(deleteApiKeyTool);
}

