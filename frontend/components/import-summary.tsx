import { BarChart3, BrainCircuit, FileSpreadsheet } from "lucide-react";
import type { UploadResponse } from "@/lib/types";

export function ImportSummary({
  uploadResponse,
  uploadState,
}: {
  uploadResponse: UploadResponse | null;
  uploadState: { status: string; progress: number; message?: string };
}) {
  const cards = [
    {
      label: "Rows detected",
      value: uploadResponse ? String(uploadResponse.totalRecords) : "--",
      icon: <FileSpreadsheet className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />,
      helper: "Parsed on upload with secure server-side staging.",
    },
    {
      label: "Columns detected",
      value: uploadResponse ? String(uploadResponse.columns.length) : "--",
      icon: <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />,
      helper: "Useful for catching malformed headers before importing.",
    },
    {
      label: "Pipeline state",
      value: uploadState.status.toUpperCase(),
      icon: <BrainCircuit className="h-5 w-5 text-amber-600 dark:text-amber-300" />,
      helper: uploadState.message ?? "Select a CSV file to begin.",
    },
  ];

  return (
    <aside className="grid gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[2rem] border border-white/50 bg-white/75 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/65"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
            {card.icon}
          </div>
          <p className="mt-4 text-4xl font-semibold tracking-tight">{card.value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {card.helper}
          </p>
        </div>
      ))}
    </aside>
  );
}
