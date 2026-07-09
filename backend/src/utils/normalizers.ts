import { ALLOWED_CRM_STATUSES, ALLOWED_DATA_SOURCES, CRM_FIELDS } from "../constants/import.js";
import type { CrmRecord, CsvRecord, GeminiBatchRecord } from "../types/import.js";

export function sanitizeCsvRecord(record: CsvRecord) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key.trim(),
      String(value ?? "").trim(),
    ]),
  );
}

export function hasContactInformation(record: Partial<CrmRecord>) {
  return Boolean(
    record.email?.trim() ||
    record.mobile_without_country_code?.trim(),
  );
}

export function validateCrmRecord(
  record: GeminiBatchRecord,
): record is GeminiBatchRecord & CrmRecord {

  // All CRM fields must exist as strings
  const hasRequiredFields = CRM_FIELDS.every(
    (field) => typeof record[field] === "string",
  );

  if (!hasRequiredFields) {
    return false;
  }

  // Must have email or mobile
  if (!hasContactInformation(record)) {
    return false;
  }

  // crm_status must be valid
  if (
    record.crm_status &&
    !ALLOWED_CRM_STATUSES.includes(record.crm_status)
  ) {
    return false;
  }

  // data_source is OPTIONAL
  // Only validate it if Gemini filled it
  if (
    record.data_source &&
    !ALLOWED_DATA_SOURCES.includes(record.data_source)
  ) {
    return false;
  }

  return true;
}