import { GoogleGenAI } from "@google/genai";
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

export const SUPPORTED_GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-pro",
] as const;

export const SUPPORTED_GROQ_MODELS = [
  "qwen/qwen3.8-27b",
] as const;

export const SUPPORTED_GROK_MODELS = [
  "grok-2-vision-1212",
  "grok-vision-beta",
] as const;

export const SUPPORTED_VISION_MODELS = [
  ...SUPPORTED_GEMINI_MODELS,
  ...SUPPORTED_GROQ_MODELS,
  ...SUPPORTED_GROK_MODELS,
] as const;

export function isGroqModel(model: string): boolean {
  const m = model.toLowerCase();
  return m.startsWith("qwen") || m.includes("groq") || m.includes("llama-3.2");
}

export function isGrokModel(model: string): boolean {
  return model.toLowerCase().startsWith("grok");
}

async function callGroqVision(
  imageBase64: string,
  mimeType: string,
  apiKey: string,
  modelName: string
): Promise<{ labels: string[]; modelUsed: string }> {
  const model = modelName || "qwen/qwen3.8-27b";

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
      model,
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
  return { labels, modelUsed: model };
}

async function callGrokVision(
  imageBase64: string,
  mimeType: string,
  apiKey: string,
  modelName: string
): Promise<{ labels: string[]; modelUsed: string }> {
  const model = modelName || "grok-2-vision-1212";

  const prompt = `You are an Indonesian food and nutrition recognition assistant.
Analyze the image and identify the food and drink items present.
Rules:
- Identify food/drink names in Indonesian or common English.
- If coffee or tea is present, specify whether it is sweet/milk or plain/black (e.g. "kopi hitam", "kopi susu", "es teh manis", "teh tawar").
- Avoid generic non-food objects like plate, food, dish, meal, table, bowl, cup.
- Maximum 5 labels.
Return ONLY valid JSON in this exact format:
{"labels": ["nasi", "ayam goreng"]}`;

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
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
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`xAI Grok API error (${res.status}): ${errorBody || res.statusText}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data?.choices?.[0]?.message?.content?.trim() || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Respons Grok vision tidak menghasilkan JSON yang valid: ${text.slice(0, 100)}`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as { labels?: string[] };
  const labels = (parsed.labels ?? []).map((l) => String(l).trim().toLowerCase()).filter(Boolean);
  return { labels, modelUsed: model };
}

async function callGeminiVision(
  imageBase64: string,
  mimeType: string,
  apiKey: string,
  preferredModel: string
): Promise<{ labels: string[]; modelUsed: string }> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an Indonesian food and nutrition recognition assistant.
Analyze the image and identify the food and drink items present.
Rules:
- Identify food/drink names in Indonesian or common English.
- If coffee or tea is present, specify whether it is sweet/milk or plain/black (e.g. "kopi hitam", "kopi susu", "es teh manis", "teh tawar").
- Avoid generic non-food objects like plate, food, dish, meal, table, bowl, cup.
- Maximum 5 labels.
Return ONLY valid JSON in this exact format:
{"labels": ["nasi", "ayam goreng"]}`;

  // Prioritize preferred model, then try remaining models as fallback
  const candidateModels = [
    preferredModel,
    ...SUPPORTED_GEMINI_MODELS.filter((m) => m !== preferredModel),
  ].filter(Boolean);

  let lastError: unknown;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          { inlineData: { data: imageBase64, mimeType } },
          prompt,
        ],
      });

      const text = (response.text || "").trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error(`Respons AI vision tidak menghasilkan JSON yang valid: ${text.slice(0, 100)}`);
      }

      const parsed = JSON.parse(jsonMatch[0]) as { labels?: string[] };
      const labels = (parsed.labels ?? []).map((l) => String(l).trim().toLowerCase()).filter(Boolean);
      return { labels, modelUsed: model };
    } catch (err) {
      console.warn(`Model ${model} gagal atau tidak tersedia, mencoba model cadangan:`, err);
      lastError = err;
    }
  }

  throw new Error(`Semua model vision gagal memproses gambar: ${String(lastError)}`);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(request: VercelRequest, response: VercelResponse) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? process.env.VITE_GEMINI_API_KEY ?? "";
  const GROQ_API_KEY = process.env.GROQ_API_KEY ?? process.env.VITE_GROQ_API_KEY ?? "";
  const XAI_API_KEY = process.env.XAI_API_KEY ?? process.env.VITE_XAI_API_KEY ?? "";
  const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const SUPABASE_KEY = process.env.SUPABASE_KEY ?? process.env.VITE_SUPABASE_KEY ?? "";

  if (request.method !== "POST") {
    return jsonError(response, "Metode tidak diizinkan", 405);
  }

  if (!GEMINI_API_KEY && !GROQ_API_KEY && !XAI_API_KEY) {
    return jsonError(
      response,
      "Kunci API belum dikonfigurasi. Harap konfigurasi GEMINI_API_KEY, GROQ_API_KEY, atau XAI_API_KEY di .env.",
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

  const { fields, files } = parsed;
  const requestedModel = (
    Array.isArray(fields?.model) ? fields.model[0] : fields?.model
  ) || process.env.GEMINI_VISION_MODEL || "gemini-2.0-flash";

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

  // Call AI vision with multi-provider routing & automatic fallback
  let rawLabels: string[] = [];
  let modelUsed = requestedModel;

  const tryGroq = async (m: string) => {
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY belum dikonfigurasi");
    return await callGroqVision(base64, mimeType, GROQ_API_KEY, m);
  };

  const tryGrok = async (m: string) => {
    if (!XAI_API_KEY) throw new Error("XAI_API_KEY belum dikonfigurasi");
    return await callGrokVision(base64, mimeType, XAI_API_KEY, m);
  };

  const tryGemini = async (m: string) => {
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY belum dikonfigurasi");
    return await callGeminiVision(base64, mimeType, GEMINI_API_KEY, m);
  };

  type ProviderRunner = () => Promise<{ labels: string[]; modelUsed: string }>;
  const runners: ProviderRunner[] = [];

  if (isGroqModel(requestedModel)) {
    runners.push(() => tryGroq(requestedModel));
    if (GEMINI_API_KEY) runners.push(() => tryGemini("gemini-2.0-flash"));
    if (XAI_API_KEY) runners.push(() => tryGrok("grok-2-vision-1212"));
  } else if (isGrokModel(requestedModel)) {
    runners.push(() => tryGrok(requestedModel));
    if (GEMINI_API_KEY) runners.push(() => tryGemini("gemini-2.0-flash"));
    if (GROQ_API_KEY) runners.push(() => tryGroq("qwen/qwen3.8-27b"));
  } else {
    // Gemini requested
    runners.push(() => tryGemini(requestedModel));
    if (GROQ_API_KEY) runners.push(() => tryGroq("qwen/qwen3.8-27b"));
    if (XAI_API_KEY) runners.push(() => tryGrok("grok-2-vision-1212"));
  }

  let lastError: unknown;
  let success = false;

  for (const run of runners) {
    try {
      const result = await run();
      rawLabels = result.labels;
      modelUsed = result.modelUsed;
      success = true;
      break;
    } catch (err) {
      console.warn("Vision provider error, trying fallback if available:", err);
      lastError = err;
    }
  }

  if (!success) {
    return jsonError(response, `AI vision gagal memproses gambar: ${String(lastError)}`, 502);
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
    model_used: modelUsed,
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
