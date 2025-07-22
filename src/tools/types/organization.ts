import { z } from "zod";

// Get Organizations Scheme
export const getApplicationsToolScheme = z.object({});

// Get Projects Scheme
export const GetProjectsToolScheme = z.object({
  organization_id: z
    .string()
    .describe(
      "The organization id to get projects for. If not provided, returns available projects overview."
    ),
});

// Create Api Key Scheme
export const CreateApiKeyToolScheme = z.object({
  organization_id: z
    .string()
    .describe("The organization id to create the api key for."),
  project_id: z.string().describe("The project id to create the api key for."),
  application_id: z
    .string()
    .describe("The application id to create the api key for."),
  name: z.string().describe("The name of the api key."),
  frontend_args: z.object({
    web_app_urls: z
      .array(z.string())
      .describe(
        "The web app urls to allow the api key to access. If not provided, all URLs will be allowed."
      )
      .default([]),
    extension_ids: z
      .array(z.string())
      .describe(
        "The extension ids to allow the api key to access. If not provided, all extension ids will be allowed."
      )
      .default([]),
    http_rate_limit_per_ip: z
      .number()
      .describe(
        "The http rate limit per ip. If not provided, the default 2,000,000 Compute Units per 5 minutes rate limit will be used."
      )
      .default(2000000),
  }),
});

export const DeleteApiKeyToolScheme = z.object({
  organization_id: z
    .string()
    .describe("The organization id to delete the api key for."),
  project_id: z.string().describe("The project id to delete the api key for."),
  application_id: z
    .string()
    .describe("The application id to delete the api key for."),
  api_key_name: z.string().describe("The name of the api key to delete."),
});

export const CreateApiResourceApplicationToolScheme = z.object({
  organization_id: z
    .string()
    .describe("The organization id to create the application for."),
  project_id: z
    .string()
    .describe("The project id to create the application for."),
  name: z
    .string()
    .describe(
      "The name of the application. Must be between 3 and 32 characters long, with only lowercase letters, numbers, dashes and underscores."
    ),
  network: z.string().describe("The network to create the application for."),
  description: z
    .string()
    .describe("The description of the application.")
    .optional(),
});

export const CreateProjectToolScheme = z.object({
  organization_id: z
    .string()
    .describe("The organization id to create the project for."),
  project_name: z
    .string()
    .describe(
      "The name of the project. Must be between 3 and 32 characters long, with only lowercase letters, numbers, dashes and underscores."
    ),
  description: z.string().describe("The description of the project."),
});

export const CreateOrganizationToolScheme = z.object({
  name: z
    .string()
    .describe(
      "The name of the organization. Must be between 3 and 32 characters long, with only lowercase letters, numbers, dashes and underscores."
    ),
});

// Query params types
export type CreateApiKeyParams = z.infer<typeof CreateApiKeyToolScheme>;
