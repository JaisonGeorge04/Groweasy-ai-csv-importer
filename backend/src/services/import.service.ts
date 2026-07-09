import { env } from "../config/env.js";
import { enrichBatchWithGemini } from "./gemini.service.js";
import { validateCrmRecord } from "../utils/normalizers.js";
import type { CsvRecord, ProcessResult } from "../types/import.js";

export async function processImportedRecords(
  records: CsvRecord[],
): Promise<ProcessResult> {
  const validRecords: ProcessResult["records"] = [];
  let skippedCount = 0;

  for (let index = 0; index < records.length; index += env.batchSize) {
    const batch = records.slice(index, index + env.batchSize);

    try {
      const aiBatch = await enrichBatchWithGemini(batch);

      const sourceIndexMap = new Map(
        aiBatch.map((record) => [record.source_index, record]),
      );

      batch.forEach((_, batchIndex) => {
        const aiRecord = sourceIndexMap.get(batchIndex);

        if (!aiRecord) {
          skippedCount++;
          return;
        }

        if (!validateCrmRecord(aiRecord)) {
          skippedCount++;
          return;
        }

        validRecords.push({
          created_at: aiRecord.created_at,
          name: aiRecord.name,
          email: aiRecord.email,
          country_code: aiRecord.country_code,
          mobile_without_country_code:
            aiRecord.mobile_without_country_code,
          company: aiRecord.company,
          city: aiRecord.city,
          state: aiRecord.state,
          country: aiRecord.country,
          lead_owner: aiRecord.lead_owner,
          crm_status: aiRecord.crm_status,
          crm_note: aiRecord.crm_note,
          data_source: aiRecord.data_source,
          possession_time: aiRecord.possession_time,
          description: aiRecord.description,
        });
      });
    } catch (error) {
      console.error("Gemini processing failed:", error);
      skippedCount += batch.length;
    }
  }

  return {
    importedCount: validRecords.length,
    skippedCount,
    records: validRecords,
  };
}