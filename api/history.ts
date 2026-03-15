import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_KEY ?? "";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const method = request.method ?? "GET";
  
  if (method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return response.status(500).json({ error: "Supabase not configured" });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data, error } = await supabase
    .from("scan_results")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Supabase error:", error.message);
    return response.status(502).json({ error: "Failed to fetch history" });
  }

  return response.status(200).json({ results: data ?? [] });
}
