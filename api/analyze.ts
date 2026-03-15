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

async function callGeminiVision(
  imageBase64: string,
  mimeType: string,
  apiKey: string,
  modelName: string
): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a food recognition assistant.
Analyze the image and identify the foods present.
Rules:
- Return food labels only.
- Use simple English food names.
- Avoid generic words like plate, food, dish, meal.
- Maximum 5 labels.
Return ONLY valid JSON in this exact format:
{"labels": ["fried chicken", "white rice"]}`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [
      { inlineData: { data: imageBase64, mimeType } },
      prompt,
    ]
  });

  const text = (response.text || "").trim();
  // Strip markdown code fences if present
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned) as { labels: string[] };
  return (parsed.labels ?? []).map((l) => String(l).trim().toLowerCase()).filter(Boolean);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(request: VercelRequest, response: VercelResponse) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? process.env.VITE_GEMINI_API_KEY ?? "";
  const GEMINI_MODEL = process.env.GEMINI_VISION_MODEL ?? "gemini-1.5-flash";
  const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const SUPABASE_KEY = process.env.SUPABASE_KEY ?? process.env.VITE_SUPABASE_KEY ?? "";

  if (request.method !== "POST") {
    return jsonError(response, "Method not allowed", 405);
  }

  if (!GEMINI_API_KEY) {
    return jsonError(response, "GEMINI_API_KEY not configured", 500);
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
    return jsonError(response, "Invalid multipart form data", 400);
  }

  const { files } = parsed;
  const fileArray = files?.file;

  if (!fileArray || fileArray.length === 0) {
    return jsonError(response, "No image uploaded. Send file as 'file' field.", 400);
  }

  const fileDetail = fileArray[0];
  const mimeType = fileDetail.mimetype || "image/jpeg";
  
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

  // Call Gemini vision
  let rawLabels: string[];
  try {
    rawLabels = await callGeminiVision(base64, mimeType, GEMINI_API_KEY, GEMINI_MODEL);
  } catch (err) {
    console.error("Gemini vision error:", err);
    return jsonError(response, `AI vision failed: ${String(err)}`, 502);
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

  const responseBody = {
    raw_vision_labels: rawLabels,
    vision_labels: visionLabels,
    detected_foods: detectedFoods,
    total,
    note,
    unmatched_labels: unmatchedLabels,
  };

  // Save to Supabase
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      await supabase.from("scan_results").insert({
        original_filename: fileDetail.originalFilename || "unknown",
        raw_vision_labels: rawLabels,
        filtered_vision_labels: visionLabels,
        unmatched_labels: unmatchedLabels,
        detected_foods: detectedFoods,
        total_calories: total.calories,
        total_protein: total.protein,
        total_fat: total.fat,
        total_carbs: total.carbs,
        note,
      });
    } catch (dbError) {
      console.error("Supabase insert error:", dbError);
    }
  }

  return response.status(200).json(responseBody);
}
