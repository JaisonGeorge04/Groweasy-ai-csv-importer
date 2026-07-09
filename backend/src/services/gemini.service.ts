import axios from "axios";
import { env } from "../config/env.js";
import { extractJsonArray } from "../utils/json.js";
import { AppError } from "../utils/errors.js";
import type { CsvRecord, GeminiBatchRecord } from "../types/import.js";

export async function enrichBatchWithGemini(records: CsvRecord[]) {
  if (!env.geminiApiKey) {
    throw new AppError("GEMINI_API_KEY is missing from the backend environment.", 500);
  }

  // We include source_index so each AI record can be matched back to its original row safely.
  const prompt = `
You are a CRM data extraction service.
Transform each CSV row into a JSON object with these exact fields:
created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note, data_source, possession_time, description.

Rules:
- Return only a JSON array and no extra text.
- Include source_index for each item so records can be mapped back safely.
- Skip records that have neither email nor mobile by returning an object with source_index and skip_reason.
- crm_status must be one of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE.
- data_source must be one of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots.
- Use empty strings for missing non-enum fields.
- Never invent email or mobile values.

Input rows:
${JSON.stringify(records.map((record, index) => ({ source_index: index, ...record })))}
  `.trim();

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 60000,
    },
  );

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new AppError("Gemini returned an empty response.", 502);
  }

  return JSON.parse(extractJsonArray(text)) as GeminiBatchRecord[];
}
