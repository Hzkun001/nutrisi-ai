import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  filterVisionLabels,
  normalizeFoodName,
  DISPLAY_NAME_RULES,
} from "../lib/labelNormalizer.js";
import { findFood, calculateNutrition } from "../lib/nutritionDB.js";

// ── Helpers ───────────────────────────────────────────────────────────────────
function jsonError(res: VercelResponse, message: string, status = 400) {
  return res.status(status).json({ error: message });
}

function toTitleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function localizeLabel(label: string): string {
  const normalized = label.trim().toLowerCase();
  const mapped = DISPLAY_NAME_RULES[normalized];
  if (mapped) {
    return mapped.replace(/\s*\(estimasi\)\s*$/i, "");
  }
  return toTitleCase(normalized);
}

export const GROQ_VISION_MODEL = "qwen/qwen3.8-27b";

export async function callGroqVision(
  imageBase64: string,
  mimeType: string,
  apiKey: string
): Promise<{ labels: string[]; modelUsed: string }> {
  const prompt = `You are an Indonesian food and nutrition recognition assistant.
Analyze the image and identify the food and drink items present.
Rules:
- Identify food/drink names in Indonesian or common English.
- If coffee or tea is present, specify whether it is sweet/milk or plain/black (e.g. "kopi hitam", "kopi susu", "es teh manis", "teh tawar").
- Avoid generic non-food objects like plate, food, dish, meal, table, bowl, cup.
- Maximum 5 labels.
Return ONLY valid JSON in this exact format:
{"labels": ["nasi", "ayam goreng"]}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`Groq API error (${res.status}): ${errorBody || res.statusText}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data?.choices?.[0]?.message?.content?.trim() || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Respons Groq vision tidak menghasilkan JSON yang valid: ${text.slice(0, 100)}`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as { labels?: string[] };
  const labels = (parsed.labels ?? []).map((l) => String(l).trim().toLowerCase()).filter(Boolean);
  return { labels, modelUsed: GROQ_VISION_MODEL };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(request: VercelRequest, response: VercelResponse) {
  const GROQ_API_KEY = (process.env.GROQ_API_KEY ?? process.env.VITE_GROQ_API_KEY ?? "").trim();
  const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const SUPABASE_KEY = process.env.SUPABASE_KEY ?? process.env.VITE_SUPABASE_KEY ?? "";

  if (request.method !== "POST") {
    return jsonError(response, "Metode tidak diizinkan", 405);
  }

  if (!GROQ_API_KEY || GROQ_API_KEY.startsWith("your_")) {
    return jsonError(
      response,
      "GROQ_API_KEY belum dikonfigurasi di Vercel Dashboard. Harap buka Vercel > Project Settings > Environment Variables, tambahkan GROQ_API_KEY, lalu lakukan Redeploy.",
      500
    );
  }

  // Parse multipart form
  const parseForm = () =>
    new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      const form = formidable({ keepExtensions: true, maxFileSize: 10 * 1024 * 1024 });
      form.parse(request, (err, fields, files) => {
        if (err) {
          console.error("Formidable parse error object:", err);
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

  let parsed: { fields: formidable.Fields; files: formidable.Files };
  try {
    parsed = await parseForm();
  } catch (err) {
    console.error("formData parse error:", err);
    return jsonError(response, "Format multipart form tidak valid", 400);
  }

  const { files } = parsed;
  const fileArray = files?.file;

  if (!fileArray || fileArray.length === 0) {
    return jsonError(response, "Gambar belum diunggah. Kirim file dengan field bernama 'file'.", 400);
  }

  const fileDetail = fileArray[0];
  const mimeType = fileDetail.mimetype || "image/jpeg";
  if (!mimeType.startsWith("image/")) {
    return jsonError(response, "File yang diunggah harus berupa gambar (JPG, PNG, WebP).", 400);
  }
  
  // Read file into base64
  const fs = await import("fs");
  const buffer = fs.readFileSync(fileDetail.filepath);
  const base64 = buffer.toString("base64");
  
  // Clean up the temporary file immediately
  try {
    fs.unlinkSync(fileDetail.filepath);
  } catch (cleanupErr) {
    console.warn("Failed to clean up temp file:", cleanupErr);
  }

  // Call Groq Vision
  let rawLabels: string[] = [];
  try {
    const result = await callGroqVision(base64, mimeType, GROQ_API_KEY);
    rawLabels = result.labels;
  } catch (err) {
    console.error("Groq vision error:", err);
    const errStr = String(err);
    if (errStr.includes("401") || errStr.includes("Invalid API Key")) {
      return jsonError(
        response,
        "GROQ_API_KEY tidak valid. Harap periksa kunci API Groq Anda di Vercel Dashboard (Project Settings > Environment Variables).",
        502
      );
    }
    return jsonError(response, `AI vision gagal memproses gambar: ${errStr}`, 502);
  }

  // Normalize & filter labels
  const visionLabels = filterVisionLabels(rawLabels, 5);

  // Map labels → nutrition
  const detectedFoods: object[] = [];
  const unmatchedLabels: string[] = [];
  const total = { calories: 0, protein: 0, fat: 0, carbs: 0 };

  for (const label of visionLabels) {
    const dbName = normalizeFoodName(label);
    const food = findFood(dbName);

    if (!food) {
      unmatchedLabels.push(label);
      continue;
    }

    const portionGrams = food.portion;
    const nutrition = calculateNutrition(food, portionGrams);
    const displayName = DISPLAY_NAME_RULES[label] ?? `${food.name} (estimasi)`;

    detectedFoods.push({
      input_name: label,
      display_name: displayName,
      matched_name: food.name,
      portion_grams: portionGrams,
      ...nutrition,
    });

    total.calories += nutrition.calories;
    total.protein += nutrition.protein;
    total.fat += nutrition.fat;
    total.carbs += nutrition.carbs;
  }

  // Round totals
  total.calories = Math.round(total.calories * 100) / 100;
  total.protein  = Math.round(total.protein  * 100) / 100;
  total.fat      = Math.round(total.fat      * 100) / 100;
  total.carbs    = Math.round(total.carbs    * 100) / 100;

  const note = "Estimasi berdasarkan hasil vision dan porsi standar.";
  const localizedVisionLabels = visionLabels.map(localizeLabel);
  const localizedUnmatchedLabels = unmatchedLabels.map(localizeLabel);

  const responseBody = {
    model_used: GROQ_VISION_MODEL,
    raw_vision_labels: rawLabels,
    vision_labels: localizedVisionLabels,
    detected_foods: detectedFoods,
    total,
    note,
    unmatched_labels: localizedUnmatchedLabels,
  };

  let insertedId: number | string | undefined;
  let createdAt: string | undefined;

  // Save to Supabase
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data: insertedData, error: dbError } = await supabase
        .from("scan_results")
        .insert({
          original_filename: fileDetail.originalFilename || "unknown",
          raw_vision_labels: rawLabels,
          filtered_vision_labels: localizedVisionLabels,
          unmatched_labels: localizedUnmatchedLabels,
          detected_foods: detectedFoods,
          total_calories: total.calories,
          total_protein: total.protein,
          total_fat: total.fat,
          total_carbs: total.carbs,
          note,
        })
        .select("id, created_at")
        .single();

      if (dbError) {
        console.error("Supabase insert error:", dbError.message);
      } else if (insertedData) {
        insertedId = insertedData.id;
        createdAt = insertedData.created_at;
      }
    } catch (dbError) {
      console.error("Supabase insert exception:", dbError);
    }
  }

  return response.status(200).json({
    ...responseBody,
    id: insertedId,
    created_at: createdAt,
  });
}
