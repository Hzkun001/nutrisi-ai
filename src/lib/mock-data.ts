import type { DetectedFood } from "@/lib/types";

export interface ScanResult {
  id: string;
  imageName: string;
  imageUrl: string;
  labels: string[];
  foods: DetectedFood[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  scanDate: string;
}

export const mockFoods: DetectedFood[] = [
  { input_name: "Grilled Chicken", display_name: "Grilled Chicken", matched_name: "Chicken Breast, Grilled", portion_grams: 150, calories: 248, protein: 46, fat: 5, carbs: 0 },
  { input_name: "White Rice", display_name: "White Rice", matched_name: "Rice, White, Cooked", portion_grams: 200, calories: 260, protein: 5, fat: 0.4, carbs: 57 },
  { input_name: "Fried Egg", display_name: "Fried Egg", matched_name: "Egg, Fried", portion_grams: 46, calories: 90, protein: 6, fat: 7, carbs: 0.4 },
  { input_name: "Cucumber", display_name: "Cucumber", matched_name: "Cucumber, Raw, Sliced", portion_grams: 80, calories: 12, protein: 0.5, fat: 0.1, carbs: 2.6 },
  { input_name: "Tofu", display_name: "Tofu", matched_name: "Tofu, Firm", portion_grams: 100, calories: 76, protein: 8, fat: 4.8, carbs: 1.9 },
];

export const mockLabels = ["Food", "Meal", "Rice", "Chicken", "Protein", "Asian Cuisine", "Healthy", "Plate"];

export const mockScans: ScanResult[] = [
  {
    id: "scan-001",
    imageName: "lunch_plate.jpg",
    imageUrl: "",
    labels: mockLabels,
    foods: mockFoods,
    totalCalories: 520,
    totalProtein: 35,
    totalFat: 18,
    totalCarbs: 60,
    scanDate: "2026-03-14T10:30:00Z",
  },
  {
    id: "scan-002",
    imageName: "breakfast_bowl.jpg",
    imageUrl: "",
    labels: ["Food", "Breakfast", "Oatmeal", "Fruit", "Healthy"],
    foods: [
      { input_name: "Oatmeal", display_name: "Oatmeal", matched_name: "Oats, Cooked", portion_grams: 250, calories: 158, protein: 6, fat: 3, carbs: 27 },
      { input_name: "Banana", display_name: "Banana", matched_name: "Banana, Raw", portion_grams: 120, calories: 107, protein: 1.3, fat: 0.4, carbs: 27 },
      { input_name: "Blueberries", display_name: "Blueberries", matched_name: "Blueberries, Raw", portion_grams: 50, calories: 29, protein: 0.4, fat: 0.2, carbs: 7 },
    ],
    totalCalories: 294,
    totalProtein: 7.7,
    totalFat: 3.6,
    totalCarbs: 61,
    scanDate: "2026-03-13T08:15:00Z",
  },
  {
    id: "scan-003",
    imageName: "dinner_steak.jpg",
    imageUrl: "",
    labels: ["Food", "Steak", "Dinner", "Protein", "Vegetables"],
    foods: [
      { input_name: "Ribeye Steak", display_name: "Ribeye Steak", matched_name: "Beef, Ribeye, Grilled", portion_grams: 200, calories: 544, protein: 48, fat: 38, carbs: 0 },
      { input_name: "Broccoli", display_name: "Broccoli", matched_name: "Broccoli, Steamed", portion_grams: 100, calories: 35, protein: 2.4, fat: 0.4, carbs: 7 },
      { input_name: "Mashed Potatoes", display_name: "Mashed Potatoes", matched_name: "Potatoes, Mashed", portion_grams: 150, calories: 174, protein: 3, fat: 7, carbs: 24 },
    ],
    totalCalories: 753,
    totalProtein: 53.4,
    totalFat: 45.4,
    totalCarbs: 31,
    scanDate: "2026-03-12T19:45:00Z",
  },
];
