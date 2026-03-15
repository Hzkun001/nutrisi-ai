/**
 * Label normalization — ported from the Python backend.
 *
 * Flow:
 *   raw Gemini label  →  VISION_LABEL_NORMALIZATION  →  canonical English label
 *   canonical label   →  FOOD_ALIAS                  →  Indonesian DB name (name_normalized)
 */

// ── Gemini raw output → canonical English label ──────────────────────────────
const VISION_LABEL_NORMALIZATION: Record<string, string> = {
  // Nasi
  rice: "white rice",
  "plain rice": "white rice",
  "steamed rice": "white rice",
  "cooked rice": "white rice",
  nasi: "white rice",
  "nasi putih": "white rice",
  "nasi goreng": "fried rice",
  "indonesian fried rice": "fried rice",
  // Ayam
  chicken: "fried chicken",
  "roast chicken": "grilled chicken",
  "roasted chicken": "grilled chicken",
  "baked chicken": "grilled chicken",
  "bbq chicken": "grilled chicken",
  "chicken satay": "satay",
  "sate ayam": "satay",
  "chicken skewer": "satay",
  skewer: "satay",
  "chicken soup": "soto ayam",
  broth: "soto ayam",
  // Telur
  omelet: "omelette",
  egg: "fried egg",
  "sunny side up": "fried egg",
  "boiled egg": "fried egg",
  telur: "fried egg",
  "telur goreng": "fried egg",
  // Mie
  "fried noodle": "fried noodles",
  noodle: "fried noodles",
  noodles: "fried noodles",
  mie: "fried noodles",
  "mie goreng": "fried noodles",
  "chicken noodle": "chicken noodles",
  "mie ayam": "chicken noodles",
  // Tahu & Tempe
  "bean curd": "tofu",
  "fried tofu": "tofu",
  tahu: "tofu",
  tempe: "tempeh",
  "fermented soy": "tempeh",
  // Seafood & Snack
  "prawn cracker": "prawn crackers",
  "shrimp cracker": "prawn crackers",
  cracker: "prawn crackers",
  kerupuk: "prawn crackers",
  "fried fish": "fried fish",
  // Sayuran
  cucumbers: "cucumber",
  "lettuce leaves": "lettuce",
  salad: "lettuce",
  "bean sprouts": "bean sprouts",
  "green beans": "green beans",
  "long beans": "long beans",
  "water spinach": "water spinach",
  "morning glory": "water spinach",
  kangkung: "water spinach",
  "mixed vegetables": "cap cay",
  "stir fry": "cap cay",
  "stir fry vegetables": "cap cay",
  // Sambal
  chili: "chili paste",
  "chili sauce": "chili paste",
  "hot sauce": "chili paste",
  sambal: "chili paste",
  "red chili": "chili paste",
  // Buah
  bananas: "banana",
  oranges: "orange",
  citrus: "orange",
  // Minuman
  "black coffee": "coffee",
  espresso: "coffee",
  "green tea": "tea",
  "jasmine tea": "tea",
};

