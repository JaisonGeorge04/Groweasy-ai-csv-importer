"use client";

import { useRef, useState, type DragEvent } from "react";
import { CheckCircle2, LoaderCircle, RotateCcw, Upload } from "lucide-react";
import { ProgressBar } from "@/components/progress-bar";
import type { UploadResponse } from "@/lib/types";

export function UploadPanel({
  acceptedTypes,
  fileName,
  uploadState,
  uploadResponse,
  onFileSelected,
  onConfirmImport,
  onReset,
}: {
  acceptedTypes: string[];
  fileName?: string;
  uploadState: { status: string; progress: number; message?: string };
  uploadResponse: UploadResponse | null;
  onFileSelected: (file: File) => void;
  onConfirmImport: () => void;
  onReset: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];

    if (file) {
      onFileSelected(file);
    }
  }

  return (
    <div className="mt-6 space-y-5">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-[2rem] border border-dashed p-6 transition ${
          isDragging
            ? "border-cyan-500 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-950/30"
            : "border-slate-300 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/40"
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950">
            <Upload className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Drag and drop your CSV file</h3>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Or use the file picker to stage a dataset for import. AI processing only
              starts after confirmation.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
            >
              Choose CSV file
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950 dark:border-slate-700 dark:text-slate-200 dark:hover:border-cyan-300 dark:hover:text-cyan-300"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={acceptedTypes.join(",")}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onFileSelected(file);
              }
            }}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50/90 p-5 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Selected file
            </p>
            <p className="text-base font-semibold">{fileName ?? "No file selected yet"}</p>
          </div>
          {uploadResponse ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-emerald-700 uppercase dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Uploaded
            </div>
          ) : null}
        </div>

        <ProgressBar value={uploadState.progress} />
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          {uploadState.message ?? "Waiting for a CSV file."}
        </p>

        <button
          type="button"
          disabled={!uploadResponse || uploadState.status === "processing"}
          onClick={onConfirmImport}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
        >
          {uploadState.status === "processing" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : null}
          Confirm Import
        </button>
      </div>
    </div>
  );
}
