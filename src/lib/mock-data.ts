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
  { input_name: "Ayam goreng", display_name: "Ayam goreng", matched_name: "Ayam goreng paha", portion_grams: 150, calories: 248, protein: 46, fat: 5, carbs: 0 },
  { input_name: "Nasi putih", display_name: "Nasi putih", matched_name: "Nasi", portion_grams: 200, calories: 260, protein: 5, fat: 0.4, carbs: 57 },
  { input_name: "Telur goreng", display_name: "Telur goreng", matched_name: "Telur goreng", portion_grams: 46, calories: 90, protein: 6, fat: 7, carbs: 0.4 },
  { input_name: "Ketimun", display_name: "Ketimun", matched_name: "Ketimun", portion_grams: 80, calories: 12, protein: 0.5, fat: 0.1, carbs: 2.6 },
  { input_name: "Tahu goreng", display_name: "Tahu goreng", matched_name: "Tahu goreng", portion_grams: 100, calories: 76, protein: 8, fat: 4.8, carbs: 1.9 },
];

export const mockLabels = ["Nasi", "Ayam goreng", "Protein", "Masakan Indonesia", "Makan siang", "Sehat"];

export const mockScans: ScanResult[] = [
  {
    id: "scan-001",
    imageName: "makan_siang.jpg",
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
    imageName: "sarapan.jpg",
    imageUrl: "",
    labels: ["Sarapan", "Oatmeal", "Buah", "Sehat"],
    foods: [
      { input_name: "Oatmeal", display_name: "Oatmeal", matched_name: "Oats matang", portion_grams: 250, calories: 158, protein: 6, fat: 3, carbs: 27 },
      { input_name: "Pisang", display_name: "Pisang", matched_name: "Pisang segar", portion_grams: 120, calories: 107, protein: 1.3, fat: 0.4, carbs: 27 },
      { input_name: "Blueberry", display_name: "Blueberry", matched_name: "Blueberry segar", portion_grams: 50, calories: 29, protein: 0.4, fat: 0.2, carbs: 7 },
    ],
    totalCalories: 294,
    totalProtein: 7.7,
    totalFat: 3.6,
    totalCarbs: 61,
    scanDate: "2026-03-13T08:15:00Z",
  },
  {
    id: "scan-003",
    imageName: "makan_malam.jpg",
    imageUrl: "",
    labels: ["Steak", "Makan malam", "Protein", "Sayuran"],
    foods: [
      { input_name: "Steak sapi", display_name: "Steak sapi", matched_name: "Sapi panggang", portion_grams: 200, calories: 544, protein: 48, fat: 38, carbs: 0 },
      { input_name: "Brokoli", display_name: "Brokoli", matched_name: "Brokoli kukus", portion_grams: 100, calories: 35, protein: 2.4, fat: 0.4, carbs: 7 },
      { input_name: "Kentang tumbuk", display_name: "Kentang tumbuk", matched_name: "Kentang tumbuk", portion_grams: 150, calories: 174, protein: 3, fat: 7, carbs: 24 },
    ],
    totalCalories: 753,
    totalProtein: 53.4,
    totalFat: 45.4,
    totalCarbs: 31,
    scanDate: "2026-03-12T19:45:00Z",
  },
];
