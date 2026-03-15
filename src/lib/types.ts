/** A single detected food item from the backend response. */
export interface DetectedFood {
  input_name: string;
  display_name: string;
  matched_name: string;
  portion_grams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

/** Aggregated nutrition totals. */
export interface TotalNutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

/** Full response from POST /analyze/image. */
export interface ScanResult {
  raw_vision_labels: string[];
  vision_labels: string[];
  detected_foods: DetectedFood[];
  total: TotalNutrition;
  note: string;
  unmatched_labels: string[];
}

/** A single row from the scan_results table (history). */
export interface HistoryScan {
  id: number;
  original_filename: string;
  filtered_vision_labels: string[];
  detected_foods: DetectedFood[];
  total_calories: number;
  total_protein: number;
  total_fat: number;
  total_carbs: number;
  note: string;
  created_at: string;
}
