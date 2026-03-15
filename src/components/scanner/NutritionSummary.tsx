import { Info } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { useLanguage } from "@/lib/i18n";

interface NutritionSummaryProps {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

const NutritionSummary = ({ calories, protein, fat, carbs }: NutritionSummaryProps) => {
  const { t } = useLanguage();

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
        {t("summary.title")}
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label={t("stat.calories")} value={calories} unit="kcal" color="calories" index={0} />
        <StatCard label={t("stat.protein")} value={protein} unit="g" color="protein" index={1} />
        <StatCard label={t("stat.fat")} value={fat} unit="g" color="fat" index={2} />
        <StatCard label={t("stat.carbs")} value={carbs} unit="g" color="carbs" index={3} />
      </div>
      <div className="flex items-start sm:items-center gap-2 mt-4 text-xs text-gray-400">
        <Info className="h-4 w-4 shrink-0" />
        <span>{t("summary.source")}</span>
      </div>
    </div>
  );
};

export default NutritionSummary;
