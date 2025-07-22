import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const GA_CLIENT_ID = process.env.GA_CLIENT_ID;

if (!GA_CLIENT_ID) {
  console.error("GA_CLIENT_ID is not defined in your .env file!");
  process.exit(1);
}

const targetFile = path.join(__dirname, "../src/config.ts");
let content = fs.readFileSync(targetFile, "utf8");

// Replace process.env.GA_CLIENT_ID with the actual value as a string literal
const injectedContent = content.replace(
  /const GA_CLIENT_ID = process\.env\.GA_CLIENT_ID;/,
  `const GA_CLIENT_ID = "${GA_CLIENT_ID}";`
);

fs.writeFileSync(targetFile, injectedContent, "utf8");
console.log("✅ Injected GA_CLIENT_ID into", targetFile);
