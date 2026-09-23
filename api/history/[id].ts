import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_KEY ?? process.env.VITE_SUPABASE_KEY ?? "";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const method = request.method ?? "GET";
  if (method !== "GET") {
    return response.status(405).json({ error: "Metode tidak diizinkan" });
  }

  const id = request.query?.id as string;
  if (!id) {
    return response.status(400).json({ error: "ID scan belum diberikan" });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return response.status(500).json({ error: "Supabase belum dikonfigurasi" });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data, error } = await supabase
    .from("scan_results")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (error || !data) {
    return response.status(404).json({ error: "Scan tidak ditemukan" });
  }

  return response.status(200).json(data);
}
