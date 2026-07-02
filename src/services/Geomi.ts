import {
  type ApiKey,
  type Application,
  type CreateApiKeyFrontendArgs,
  type CreateApplicationArgs,
  createAdminApiClient,
  type Organization,
  type Project,
  type RecursiveOrgData,
} from "@aptos-labs/api-gateway-admin-api-client";
import type { Context } from "fastmcp";
import { config } from "../config.js";

export class Geomi {
  protected readonly context: Context<any>;
  protected readonly headers: Record<string, string>;
  private readonly adminUrl: string;

  constructor(context: Context<any>) {
    if (!config.geomi.botKey) {
      throw new Error(
        `APTOS_BOT_KEY is not set. To generate a Bot Key: 
        1. Go to [https://geomi.dev/](https://geomi.dev/)
        2. Click on your name in the bottom left corner
        3. Click on "Bot Keys"
        4. Click on the "Create Bot Key" button
        5. Copy the Bot Key and paste it into the MCP configuration file as an env arg: APTOS_BOT_KEY=<your-bot-key>`,
      );
    }
    this.adminUrl = config.geomi.adminUrl;
    this.headers = {
      Authorization: `Bearer ${config.geomi.botKey}`,
      "x-is-aptos-bot": "true",
    };
    this.context = context;
  }

