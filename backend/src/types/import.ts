import type {
  ALLOWED_CRM_STATUSES,
  ALLOWED_DATA_SOURCES,
  CRM_FIELDS,
} from "../constants/import.js";

export type CsvRecord = Record<string, string>;

export type CrmStatus = (typeof ALLOWED_CRM_STATUSES)[number];
export type DataSource = (typeof ALLOWED_DATA_SOURCES)[number];
export type CrmField = (typeof CRM_FIELDS)[number];

export interface CrmRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: CrmStatus;
  crm_note: string;
  data_source: DataSource;
  possession_time: string;
  description: string;
}

export interface UploadedFilePayload {
  fileId: string;
  columns: string[];
  totalRecords: number;
  records: CsvRecord[];
}

export interface ProcessResult {
  importedCount: number;
  skippedCount: number;
  records: CrmRecord[];
}

export interface GeminiBatchRecord extends Partial<CrmRecord> {
  source_index: number;
  skip_reason?: string;
}
