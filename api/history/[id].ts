import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_KEY ?? "";

export default async function handler(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const id = params?.id;
  if (!id) {
    return Response.json({ error: "Missing scan id" }, { status: 400 });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return Response.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data, error } = await supabase
    .from("scan_results")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (error || !data) {
    return Response.json({ error: "Scan tidak ditemukan" }, { status: 404 });
  }

  return Response.json(data);
}
