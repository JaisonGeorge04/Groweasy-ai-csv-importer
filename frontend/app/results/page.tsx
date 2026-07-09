"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, CircleSlash2, TableProperties } from "lucide-react";
import { ResultsTable } from "@/components/results-table";
import type { ImportResult } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ImportResult | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("groweasy:last-import");

    if (!storedResult) {
      router.replace("/");
      return;
    }

    try {
      setResult(JSON.parse(storedResult) as ImportResult);
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        Loading import results...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#020617_0%,_#0f172a_50%,_#111827_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
                Import Complete
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                CRM import results
              </h1>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Import another file
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Imported count"
              value={String(result.importedCount)}
              icon={<CheckCircle2 className="h-5 w-5 text-emerald-300" />}
            />
            <StatCard
              label="Skipped count"
              value={String(result.skippedCount)}
              icon={<CircleSlash2 className="h-5 w-5 text-amber-300" />}
            />
            <StatCard
              label="Final records"
              value={String(result.records.length)}
              icon={<TableProperties className="h-5 w-5 text-cyan-300" />}
            />
          </div>
        </div>

        <ResultsTable rows={result.records} />
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        {icon}
      </div>
      <p className="mt-4 text-4xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
