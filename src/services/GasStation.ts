import type { Context } from "fastmcp";
import { config } from "../config.js";

export class GasStation {
  protected readonly headers: Record<string, string>;
  private readonly gasStationEndpoint: string;

  constructor(_context: Context<any>, network: "testnet" | "mainnet") {
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
    this.gasStationEndpoint =
      network === "testnet"
        ? config.gas_station.testnetUrl
        : config.gas_station.mainnetUrl;
    this.headers = {
      Authorization: `Bearer ${config.geomi.botKey}`,
      "x-is-aptos-bot": "true",
      "Content-Type": "application/json",
    };
  }

  async createGasStation({
    organization_id,
    project_id,
    application_id,
  }: {
    organization_id: string;
    project_id: string;
    application_id: string;
  }) {
    try {
      const appHeaders = {
        "x-jwt-organization-id": organization_id,
        "x-jwt-project-id": project_id,
        "x-jwt-application-id": application_id,
      };

      const gasStationResponse = await fetch(
        `${this.gasStationEndpoint}/admin/application`,
        {
          method: "POST",
          headers: this.createGasStationClientHeaders(appHeaders),
          body: JSON.stringify({}),
        },
      );

      if (!gasStationResponse.ok) {
        const errorText = await gasStationResponse.text();
        throw new Error(
          `Gas station API failed with status ${gasStationResponse.status}: ${errorText}`,
        );
      }

      const gasStation = await gasStationResponse.json();
      return gasStation;
    } catch (error) {
      throw new Error(`Failed to create gas station: ${JSON.stringify(error)}`);
    }
  }

  async createGasStationRules({
    organization_id,
    project_id,
    application_id,
    functions,
  }: {
    organization_id: string;
    project_id: string;
    application_id: string;
    functions: string[];
  }) {
    try {
      // Create the gas station
      const appHeaders = {
        "x-jwt-organization-id": organization_id,
        "x-jwt-project-id": project_id,
        "x-jwt-application-id": application_id,
      };
      // Create the gas station rules
      const gasStationRulesResponse = await Promise.all(
        functions.map(async (contractFunction) => {
          const [moduleAddress, moduleName, functionName] =
            contractFunction.split("::");
          if (!moduleAddress || !moduleName || !functionName) {
            throw new Error(`Invalid contract function: ${contractFunction}`);
          }

          return fetch(`${this.gasStationEndpoint}/admin/rule`, {
            method: "POST",
            headers: this.createGasStationClientHeaders(appHeaders),
            body: JSON.stringify({
              id: {
                functionPackage: moduleAddress,
                functionModule: moduleName,
                functionName: functionName,
              },
              // TODO: support costum user values
              config: {
                gasUnitPriceMax: "350",
                gasUnitPriceMin: "100",
                maxGasAmountMax: "250_000",
                maxGasAmountMin: "3",
                skipSimulation: false,
                txExpiryDurationSecs: 120,
                windowDurationSecs: null,
                windowGasLimit: null,
              },
            }),
          });
        }),
      );

      const gasStationRules = await Promise.all(
        gasStationRulesResponse.map(async (rule) => {
          return await rule.json();
        }),
      );

      return gasStationRules;
    } catch (error) {
      throw new Error(
        `Failed to create gas station rules: ${JSON.stringify(error)}`,
      );
    }
  }

  protected createGasStationClientHeaders(
    additionalHeaders: Record<string, string> = {},
  ) {
    const headers = new Headers(this.headers);

    Object.entries(additionalHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    return headers;
  }
}
