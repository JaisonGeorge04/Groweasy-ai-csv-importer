import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { storageDirectory, uploadDirectory } from "../utils/path.js";
import type { UploadedFilePayload } from "../types/import.js";
import { AppError } from "../utils/errors.js";

export async function ensureStorageDirectories() {
  await fs.mkdir(storageDirectory, { recursive: true });
  await fs.mkdir(uploadDirectory, { recursive: true });
  await fs.mkdir(path.join(uploadDirectory, "incoming"), { recursive: true });
}

export async function saveUploadedPayload(payload: Omit<UploadedFilePayload, "fileId">) {
  const fileId = crypto.randomUUID();
  const filePath = path.join(uploadDirectory, `${fileId}.json`);

  await fs.writeFile(filePath, JSON.stringify({ ...payload, fileId }, null, 2), "utf8");

  return {
    fileId,
    filePath,
  };
}

export async function readUploadedPayload(fileId: string) {
  const filePath = path.join(uploadDirectory, `${fileId}.json`);

  try {
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file) as UploadedFilePayload;
  } catch {
    throw new AppError("The requested upload session could not be found.", 404);
  }
}
