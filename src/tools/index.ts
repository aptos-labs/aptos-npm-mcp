import { FastMCP } from "fastmcp";

import { registerGeomiTools } from "./geomi/index.js";

export function registerTools(server: FastMCP): void {
  registerGeomiTools(server);
}
