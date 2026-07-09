import type { CrmRecord } from "@/lib/types";

const TABLE_COLUMNS: Array<keyof CrmRecord> = [
  "created_at",
  "name",
  "email",
  "country_code",
  "mobile_without_country_code",
  "company",
  "city",
  "state",
  "country",
  "lead_owner",
  "crm_status",
  "crm_note",
  "data_source",
  "possession_time",
  "description",
];

export function ResultsTable({ rows }: { rows: CrmRecord[] }) {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.45)]">
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Final CRM table</h2>
        <p className="text-sm leading-6 text-slate-400">
          Valid records returned by the AI validation pipeline are shown below.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800">
        <div className="max-h-[34rem] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-900 text-slate-100">
              <tr>
                {TABLE_COLUMNS.map((column) => (
                  <th key={column} className="px-4 py-3 font-medium whitespace-nowrap">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((row, index) => (
                <tr key={`${row.email}-${row.mobile_without_country_code}-${index}`}>
                  {TABLE_COLUMNS.map((column) => (
                    <td
                      key={`${index}-${column}`}
                      className="max-w-[16rem] px-4 py-3 align-top text-slate-300"
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {row[column] || "-"}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
