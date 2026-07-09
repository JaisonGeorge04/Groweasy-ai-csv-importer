import axios from "axios";
import type { ImportResult, UploadResponse } from "@/lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function uploadCsvFile(
  file: File,
  onProgress?: (progress: number) => void,
) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<UploadResponse>(`${API_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (!event.total || !onProgress) {
        return;
      }

      onProgress(Math.round((event.loaded * 100) / event.total));
    },
  });

  return response.data;
}

export async function processImport(fileId: string) {
  const response = await axios.post<ImportResult>(`${API_URL}/process`, { fileId });
  return response.data;
}
