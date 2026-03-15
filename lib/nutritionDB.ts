/**
 * In-memory nutrition database.
 * Values are per 100g, sourced directly from the Supabase `foods` table.
 * `portion` is the default serving size in grams used for calculations.
 */

export interface FoodEntry {
  name: string;
  cal: number;   // calories per 100g
  pro: number;   // protein per 100g
  fat: number;   // fat per 100g
  carb: number;  // carbs per 100g
  portion: number; // default serving grams
}

export const NUTRITION_DB: Record<string, FoodEntry> = {
  // Nasi & Karbohidrat
  "nasi":                    { name: "Nasi",              cal: 180,   pro: 3,    fat: 0.3,  carb: 40,   portion: 150 },
  "nasi goreng":             { name: "Nasi Goreng",       cal: 276,   pro: 3.2,  fat: 3.2,  carb: 50,   portion: 150 },
  "nasi gemuk":              { name: "Nasi Uduk",         cal: 192,   pro: 3.8,  fat: 8.8,  carb: 30,   portion: 150 },
  "beras giling masak nasi": { name: "Nasi Putih",        cal: 178,   pro: 2.1,  fat: 0.1,  carb: 40,   portion: 150 },
  // Mie & Bakso
  "mie goreng":              { name: "Mie Goreng",        cal: 468,   pro: 7.6,  fat: 20.4, carb: 63,   portion: 150 },
  "mie ayam":                { name: "Mie Ayam",          cal: 102,   pro: 6.2,  fat: 3.9,  carb: 12,   portion: 150 },
  "bakso":                   { name: "Bakso",             cal: 76,    pro: 4.1,  fat: 2.5,  carb: 8,    portion: 100 },
  "mie bakso":               { name: "Mie Bakso",         cal: 114,   pro: 5.3,  fat: 3,    carb: 15,   portion: 150 },
  // Ayam
  "ayam goreng paha":        { name: "Ayam Goreng",       cal: 287,   pro: 31,   fat: 15.7, carb: 0,    portion: 100 },
  "ayam bakar":              { name: "Ayam Bakar",        cal: 190,   pro: 29,   fat: 7.5,  carb: 0,    portion: 150 },
  "sate bandeng":            { name: "Sate",              cal: 283,   pro: 12.1, fat: 16.8, carb: 5,    portion: 100 },
  "soto bandung masakan":    { name: "Soto",              cal: 42,    pro: 3.9,  fat: 1.7,  carb: 3,    portion: 100 },
  // Telur
  "telur goreng":            { name: "Telur Goreng",      cal: 383,   pro: 15.1, fat: 32.9, carb: 0,    portion: 100 },
  "telur dadar":             { name: "Telur Dadar",       cal: 208,   pro: 13,   fat: 16,   carb: 1,    portion: 100 },
  // Tahu & Tempe
  "tahu goreng":             { name: "Tahu Goreng",       cal: 115,   pro: 9.7,  fat: 8.5,  carb: 1,    portion: 100 },
  "tempe goreng":            { name: "Tempe Goreng",      cal: 328,   pro: 18.4, fat: 23.2, carb: 12,   portion: 100 },
  // Ikan & Seafood
  "ikan asin bilis goreng":  { name: "Ikan Asin Goreng",  cal: 380,   pro: 33.6, fat: 27.5, carb: 0,    portion: 100 },
  "kerupuk udang":           { name: "Kerupuk Udang",     cal: 340,   pro: 30,   fat: 30,   carb: 50,   portion: 50  },
  // Sayuran
  "ketimun":                 { name: "Ketimun",           cal: 12,    pro: 0.7,  fat: 0.1,  carb: 2,    portion: 100 },
  "selada":                  { name: "Selada",            cal: 15,    pro: 1.2,  fat: 0.2,  carb: 2,    portion: 100 },
  "bayam kukus":             { name: "Bayam",             cal: 30,    pro: 1.3,  fat: 0.7,  carb: 5,    portion: 100 },
  "kangkung":                { name: "Kangkung",          cal: 29,    pro: 3,    fat: 0.3,  carb: 3,    portion: 100 },
  "wortel segar":            { name: "Wortel",            cal: 42,    pro: 1.2,  fat: 0.6,  carb: 10,   portion: 100 },
  "daun kubis segar":        { name: "Kubis",             cal: 51,    pro: 2.5,  fat: 1.1,  carb: 5,    portion: 100 },
  "jagung grontol":          { name: "Jagung",            cal: 156,   pro: 2.7,  fat: 1.3,  carb: 35,   portion: 100 },
  "daun kacang panjang":     { name: "Kacang Panjang",    cal: 34,    pro: 4.1,  fat: 0.4,  carb: 4,    portion: 100 },
  "cap cai sayur":           { name: "Cap Cay",           cal: 97,    pro: 5.8,  fat: 6.3,  carb: 8,    portion: 100 },
  "tauge":                   { name: "Tauge",             cal: 16,    pro: 1.8,  fat: 0.1,  carb: 2,    portion: 100 },
  "tomat":                   { name: "Tomat",             cal: 20,    pro: 0.9,  fat: 0.2,  carb: 4,    portion: 100 },
  // Makanan Khas
  "gado gado":               { name: "Gado-Gado",         cal: 137,   pro: 6.1,  fat: 3.2,  carb: 18,   portion: 100 },
  "rendang sapi masakan":    { name: "Rendang",           cal: 193,   pro: 22.6, fat: 7.9,  carb: 8,    portion: 100 },
  "sayur asem":              { name: "Sayur Asem",        cal: 29,    pro: 0.7,  fat: 0.6,  carb: 5,    portion: 100 },
  "rawon masakan":           { name: "Rawon",             cal: 60,    pro: 5.4,  fat: 2.5,  carb: 4,    portion: 100 },
  "martabak telur":          { name: "Martabak Telur",    cal: 200,   pro: 8.9,  fat: 5.1,  carb: 28,   portion: 100 },
  "martabak manis":          { name: "Martabak Manis",    cal: 265,   pro: 4.7,  fat: 5.5,  carb: 50,   portion: 100 },
  // Roti & Snack
  "roti putih":              { name: "Roti Putih",        cal: 248,   pro: 8,    fat: 1.2,  carb: 50,   portion: 50  },
  "kacang tanah":            { name: "Kacang Tanah",      cal: 452,   pro: 25.3, fat: 42.7, carb: 16,   portion: 50  },
  // Buah
  "pisang raja":             { name: "Pisang",            cal: 120,   pro: 1.2,  fat: 0.2,  carb: 31,   portion: 100 },
  "jeruk banjar segar":      { name: "Jeruk",             cal: 61,    pro: 0.8,  fat: 0.2,  carb: 15,   portion: 100 },
  "mangga segar":            { name: "Mangga",            cal: 52,    pro: 0.7,  fat: 0,    carb: 13,   portion: 100 },
  "pepaya segar":            { name: "Pepaya",            cal: 46,    pro: 0.5,  fat: 12,   carb: 10,   portion: 100 },
  "semangka merah":          { name: "Semangka",          cal: 30,    pro: 0.6,  fat: 0.2,  carb: 7,    portion: 100 },
  // Minuman
  "kopi bagian yang larut":  { name: "Kopi",              cal: 352,   pro: 17.4, fat: 1.3,  carb: 60,   portion: 250 },
  "teh":                     { name: "Teh",               cal: 132,   pro: 19.5, fat: 0.7,  carb: 10,   portion: 250 },
  "teh hijau daun kering":   { name: "Teh Hijau",         cal: 132,   pro: 19.5, fat: 0.7,  carb: 10,   portion: 250 },
  "susu bubuk":              { name: "Susu",              cal: 513,   pro: 24.6, fat: 30,   carb: 40,   portion: 250 },
};

export interface NutritionResult {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export function findFood(normalizedName: string): FoodEntry | null {
  return NUTRITION_DB[normalizedName] ?? null;
}

export function calculateNutrition(food: FoodEntry, portionGrams: number): NutritionResult {
  const factor = portionGrams / 100;
  return {
    calories: Math.round(food.cal * factor * 100) / 100,
    protein:  Math.round(food.pro * factor * 100) / 100,
    fat:      Math.round(food.fat * factor * 100) / 100,
    carbs:    Math.round(food.carb * factor * 100) / 100,
  };
}
