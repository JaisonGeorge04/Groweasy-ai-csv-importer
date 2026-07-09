import fs from "node:fs";
import csv from "csv-parser";
import { AppError } from "../utils/errors.js";
import { sanitizeCsvRecord } from "../utils/normalizers.js";
import type { CsvRecord } from "../types/import.js";

export async function parseCsvFile(filePath: string) {
  return new Promise<{ columns: string[]; records: CsvRecord[] }>((resolve, reject) => {
    const records: CsvRecord[] = [];
    let columns: string[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (headers: string[]) => {
        columns = headers.map((header) => header.trim());
      })
      .on("data", (row: CsvRecord) => {
        records.push(sanitizeCsvRecord(row));
      })
      .on("end", () => {
        if (records.length === 0) {
          reject(new AppError("The uploaded CSV is empty.", 400));
          return;
        }

        resolve({ columns, records });
      })
      .on("error", (error) => reject(new AppError(error.message, 400)));
  });
}
