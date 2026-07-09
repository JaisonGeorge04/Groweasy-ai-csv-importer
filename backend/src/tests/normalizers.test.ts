import test from "node:test";
import assert from "node:assert/strict";
import {
  hasContactInformation,
  sanitizeCsvRecord,
  validateCrmRecord,
} from "../utils/normalizers.js";

test("sanitizeCsvRecord trims keys and values", () => {
  const normalized = sanitizeCsvRecord({ " Email ": " test@example.com " });
  assert.equal(normalized.Email, "test@example.com");
});

test("hasContactInformation detects email or phone presence", () => {
  assert.equal(hasContactInformation({ email: "lead@example.com" }), true);
  assert.equal(hasContactInformation({ mobile_without_country_code: "9876543210" }), true);
  assert.equal(hasContactInformation({ email: "", mobile_without_country_code: "" }), false);
});

test("validateCrmRecord allows only whitelisted enums and contactable leads", () => {
  assert.equal(
    validateCrmRecord({
      source_index: 0,
      created_at: "2026-07-07",
      name: "Test Lead",
      email: "lead@example.com",
      country_code: "+91",
      mobile_without_country_code: "",
      company: "GrowEasy",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      lead_owner: "Sales Team",
      crm_status: "GOOD_LEAD_FOLLOW_UP",
      crm_note: "Interested",
      data_source: "eden_park",
      possession_time: "Q4 2026",
      description: "Validated by test",
    }),
    true,
  );
});
