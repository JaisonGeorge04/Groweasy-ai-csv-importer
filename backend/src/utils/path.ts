import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

export const projectRoot = path.resolve(currentDirectory, "../..");
export const storageDirectory = path.join(projectRoot, "storage");
export const uploadDirectory = path.join(storageDirectory, "uploads");
