import type { ScanResult, HistoryScan } from "./types";

// On Vercel, API functions live at /api/* relative to the same origin.
// During local dev with `vercel dev`, the same relative paths work.
// VITE_API_BASE_URL can be set for backward compat with the old Python backend.
const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ?? "";

/**
 * Send a food image to the backend for AI analysis.
 * Returns the full scan result including detected foods and nutrition totals.
 */
export async function analyzeImage(file: File): Promise<ScanResult> {
  const formData = new FormData();
  formData.append("file", file);

  const endpoint = `${API_BASE}/api/analyze`;
  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body.detail ?? body.error ?? JSON.stringify(body);
    } catch {
      detail = res.statusText;
    }

    if (res.status === 404 && !API_BASE && import.meta.env.DEV) {
      throw new Error(
        "Endpoint /api/analyze tidak ditemukan. Jalankan app dengan `npm run dev` (Vercel dev), atau set `VITE_API_BASE_URL` ke backend yang aktif.",
      );
    }

    throw new Error(`Analisis gagal (${res.status}): ${detail}`);
  }

  return res.json() as Promise<ScanResult>;
}

/** Fetch the last 50 scan results for the history page. */
export async function fetchHistory(): Promise<HistoryScan[]> {
  const res = await fetch(`${API_BASE}/api/history`);
  if (!res.ok) throw new Error(`Gagal mengambil riwayat (${res.status})`);
  const data = await res.json();
  return data.results as HistoryScan[];
}

/** Fetch a single scan result by ID for the detail page. */
export async function fetchHistoryDetail(id: number | string): Promise<HistoryScan> {
  const res = await fetch(`${API_BASE}/api/history/${id}`);
  if (!res.ok) throw new Error(`Scan tidak ditemukan (${res.status})`);
  return res.json() as Promise<HistoryScan>;
}
