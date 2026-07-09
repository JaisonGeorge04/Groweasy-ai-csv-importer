"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { parse } from "papaparse";
import { UploadCloud } from "lucide-react";
import { Header } from "@/components/header";
import { ImportSummary } from "@/components/import-summary";
import { PreviewTable } from "@/components/preview-table";
import { UploadPanel } from "@/components/upload-panel";
import { uploadCsvFile, processImport } from "@/lib/api";
import type {
  CsvPreviewRow,
  UploadResponse,
} from "@/lib/types";

const ACCEPTED_TYPES = [".csv", "text/csv", "application/vnd.ms-excel"];

export default function Home() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<CsvPreviewRow[]>([]);
  const [uploadState, setUploadState] = useState<{
    status: "idle" | "parsing" | "uploading" | "uploaded" | "processing" | "done" | "error";
    progress: number;
    message?: string;
  }>({ status: "idle", progress: 0 });
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);

  const previewColumns = useMemo(
    () => Array.from(new Set(previewRows.flatMap((row) => Object.keys(row)))),
    [previewRows],
  );

  async function handleFileSelection(file: File) {
    if (!isCsvFile(file)) {
      setUploadState({
        status: "error",
        progress: 0,
        message: "Please upload a valid CSV file.",
      });
      return;
    }

    setSelectedFile(file);
    setUploadResponse(null);
    setUploadState({ status: "parsing", progress: 10, message: "Parsing CSV preview..." });

    parse<CsvPreviewRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data, errors }) => {
        if (errors.length > 0) {
          setUploadState({
            status: "error",
            progress: 0,
            message: errors[0]?.message ?? "Unable to parse the selected CSV.",
          });
          return;
        }

        // Keep the preview intentionally small so large CSV files stay responsive in the browser.
        const trimmedPreview = data.filter(hasRowValues).slice(0, 8);
        setPreviewRows(trimmedPreview);
        setUploadState({
          status: "uploading",
          progress: 15,
          message: "Uploading file to secure processing storage...",
        });

        try {
          const response = await uploadCsvFile(file, (progress) =>
            setUploadState({
              status: "uploading",
              progress,
              message: `Uploading file... ${progress}%`,
            }),
          );

          setUploadResponse(response);
          setUploadState({
            status: "uploaded",
            progress: 100,
            message: "Preview ready. Review the data and confirm import when you are ready.",
          });
        } catch (error) {
          setUploadState({
            status: "error",
            progress: 0,
            message:
              error instanceof Error
                ? error.message
                : "The file upload failed. Please try again.",
          });
        }
      },
      error: (error) => {
        setUploadState({
          status: "error",
          progress: 0,
          message: error.message,
        });
      },
    });
  }

  async function handleConfirmImport() {
    if (!uploadResponse) {
      return;
    }

    setUploadState({
      status: "processing",
      progress: 100,
      message: "Running AI enrichment and record validation...",
    });

    try {
      const result = await processImport(uploadResponse.fileId);
      sessionStorage.setItem("groweasy:last-import", JSON.stringify(result));
      setUploadState({
        status: "done",
        progress: 100,
        message: "Import completed successfully.",
      });
      router.push("/results");
    } catch (error) {
      setUploadState({
        status: "error",
        progress: 100,
        message:
          error instanceof Error
            ? error.message
            : "Processing failed. Please try again.",
      });
    }
  }

  function resetImporter() {
    setSelectedFile(null);
    setPreviewRows([]);
    setUploadResponse(null);
    setUploadState({ status: "idle", progress: 0 });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.24),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.16),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ecfeff_46%,_#f5f3ff_100%)] text-slate-900 transition-colors dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.35),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(21,128,61,0.20),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)] dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Header />

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
            <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-cyan-900 uppercase dark:bg-cyan-950/70 dark:text-cyan-200">
                <UploadCloud className="h-4 w-4" />
                GrowEasy Import Pipeline
              </span>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  AI-powered CSV importing with preview, validation, and CRM-ready output.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  Upload your lead sheet, review the parsed preview on the client, and only
                  trigger Gemini processing after you confirm the import.
                </p>
              </div>
            </div>

            <UploadPanel
              acceptedTypes={ACCEPTED_TYPES}
              fileName={selectedFile?.name}
              uploadState={uploadState}
              uploadResponse={uploadResponse}
              onFileSelected={handleFileSelection}
              onConfirmImport={handleConfirmImport}
              onReset={resetImporter}
            />
          </div>

          <ImportSummary uploadResponse={uploadResponse} uploadState={uploadState} />
        </section>

        <PreviewTable rows={previewRows} columns={previewColumns} />
      </div>
    </main>
  );
}

function hasRowValues(row: CsvPreviewRow) {
  return Object.values(row).some((value) => String(value ?? "").trim().length > 0);
}

function isCsvFile(file: File) {
  return ACCEPTED_TYPES.some((type) => file.type === type || file.name.endsWith(type));
}
