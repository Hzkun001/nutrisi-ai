import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color: "calories" | "protein" | "fat" | "carbs";
  index?: number;
}

const colorMap = {
  calories: "text-stat-calories",
  protein: "text-stat-protein",
  fat: "text-stat-fat",
  carbs: "text-stat-carbs",
};

const dotMap = {
  calories: "bg-stat-calories",
  protein: "bg-stat-protein",
  fat: "bg-stat-fat",
  carbs: "bg-stat-carbs",
};

const StatCard = ({ label, value, unit, color, index = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07, duration: 0.3 }}
    className="bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm"
  >
    <div className="flex items-center gap-2 mb-2">
      <div className={`h-1.5 w-1.5 rounded-full ${dotMap[color]}`} />
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className={`text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight ${colorMap[color]}`}>{value}</span>
      {unit && <span className="text-sm text-gray-400 font-bold">{unit}</span>}
    </div>
  </motion.div>
);

export default StatCard;
