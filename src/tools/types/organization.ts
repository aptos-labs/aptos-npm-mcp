import { z } from "zod";
import { CreateApiKeyFrontendArgs } from "@aptos-labs/api-gateway-admin-api-client";

// Helper to convert Zod-validated frontend_args to API type
type ZodFrontendArgs = z.infer<typeof CreateApiKeyToolScheme>["frontend_args"];

export function toApiFrontendArgs(
  args: ZodFrontendArgs
): CreateApiKeyFrontendArgs | null {
  if (!args) return null;
  // Type assertion needed because Zod infers string for enum fields,
  // but the API uses strict union types (HttpLimitScope, Duration, etc.)
  // The runtime values are compatible - this is just a compile-time type mismatch.
  return {
    web_app_urls: args.web_app_urls ?? [],
    extension_ids: args.extension_ids ?? [],
    per_ip_limit_rules: args.per_ip_limit_rules ?? [],
    enforce_origin: args.enforce_origin ?? false,
    per_ip_stream_limit: args.per_ip_stream_limit ?? null,
  } as unknown as CreateApiKeyFrontendArgs;
}

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

// Http Limit Rule Schema for v4 API
const HttpLimitRuleKeySchema = z.object({
  scope: z.string().describe("The scope of the limit rule (e.g., 'PerIp')"),
  limit_unit: z.string().describe("The unit of the limit (e.g., 'ComputeUnits')"),
  window: z.string().describe("The time window for the limit (e.g., '5m')"),
});

const HttpLimitRuleSchema = z.object({
  key: HttpLimitRuleKeySchema,
  limit: z.number().describe("The limit value"),
});

// Create Api Key Scheme
export const CreateApiKeyToolScheme = z.object({
  application_id: z
    .string()
    .describe("The application id to create the api key for."),
  frontend_args: z
    .object({
      extension_ids: z
        .array(z.string())
        .describe(
          "The extension ids to allow the api key to access. If not provided, all extension ids will be allowed."
        )
        .default([]),
      web_app_urls: z
        .array(z.string())
        .describe(
          "The web app urls to allow the api key to access. If not provided, all URLs will be allowed."
        )
        .default([]),
      per_ip_limit_rules: z
        .array(HttpLimitRuleSchema)
        .describe(
          "Per-IP rate limit rules. Leave empty for default rate limits."
        )
        .default([]),
      enforce_origin: z
        .boolean()
        .describe("Whether to enforce origin checking for requests.")
        .default(false),
      per_ip_stream_limit: z
        .number()
        .nullable()
        .describe("Per-IP stream limit, or null for default.")
        .default(null),
    })
    .optional(),
  name: z
    .string()
    .describe(
      "The name of the api key. Must be between 3 and 32 characters long, with only lowercase letters, numbers, dashes and underscores."
    ),
  organization_id: z
    .string()
    .describe("The organization id to create the api key for."),
  project_id: z.string().describe("The project id to create the api key for."),
});

export const UpdateApiKeyToolScheme = z.object({
  application_id: z
    .string()
    .describe("The application id to update the api key for."),
  current_api_key_name: z.string().describe("The current name of the api key."),
  frontend_args: z
    .object({
      extension_ids: z
        .array(z.string())
        .describe(
          "The extension ids to allow the api key to access. If not provided, all extension ids will be allowed."
        )
        .optional()
        .default([]),
      web_app_urls: z
        .array(z.string())
        .describe(
          "The web app urls to allow the api key to access. If not provided, all URLs will be allowed."
        )
        .optional()
        .default([]),
      per_ip_limit_rules: z
        .array(HttpLimitRuleSchema)
        .describe(
          "Per-IP rate limit rules. Leave empty for default rate limits."
        )
        .optional()
        .default([]),
      enforce_origin: z
        .boolean()
        .describe("Whether to enforce origin checking for requests.")
        .optional()
        .default(false),
      per_ip_stream_limit: z
        .number()
        .nullable()
        .describe("Per-IP stream limit, or null for default.")
        .optional()
        .default(null),
    })
    .optional(),
  new_api_key_name: z
    .string()
    .describe("The new name of the api key.")
    .optional(),
  organization_id: z
    .string()
    .describe("The organization id to update the api key for."),
  project_id: z.string().describe("The project id to update the api key for."),
});

