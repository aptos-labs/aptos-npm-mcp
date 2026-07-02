import * as fs from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, dirname, extname, join as pathJoin } from "node:path";
import { fileURLToPath } from "node:url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resourcesDir = pathJoin(__dirname, "..", "resources");

// Dynamic discovery
export const getAvailableHowToResources = () => {
  try {
    const howToDir = pathJoin(resourcesDir, "how_to");
    const files = fs.readdirSync(howToDir);
    return files
      .filter((file) => extname(file).toLowerCase() === ".md")
      .map((file) => basename(file, extname(file)));
  } catch (err) {
    console.error(`Error reading how_to directory: ${err}`);
    return [];
  }
};

/**
 * Helper function to read all markdown files from multiple directories
 */
export async function readAllMarkdownFromDirectories(
  dirNames: string[],
): Promise<string> {
  let combinedContent = "";

  for (const dirName of dirNames) {
    const dirPath = pathJoin(resourcesDir, dirName);
    const dirContent = await readAllMarkdownFromDirectory(dirPath);
    if (dirContent.trim()) {
      combinedContent += `# ${dirName.toUpperCase()} RESOURCES\n\n`;
      combinedContent += dirContent;
    }
  }

  return combinedContent;
}

/**
 * Helper function to read all markdown files from a directory
 */
export async function readAllMarkdownFromDirectory(
  dirPath: string,
): Promise<string> {
  let content = "";

  try {
    if (!fs.existsSync(dirPath)) {
      return `Directory not found: ${dirPath}`;
    }

    const files = fs.readdirSync(dirPath);
    const markdownFiles = files.filter(
      (file: string) => extname(file).toLowerCase() === ".md",
    );

    for (const file of markdownFiles) {
      const filePath = pathJoin(dirPath, file);
      try {
        const fileContent = await readFile(filePath, "utf-8");
        content += `${fileContent}\n\n---\n\n`;
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        content += `Error reading file: ${file}\n\n---\n\n`;
      }
    }

    return content;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return `Error reading directory: ${dirPath}`;
  }
}

/**
 * Helper function to read a specific markdown file from a directory
 */
export async function readMarkdownFromDirectory(
  dirName: string,
  fileName: string,
): Promise<string> {
  try {
    const dirPath = pathJoin(resourcesDir, dirName);
    if (!fs.existsSync(dirPath)) {
      return `Directory not found: ${dirPath}`;
    }

    // Ensure the fileName has .md extension
    const markdownFileName = fileName.endsWith(".md")
      ? fileName
      : `${fileName}.md`;
    const filePath = pathJoin(dirPath, markdownFileName);

    if (!fs.existsSync(filePath)) {
      return `File not found: ${markdownFileName} in ${dirPath}`;
    }

    // Check if it's actually a markdown file
    if (extname(markdownFileName).toLowerCase() !== ".md") {
      return `File is not a markdown file: ${markdownFileName}`;
    }

    const fileContent = await readFile(filePath, "utf-8");
    return fileContent;
  } catch (error) {
    console.error(`Error reading file ${fileName} from ${dirName}:`, error);
    return `Error reading file: ${fileName}`;
  }
}