  /**
   * Create a new API Key for an application.
   * @returns ApiKey
   */
  async createApiKey({
    application_id,
    frontend_args,
    name,
    organization_id,
    project_id,
  }: {
    application_id: string;
    frontend_args: CreateApiKeyFrontendArgs | null;
    name: string;
    organization_id: string;
    project_id: string;
  }): Promise<ApiKey> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-application-id": application_id,
        "x-jwt-organization-id": organization_id,
        "x-jwt-project-id": project_id,
      });
      const apiKey = await adminApiClient.mutation([
        "createApiKeyV2",
        {
          frontend_args,
          name,
        },
      ]);
      return apiKey;
    } catch (error) {
      throw new Error(`Failed to create api key: ${JSON.stringify(error)}`);
    }
  }

  /**
   * Create a new Application for a project.
   * Application can be of type Full Node API, Gas Station.
   * @returns Application
   */
  async createApplication({
    args,
    organization_id,
    project_id,
  }: {
    args: CreateApplicationArgs;
    organization_id: string;
    project_id: string;
  }): Promise<Application> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-organization-id": organization_id,
        "x-jwt-project-id": project_id,
      });
      const application = await adminApiClient.mutation([
        "createApplicationV2",
        args,
      ]);
      return application;
    } catch (error) {
      throw new Error(`Failed to create application: ${JSON.stringify(error)}`);
    }
  }

  /**
   * Create a new Organization.
   * @returns Organization
   */
  async createOrganization({ name }: { name: string }): Promise<Organization> {
    try {
      const adminApiClient = this.createApiClient();
      const organization = await adminApiClient.mutation([
        "createOrganization",
        { name },
      ]);
      return organization;
    } catch (error) {
      throw new Error(
        `Failed to create organization: ${JSON.stringify(error)}`,
      );
    }
  }

  /**
   * Create a new Project for an Organization.
   * @returns Project
   */
  async createProject({
    description,
    organization_id,
    project_name,
  }: {
    description: string;
    organization_id: string;
    project_name: string;
  }): Promise<Project> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-organization-id": organization_id,
      });
      const project = await adminApiClient.mutation([
        "createProject",
        {
          description,
          project_name,
        },
      ]);
      return project;
    } catch (error) {
      throw new Error(`Failed to create project: ${JSON.stringify(error)}`);
    }
  }

  /**
   * Get all organizations with their projects and applications and the API Keys.
   * @returns RecursiveOrgData[]
   */
  async getApplications(): Promise<RecursiveOrgData[]> {
    try {
      const adminApiClient = this.createApiClient();
      const organizations = await adminApiClient.query([
        "getOrganizationsRecursively",
      ]);
      return organizations;
    } catch (error) {
      throw new Error(`Failed to get organizations: ${JSON.stringify(error)}`);
    }
  }

  async updateApiKey({
    application_id,
    current_api_key_name,
    frontend_args,
    new_api_key_name,
    organization_id,
    project_id,
  }: {
    application_id: string;
    current_api_key_name: string;
    frontend_args: CreateApiKeyFrontendArgs | null;
    new_api_key_name: string;
    organization_id: string;
    project_id: string;
  }): Promise<ApiKey> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-application-id": application_id,
        "x-jwt-organization-id": organization_id,
        "x-jwt-project-id": project_id,
      });
      const apiKey = await adminApiClient.mutation([
        "editApiKey",
        {
          current_api_key_name: current_api_key_name,
          frontend_args: frontend_args,
          new_api_key_name: new_api_key_name,
        },
      ]);
      return apiKey;
    } catch (error) {
      throw new Error(`Failed to update api key: ${JSON.stringify(error)}`);
    }
  }

  async deleteApiKey({
    application_id,
    api_key_name,
    organization_id,
    project_id,
  }: {
    application_id: string;
    api_key_name: string;
    organization_id: string;
    project_id: string;
  }): Promise<ApiKey> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-application-id": application_id,
        "x-jwt-organization-id": organization_id,
        "x-jwt-project-id": project_id,
      });
      const apiKey = await adminApiClient.mutation([
        "deleteApiKeyV2",
        {
          name: api_key_name,
        },
      ]);
      return apiKey;
    } catch (error) {
      throw new Error(`Failed to delete api key: ${JSON.stringify(error)}`);
    }
  }

  async deleteApplication({
    organization_id,
    project_id,
    application_id,
  }: {
    organization_id: string;
    project_id: string;
    application_id: string;
  }): Promise<Application> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-organization-id": organization_id,
        "x-jwt-project-id": project_id,
        "x-jwt-application-id": application_id,
      });
      const application = await adminApiClient.mutation([
        "deleteApplicationV2",
        {
          _dummy: "",
        },
      ]);
      return application;
    } catch (error) {
      throw new Error(`Failed to delete application: ${JSON.stringify(error)}`);
    }
  }

  async updateProject({
    description,
    organization_id,
    project_id,
    project_name,
  }: {
    description: string;
    organization_id: string;
    project_id: string;
    project_name: string;
  }): Promise<Project> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-organization-id": organization_id,
        "x-jwt-project-id": project_id,
      });
      const project = await adminApiClient.mutation([
        "updateProject",
        {
          description,
          project_name,
        },
      ]);
      return project;
    } catch (error) {
      throw new Error(`Failed to update project: ${JSON.stringify(error)}`);
    }
  }

  async updateOrganization({
    name,
    organization_id,
  }: {
    name: string;
    organization_id: string;
  }): Promise<Organization> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-organization-id": organization_id,
      });
      const organization = await adminApiClient.mutation([
        "updateOrganization",
        {
          name,
        },
      ]);
      return organization;
    } catch (error) {
      throw new Error(
        `Failed to update organization: ${JSON.stringify(error)}`,
      );
    }
  }

  async deleteProject({
    organization_id,
    project_id,
  }: {
    organization_id: string;
    project_id: string;
  }): Promise<string> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-organization-id": organization_id,
        "x-jwt-project-id": project_id,
      });
      await adminApiClient.mutation([
        "deleteProject",
        {
          _dummy: "",
        },
      ]);
      return "Project deleted successfully";
    } catch (error) {
      throw new Error(`Failed to delete project: ${JSON.stringify(error)}`);
    }
  }

  async updateApplicationName({
    organization_id,
    application_id,
    project_id,
    new_application_name,
  }: {
    organization_id: string;
    application_id: string;
    project_id: string;
    new_application_name: string;
  }): Promise<string> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-organization-id": organization_id,
        "x-jwt-project-id": project_id,
        "x-jwt-application-id": application_id,
      });
      await adminApiClient.mutation([
        "setApplicationNameV2",
        {
          new_application_name: new_application_name,
        },
      ]);
      return "Application name updated successfully";
    } catch (error) {
      throw new Error(
        `Failed to update application name: ${JSON.stringify(error)}`,
      );
    }
  }

  protected createApiClient(additionalHeaders: Record<string, string> = {}) {
    return createAdminApiClient({
      apiUrl: this.adminUrl,
      customFetch: this.createCustomFetch(additionalHeaders),
    });
  }

  private createCustomFetch = (
    additionalHeaders: Record<string, string> = {},
  ) => {
    return async (
      input: Request | string | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const headers = new Headers(init?.headers);

      const bearerToken = process.env.APTOS_BOT_KEY;

      headers.set("Authorization", `Bearer ${bearerToken}`);
      headers.set("x-is-aptos-bot", "true");

      Object.entries(additionalHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      return fetch(input, {
        ...init,
        headers,
      });
    };
  };
}
