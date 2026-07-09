import fs from "node:fs/promises";
import type { Request, Response } from "express";
import { parseCsvFile } from "../services/csv.service.js";
import { processImportedRecords } from "../services/import.service.js";
import { readUploadedPayload, saveUploadedPayload } from "../services/storage.service.js";
import { AppError } from "../utils/errors.js";

export async function uploadCsvController(request: Request, response: Response) {
  if (!request.file) {
    throw new AppError("A CSV file is required.", 400);
  }

  const { columns, records } = await parseCsvFile(request.file.path);
  const savedPayload = await saveUploadedPayload({
    columns,
    totalRecords: records.length,
    records,
  });

  await fs.unlink(request.file.path).catch(() => undefined);

  response.status(201).json({
    fileId: savedPayload.fileId,
    totalRecords: records.length,
    columns,
  });
}

export async function processCsvController(request: Request, response: Response) {
  const { fileId } = request.body as { fileId?: string };

  if (!fileId) {
    throw new AppError("fileId is required.", 400);
  }

  const uploadedPayload = await readUploadedPayload(fileId);
  const result = await processImportedRecords(uploadedPayload.records);

  response.status(200).json(result);
}
