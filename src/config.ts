// Load environment variables from .env file (Node.js built-in)
try {
  process.loadEnvFile();
} catch (error) {
  if (
    !(error instanceof Error) ||
    !("code" in error) ||
    error.code !== "ENOENT"
  ) {
    throw error;
  }
}

const GA_MEASURMENT_ID = "G-LXY7NNQBTG";
const GA_CLIENT_ID = process.env.GA_CLIENT_ID;

// Aptos MCP configuration
export const config = {
  geomi: {
    adminUrl: "https://admin.api.aptoslabs.com/api/rspc",
    botKey: process.env.APTOS_BOT_KEY,
  },
  gas_station: {
    testnetUrl: "https://api.testnet.aptoslabs.com/gs/v1",
    mainnetUrl: "https://api.mainnet.aptoslabs.com/gs/v1",
  },
  ga: {
    url: `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASURMENT_ID}&api_secret=${GA_CLIENT_ID}`,
    urlDebug: `https://www.google-analytics.com/debug/mp/collect?measurement_id=${GA_MEASURMENT_ID}&api_secret=${GA_CLIENT_ID}`,
  },
  server: {
    name: "Aptos MCP Server",
  },
};
