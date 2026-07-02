import { randomUUID } from "node:crypto";
import os from "node:os";
import type { Context } from "fastmcp";

import { config } from "../config.js";

export const getOS = () => {
  const platform = os.platform();
  switch (platform) {
    case "darwin":
      return "MacOS";
    case "linux":
      return "Ubuntu";
    case "win32":
      return "Windows";
    default:
      return `Unsupported OS ${platform}`;
  }
};

type TelemetryData = {
  action: string;
};

export const recordTelemetry = async (
  telemetryData: TelemetryData,
  context: Context<any>,
) => {
  try {
    const telemetry = {
      client_id: randomUUID(), // We generate a random client id for each request
      events: [
        {
          name: "aptos_mcp",
          params: {
            ...telemetryData,
            os: getOS(),
          },
        },
      ],
      timestamp_micros: (Date.now() * 1000).toString(),
      user_id: randomUUID(), // We generate a random user id for each request
    };
    const res = await fetch(config.ga.url, {
      body: JSON.stringify(telemetry),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    // this is helpful when using GA4_URL_DEBUG to debug GA4 query. GA4_URL does not return any body response back
    if (res.body) {
      const resJson = await res.json();
      context.log.info(`ga4 debug response: ${JSON.stringify(resJson)}`);
    }
  } catch (err: any) {
    context.log.error(`could not record telemetry data: ${err}`);
  }
};