// ── Canonical English → Indonesian DB name (name_normalized) ─────────────────
export const FOOD_ALIAS: Record<string, string> = {
  // Ayam
  "fried chicken": "ayam goreng paha",
  chicken: "ayam goreng paha",
  "chicken breast": "ayam goreng paha",
  "grilled chicken": "ayam bakar",
  "roasted chicken": "ayam bakar",
  "baked chicken": "ayam bakar",
  "bbq chicken": "ayam bakar",
  "chicken satay": "sate bandeng",
  satay: "sate bandeng",
  sate: "sate bandeng",
  "sate ayam": "sate bandeng",
  "chicken soup": "soto bandung masakan",
  soto: "soto bandung masakan",
  "soto ayam": "soto bandung masakan",
  "opor ayam": "ayam bakar",
  // Nasi
  "white rice": "nasi",
  rice: "nasi",
  "steamed rice": "nasi",
  "fried rice": "nasi goreng",
  "nasi goreng": "nasi goreng",
  "nasi uduk": "nasi gemuk",
  "nasi kuning": "nasi gemuk",
  // Mie
  "fried noodles": "mie goreng",
  noodles: "mie goreng",
  "mie goreng": "mie goreng",
  "chicken noodles": "mie ayam",
  "mie ayam": "mie ayam",
  bakso: "bakso",
  "mie bakso": "mie bakso",
  // Telur
  "fried egg": "telur goreng",
  egg: "telur goreng",
  "sunny side up": "telur goreng",
  "scrambled egg": "telur goreng",
  omelette: "telur dadar",
  omelet: "telur dadar",
  "boiled egg": "telur goreng",
  // Tahu & Tempe
  tofu: "tahu goreng",
  tahu: "tahu goreng",
  "fried tofu": "tahu goreng",
  "bean curd": "tahu goreng",
  tempeh: "tempe goreng",
  tempe: "tempe goreng",
  // Ikan & Seafood
  "fried fish": "ikan asin bilis goreng",
  fish: "ikan asin bilis goreng",
  "prawn crackers": "kerupuk udang",
  "shrimp crackers": "kerupuk udang",
  crackers: "kerupuk udang",
  kerupuk: "kerupuk udang",
  "kerupuk udang": "kerupuk udang",
  // Sayuran
  cucumber: "ketimun",
  lettuce: "selada",
  spinach: "bayam kukus",
  "water spinach": "kangkung",
  kangkung: "kangkung",
  carrot: "wortel segar",
  cabbage: "daun kubis segar",
  corn: "jagung grontol",
  "green beans": "daun kacang panjang",
  "long beans": "daun kacang panjang",
  broccoli: "bayam kukus",
  "bean sprouts": "tauge",
  kale: "kangkung",
  tomato: "tomat",
  "cap cay": "cap cai sayur",
  "stir fry vegetables": "cap cai sayur",
  // Makanan Khas
  "gado gado": "gado gado",
  rendang: "rendang sapi masakan",
  "beef rendang": "rendang sapi masakan",
  "sayur asem": "sayur asem",
  rawon: "rawon masakan",
  martabak: "martabak telur",
  "martabak telur": "martabak telur",
  "martabak manis": "martabak manis",
  // Sambal
  "chili paste": "sambal",
  "chili sauce": "sambal",
  sambal: "sambal",
  "hot sauce": "sambal",
  // Roti & Snack
  bread: "roti putih",
  "white bread": "roti putih",
  toast: "roti putih",
  // Buah
  banana: "pisang raja",
  orange: "jeruk banjar segar",
  watermelon: "semangka merah",
  mango: "mangga segar",
  papaya: "pepaya segar",
  // Minuman
  coffee: "kopi bagian yang larut",
  "black coffee": "kopi bagian yang larut",
  tea: "teh",
  "green tea": "teh hijau daun kering",
  milk: "susu bubuk",
  // Kacang
  peanuts: "kacang tanah",
  peanut: "kacang tanah",
};

