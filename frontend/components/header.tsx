"use client";

import { DatabaseZap } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300 dark:bg-cyan-400 dark:text-slate-950">
          <DatabaseZap className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            GrowEasy Assignment
          </p>
          <h2 className="text-xl font-semibold tracking-tight">AI CSV Importer</h2>
        </div>
      </div>

      <ThemeToggle />
    </header>
  );
}
