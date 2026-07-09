import type { CsvPreviewRow } from "@/lib/types";

export function PreviewTable({
  rows,
  columns,
}: {
  rows: CsvPreviewRow[];
  columns: string[];
}) {
  return (
    <section className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        <h2 className="text-2xl font-semibold tracking-tight">CSV preview</h2>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          The table is parsed entirely on the frontend first, so users can validate the
          structure before confirming the import.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Upload a CSV file to see a sticky-header preview here.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="max-h-[28rem] overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-950 text-slate-100">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="px-4 py-3 font-medium whitespace-nowrap">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950/60">
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="align-top">
                    {columns.map((column) => (
                      <td
                        key={`${rowIndex}-${column}`}
                        className="max-w-[18rem] px-4 py-3 text-slate-700 dark:text-slate-200"
                      >
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {String(row[column] ?? "")}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
