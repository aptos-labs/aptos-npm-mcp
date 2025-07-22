import {
  ApiKey,
  Application,
  createAdminApiClient,
  CreateApiKeyFrontendArgs,
  CreateApplicationArgs,
  Organization,
  Project,
  RecursiveOrgData,
} from "@aptos-labs/api-gateway-admin-api-client";
import { config } from "../config.js";
import { Context } from "fastmcp";

export class AptosBuild {
  private readonly adminUrl: string;
  protected readonly headers: Record<string, string>;

  constructor() {
    if (!config.aptos_build.botKey) {
      throw new Error(
        `APTOS_BOT_KEY is not set. To generate a Bot Key: 
        1. Go to [https://build.aptoslabs.com/](https://build.aptoslabs.com/)
        2. Click on your name in the bottom left corner
        3. Click on "Bot Keys"
        4. Click on the "Create Bot Key" button
        5. Copy the Bot Key and paste it into the MCP configuration file as an env arg: APTOS_BOT_KEY=<your-bot-key>`
      );
    }
    this.adminUrl = config.aptos_build.adminUrl;
    this.headers = {
      Authorization: `Bearer ${config.aptos_build.botKey}`,
      "x-is-aptos-bot": "true",
    };
  }

  private createCustomFetch = (
    additionalHeaders: Record<string, string> = {}
  ) => {
    return async (
      input: string | URL | Request,
      init?: RequestInit
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

  protected createApiClient(additionalHeaders: Record<string, string> = {}) {
    return createAdminApiClient({
      apiUrl: this.adminUrl,
      customFetch: this.createCustomFetch(additionalHeaders),
    });
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
      throw new Error(`Failed to get organizations: ${String(error)}`);
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
      throw new Error(`Failed to create organization: ${String(error)}`);
    }
  }

  /**
   * Create a new Project for an Organization.
   * @returns Project
   */
  async createProject({
    organization_id,
    project_name,
    description,
  }: {
    organization_id: string;
    project_name: string;
    description: string;
  }): Promise<Project> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-organization-id": organization_id,
      });
      const project = await adminApiClient.mutation([
        "createProject",
        {
          project_name,
          description,
        },
      ]);
      return project;
    } catch (error) {
      throw new Error(`Failed to create project: ${String(error)}`);
    }
  }

  /**
   * Create a new Application for a project.
   * Application can be of type Full Node API, Gas Station.
   * @returns Application
   */
  async createApplication({
    organization_id,
    project_id,
    args,
  }: {
    organization_id: string;
    project_id: string;
    args: CreateApplicationArgs;
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
      throw new Error(`Failed to create application: ${String(error)}`);
    }
  }

  /**
   * Create a new API Key for an application.
   * @returns ApiKey
   */
  async createApiKey({
    organization_id,
    project_id,
    application_id,
    name,
    frontend_args,
  }: {
    organization_id: string;
    project_id: string;
    application_id: string;
    name: string;
    frontend_args: CreateApiKeyFrontendArgs | null;
  }): Promise<ApiKey> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-organization-id": organization_id,
        "x-jwt-project-id": project_id,
        "x-jwt-application-id": application_id,
      });
      const apiKey = await adminApiClient.mutation([
        "createApiKeyV2",
        {
          name,
          frontend_args,
        },
      ]);
      return apiKey;
    } catch (error) {
      throw new Error(`Failed to create api key: ${String(error)}`);
    }
  }

  async deleteApiKey({
    organization_id,
    project_id,
    application_id,
    api_key_name,
    context,
  }: {
    organization_id: string;
    project_id: string;
    application_id: string;
    api_key_name: string;
    context: Context<any>;
  }): Promise<void> {
    try {
      const adminApiClient = this.createApiClient({
        "x-jwt-organization-id": organization_id,
        "x-jwt-project-id": project_id,
        "x-jwt-application-id": application_id,
      });
      await adminApiClient.mutation([
        "deleteApiKeyV2",
        {
          name: api_key_name,
        },
      ]);
    } catch (error) {
      context.log.error(`Failed to delete api key: ${JSON.stringify(error)}`);

      throw new Error(`Failed to delete api key: ${error}`);
    }
  }
}
