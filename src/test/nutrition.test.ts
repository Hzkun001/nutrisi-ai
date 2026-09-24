import { describe, it, expect } from "vitest";
import { findFood, calculateNutrition } from "../../lib/nutritionDB";
import {
  normalizeVisionLabel,
  normalizeFoodName,
  filterVisionLabels,
} from "../../lib/labelNormalizer";

describe("Nutritional Calculations & Database Integrity", () => {
  it("calculates prepared black coffee realistically (< 10 kcal per 250ml cup, not 880 kcal)", () => {
    const coffee = findFood("kopi");
    expect(coffee).not.toBeNull();
    if (!coffee) return;

    const result = calculateNutrition(coffee, coffee.portion);
    expect(result.calories).toBeLessThan(10);
    expect(result.calories).toBeGreaterThanOrEqual(1);
  });

  it("calculates sweet iced tea realistically (~88 kcal per 250ml cup, not 330 kcal)", () => {
    const sweetTea = findFood("es teh manis");
    expect(sweetTea).not.toBeNull();
    if (!sweetTea) return;

    const result = calculateNutrition(sweetTea, sweetTea.portion);
    expect(result.calories).toBeGreaterThan(50);
    expect(result.calories).toBeLessThan(120);
  });

  it("calculates liquid milk realistically (~150 kcal per 250ml glass, not 1282 kcal)", () => {
    const milk = findFood("susu");
    expect(milk).not.toBeNull();
    if (!milk) return;

    const result = calculateNutrition(milk, milk.portion);
    expect(result.calories).toBeGreaterThan(120);
    expect(result.calories).toBeLessThan(180);
  });

  it("ensures papaya fat adheres to reality (0.1g per 100g, not 12g)", () => {
    const papaya = findFood("pepaya segar");
    expect(papaya).not.toBeNull();
    if (!papaya) return;

    expect(papaya.fat).toBeLessThanOrEqual(0.5);
    const result = calculateNutrition(papaya, 100);
    expect(result.fat).toBeLessThanOrEqual(0.5);
  });

  it("correctly calculates Indonesian staples: sate ayam, soto ayam, ikan goreng, and telur rebus", () => {
    const sate = findFood("sate ayam");
    expect(sate).not.toBeNull();
    expect(sate?.name).toBe("Sate Ayam");
    expect(sate?.pro).toBeGreaterThanOrEqual(20);

    const soto = findFood("soto ayam");
    expect(soto).not.toBeNull();
    expect(soto?.name).toBe("Soto Ayam");

    const ikan = findFood("ikan goreng");
    expect(ikan).not.toBeNull();
    expect(ikan?.name).toBe("Ikan Goreng");

    const telurRebus = findFood("telur rebus");
    expect(telurRebus).not.toBeNull();
    expect(telurRebus?.name).toBe("Telur Rebus");
  });
});

describe("Label Normalizer & Food Aliasing", () => {
  it("preserves boiled egg instead of mutating it to fried egg", () => {
    expect(normalizeVisionLabel("boiled egg")).toBe("boiled egg");
    expect(normalizeFoodName("boiled egg")).toBe("telur rebus");
  });

  it("maps chicken satay aliases to chicken satay instead of milkfish (sate bandeng)", () => {
    expect(normalizeFoodName("chicken satay")).toBe("sate ayam");
    expect(normalizeFoodName("satay")).toBe("sate ayam");
    expect(normalizeFoodName("sate ayam")).toBe("sate ayam");
  });

  it("maps chicken soup / soto to soto ayam instead of soto bandung", () => {
    expect(normalizeFoodName("chicken soup")).toBe("soto ayam");
    expect(normalizeFoodName("soto ayam")).toBe("soto ayam");
  });

  it("maps fried fish to fresh fried fish instead of salted dried anchovies", () => {
    expect(normalizeFoodName("fried fish")).toBe("ikan goreng");
    expect(normalizeFoodName("ikan goreng")).toBe("ikan goreng");
  });

  it("filters generic terms and duplicate items", () => {
    const filtered = filterVisionLabels(["plate", "dish", "nasi", "nasi", "ayam goreng"]);
    expect(filtered).toEqual(["white rice", "fried chicken"]);
  });
});

describe("AI Vision Models Integration", () => {
  it("defines standard vision models with Gemini 2.0 Flash as primary", async () => {
    const { SUPPORTED_VISION_MODELS } = await import("../../api/analyze");
    expect(SUPPORTED_VISION_MODELS).toContain("gemini-2.0-flash");
    expect(SUPPORTED_VISION_MODELS).toContain("gemini-1.5-flash");
    expect(SUPPORTED_VISION_MODELS).toContain("gemini-2.0-flash-lite");
    expect(SUPPORTED_VISION_MODELS).toContain("gemini-1.5-pro");
    expect(SUPPORTED_VISION_MODELS[0]).toBe("gemini-2.0-flash");
  });

  it("supports Groq LPU Vision models and correctly identifies them", async () => {
    const { SUPPORTED_GROQ_MODELS, SUPPORTED_VISION_MODELS, isGroqModel } = await import("../../api/analyze");
    expect(SUPPORTED_GROQ_MODELS).toContain("qwen/qwen3.8-27b");
    expect(SUPPORTED_VISION_MODELS).toContain("qwen/qwen3.8-27b");

    expect(isGroqModel("qwen/qwen3.8-27b")).toBe(true);
    expect(isGroqModel("gemini-2.0-flash")).toBe(false);
    expect(isGroqModel("grok-2-vision-1212")).toBe(false);
  });

  it("supports xAI Grok Vision models and correctly identifies them", async () => {
    const { SUPPORTED_GROK_MODELS, SUPPORTED_VISION_MODELS, isGrokModel } = await import("../../api/analyze");
    expect(SUPPORTED_GROK_MODELS).toContain("grok-2-vision-1212");
    expect(SUPPORTED_GROK_MODELS).toContain("grok-vision-beta");
    expect(SUPPORTED_VISION_MODELS).toContain("grok-2-vision-1212");
    expect(SUPPORTED_VISION_MODELS).toContain("grok-vision-beta");

    expect(isGrokModel("grok-2-vision-1212")).toBe(true);
    expect(isGrokModel("grok-vision-beta")).toBe(true);
    expect(isGrokModel("gemini-2.0-flash")).toBe(false);
    expect(isGrokModel("gemini-1.5-pro")).toBe(false);
  });

  it("filters placeholder and invalid API keys correctly", async () => {
    const { isValidKey } = await import("../../api/analyze");
    expect(isValidKey(undefined)).toBe(false);
    expect(isValidKey("")).toBe(false);
    expect(isValidKey("   ")).toBe(false);
    expect(isValidKey("your_google_ai_studio_key_here")).toBe(false);
    expect(isValidKey("your_groq_api_key_here")).toBe(false);
    expect(isValidKey("<key>")).toBe(false);
    expect(isValidKey("undefined")).toBe(false);
    expect(isValidKey("gsk_valid_key_12345")).toBe(true);
  });
});