export const DeleteApiKeyToolScheme = z.object({
  application_id: z
    .string()
    .describe("The application id to delete the api key for."),
  api_key_name: z.string().describe("The name of the api key to delete."),
  organization_id: z
    .string()
    .describe("The organization id to delete the api key for."),
  project_id: z.string().describe("The project id to delete the api key for."),
});

export const CreateApiResourceApplicationToolScheme = z.object({
  description: z
    .string()
    .describe("The description of the application.")
    .optional(),
  name: z
    .string()
    .describe(
      "The name of the application. Must be between 3 and 32 characters long, with only lowercase letters, numbers, dashes and underscores."
    ),
  network: z
    .string()
    .describe(
      "The network to create the application for. Can be devnet, testnet or mainnet."
    ),
  organization_id: z
    .string()
    .describe("The organization id to create the application for."),
  project_id: z
    .string()
    .describe("The project id to create the application for."),
});

export const CreateGasStationApplicationToolScheme =
  CreateApiResourceApplicationToolScheme.omit({ network: true })
    .merge(CreateApiKeyToolScheme.omit({ application_id: true, name: true }))
    .extend({
      network: z
        .enum(["testnet", "mainnet"])
        .describe(
          "The network to create the gas station application for. Can only be testnet or mainnet."
        ),
      api_key_name: z
        .string()
        .describe(
          "The name of the api key to create the gas station for. This is the name of the api key that will be created for the gas station. Must be between 3 and 32 characters long, with only lowercase letters, numbers, dashes and underscores."
        ),
      functions: z
        .array(z.string())
        .describe(
          "A list of functions the gas station will sponsor. Each function should be in the format of <module_address>::<module_name>::<function_name>."
        ),
    });

export const CreateProjectToolScheme = z.object({
  description: z.string().describe("The description of the project."),
  organization_id: z
    .string()
    .describe("The organization id to create the project for."),
  project_name: z
    .string()
    .describe(
      "The name of the project. Must be between 3 and 32 characters long, with only lowercase letters, numbers, dashes and underscores."
    ),
});

export const CreateOrganizationToolScheme = z.object({
  name: z
    .string()
    .describe(
      "The name of the organization. Must be between 3 and 32 characters long, with only lowercase letters, numbers, dashes and underscores."
    ),
});

export const DeleteApplicationToolScheme = z.object({
  application_id: z.string().describe("The application id to delete."),
  organization_id: z
    .string()
    .describe("The organization id to delete the application for."),
  project_id: z
    .string()
    .describe("The project id to delete the application for."),
});

export const UpdateProjectToolScheme = z.object({
  organization_id: z
    .string()
    .describe("The organization id to update the project for."),
  project_id: z.string().describe("The project id to update the project for."),
  project_name: z
    .string()
    .describe("The name of the project to update.")
    .optional(),
  description: z
    .string()
    .describe("The description of the project.")
    .optional(),
});

export const UpdateOrganizationToolScheme = z.object({
  name: z.string().describe("The name of the organization to update."),
  organization_id: z
    .string()
    .describe("The organization id to update the organization for."),
});

export const DeleteProjectToolScheme = z.object({
  organization_id: z
    .string()
    .describe("The organization id to delete the project for."),
  project_id: z.string().describe("The project id to delete the project for."),
});

export const UpdateApplicationNameToolScheme = z.object({
  organization_id: z
    .string()
    .describe("The organization id to update the application name for."),
  project_id: z
    .string()
    .describe("The project id to update the application name for."),
  application_id: z
    .string()
    .describe("The application id to update the name for."),
  new_name: z.string().describe("The new name of the application."),
});

// Query params types
export type CreateApiKeyParams = z.infer<typeof CreateApiKeyToolScheme>;