// ── Display names (Indonesian, shown to user) ─────────────────────────────────
export const DISPLAY_NAME_RULES: Record<string, string> = {
  "fried chicken": "Ayam goreng (estimasi)",
  chicken: "Ayam goreng (estimasi)",
  "grilled chicken": "Ayam bakar (estimasi)",
  "roasted chicken": "Ayam bakar (estimasi)",
  satay: "Sate (estimasi)",
  sate: "Sate (estimasi)",
  "sate ayam": "Sate ayam (estimasi)",
  "chicken satay": "Sate ayam (estimasi)",
  soto: "Soto (estimasi)",
  "soto ayam": "Soto ayam (estimasi)",
  "chicken soup": "Soto ayam (estimasi)",
  "opor ayam": "Opor ayam (estimasi)",
  "white rice": "Nasi (estimasi)",
  rice: "Nasi (estimasi)",
  "fried rice": "Nasi goreng (estimasi)",
  "nasi goreng": "Nasi goreng (estimasi)",
  "nasi uduk": "Nasi uduk (estimasi)",
  "nasi kuning": "Nasi kuning (estimasi)",
  "fried noodles": "Mie goreng (estimasi)",
  noodles: "Mie goreng (estimasi)",
  "mie goreng": "Mie goreng (estimasi)",
  "chicken noodles": "Mie ayam (estimasi)",
  "mie ayam": "Mie ayam (estimasi)",
  bakso: "Bakso (estimasi)",
  "mie bakso": "Mie bakso (estimasi)",
  "fried egg": "Telur goreng (estimasi)",
  egg: "Telur goreng (estimasi)",
  "sunny side up": "Telur goreng (estimasi)",
  omelette: "Telur dadar (estimasi)",
  omelet: "Telur dadar (estimasi)",
  "boiled egg": "Telur rebus (estimasi)",
  tofu: "Tahu goreng (estimasi)",
  tahu: "Tahu goreng (estimasi)",
  tempeh: "Tempe goreng (estimasi)",
  tempe: "Tempe goreng (estimasi)",
  "fried fish": "Ikan goreng (estimasi)",
  fish: "Ikan (estimasi)",
  "prawn crackers": "Kerupuk udang (estimasi)",
  "shrimp crackers": "Kerupuk udang (estimasi)",
  crackers: "Kerupuk (estimasi)",
  kerupuk: "Kerupuk (estimasi)",
  "kerupuk udang": "Kerupuk udang (estimasi)",
  cucumber: "Ketimun (estimasi)",
  lettuce: "Selada (estimasi)",
  spinach: "Bayam (estimasi)",
  broccoli: "Brokoli (estimasi)",
  carrot: "Wortel (estimasi)",
  cabbage: "Kubis (estimasi)",
  corn: "Jagung (estimasi)",
  "green beans": "Kacang panjang (estimasi)",
  "long beans": "Kacang panjang (estimasi)",
  "water spinach": "Kangkung (estimasi)",
  kangkung: "Kangkung (estimasi)",
  "bean sprouts": "Tauge (estimasi)",
  tomato: "Tomat (estimasi)",
  "cap cay": "Cap cay (estimasi)",
  "stir fry vegetables": "Cap cay (estimasi)",
  "gado gado": "Gado-gado (estimasi)",
  rendang: "Rendang (estimasi)",
  "beef rendang": "Rendang sapi (estimasi)",
  "sayur asem": "Sayur asem (estimasi)",
  rawon: "Rawon (estimasi)",
  martabak: "Martabak telur (estimasi)",
  "martabak telur": "Martabak telur (estimasi)",
  "martabak manis": "Martabak manis (estimasi)",
  "chili paste": "Sambal (estimasi)",
  "chili sauce": "Sambal (estimasi)",
  sambal: "Sambal (estimasi)",
  "hot sauce": "Sambal (estimasi)",
  bread: "Roti putih (estimasi)",
  "white bread": "Roti putih (estimasi)",
  toast: "Roti bakar (estimasi)",
  banana: "Pisang (estimasi)",
  orange: "Jeruk (estimasi)",
  watermelon: "Semangka (estimasi)",
  mango: "Mangga (estimasi)",
  papaya: "Pepaya (estimasi)",
  coffee: "Kopi (estimasi)",
  "black coffee": "Kopi hitam (estimasi)",
  tea: "Teh (estimasi)",
  "green tea": "Teh hijau (estimasi)",
  milk: "Susu (estimasi)",
  peanuts: "Kacang tanah (estimasi)",
  peanut: "Kacang tanah (estimasi)",
};

// ── Exposed utilities ─────────────────────────────────────────────────────────

const GENERIC_LABELS = new Set([
  "food", "dish", "meal", "plate", "cuisine", "recipe",
  "lunch", "dinner", "breakfast", "snack", "drink", "beverage",
]);

export function normalizeVisionLabel(raw: string): string {
  const lower = raw.trim().toLowerCase();
  return VISION_LABEL_NORMALIZATION[lower] ?? lower;
}

export function normalizeFoodName(label: string): string {
  const lower = label.trim().toLowerCase();
  return FOOD_ALIAS[lower] ?? lower;
}

export function filterVisionLabels(labels: string[], max = 5): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of labels) {
    const normalized = normalizeVisionLabel(raw.trim().toLowerCase());
    if (GENERIC_LABELS.has(normalized)) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
    if (result.length >= max) break;
  }
  return result;
}
