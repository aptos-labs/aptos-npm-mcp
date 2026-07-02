import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.join(__dirname, "../src/config.ts");
const content = fs.readFileSync(targetFile, "utf8");

// Replace any string-assigned GA_CLIENT_ID back to process.env.GA_CLIENT_ID
const restoredContent = content.replace(
  /const GA_CLIENT_ID = ".*?";/,
  "const GA_CLIENT_ID = process.env.GA_CLIENT_ID;",
);

fs.writeFileSync(targetFile, restoredContent, "utf8");
console.log(
  "✅ Restored GA_CLIENT_ID to process.env.GA_CLIENT_ID in",
  targetFile,
);
