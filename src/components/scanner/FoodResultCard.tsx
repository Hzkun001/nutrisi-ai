import { motion } from "framer-motion";
import type { DetectedFood } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

interface FoodResultCardProps {
  food: DetectedFood;
  index?: number;
}

const FoodResultCard = ({ food, index = 0 }: FoodResultCardProps) => {
  const { t } = useLanguage();
  // Defensive fallbacks for older DB records that may have different field shapes
  const displayName = food.display_name || food.input_name || t("food.unknown");
  const matchedName = food.matched_name || "";
  const portionGrams = food.portion_grams ?? 100;
  const calories = Math.round(food.calories ?? 0);
  const protein = typeof food.protein === "number" ? food.protein.toFixed(1) : "0";
  const fat = typeof food.fat === "number" ? food.fat.toFixed(1) : "0";
  const carbs = typeof food.carbs === "number" ? food.carbs.toFixed(1) : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 hover-lift shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0">
          <h4 className="font-bold text-base leading-snug truncate text-gray-900">{displayName}</h4>
          {matchedName && (
            <p className="text-xs text-gray-500 mt-1 truncate">{matchedName}</p>
          )}
        </div>
        <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-md font-bold ml-3 shrink-0 border border-green-100">
          {portionGrams} g
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {[
          { label: t("food.metric.cal"), value: calories, color: "text-stat-calories" },
          { label: t("food.metric.pro"), value: `${protein}g`, color: "text-stat-protein" },
          { label: t("food.metric.fat"), value: `${fat}g`, color: "text-stat-fat" },
          { label: t("food.metric.carb"), value: `${carbs}g`, color: "text-stat-carbs" },
        ].map((item) => (
          <div key={item.label} className="text-center py-2 rounded-xl bg-gray-50 border border-gray-100">
            <p className={`text-sm font-bold tabular-nums ${item.color}`}>{item.value}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-semibold">{item.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FoodResultCard;
