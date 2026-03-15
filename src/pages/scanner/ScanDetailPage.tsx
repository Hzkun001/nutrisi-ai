import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, FileText, Hash, Image as ImageIcon, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import FoodResultCard from "@/components/scanner/FoodResultCard";
import NutritionSummary from "@/components/scanner/NutritionSummary";
import LabelBadge from "@/components/scanner/LabelBadge";
import { Button } from "@/components/ui/button";
import { fetchHistoryDetail } from "@/lib/api";
import type { HistoryScan } from "@/lib/types";

const ScanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [scan, setScan] = useState<HistoryScan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchHistoryDetail(id)
      .then(setScan)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-12 md:pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 mb-5 -ml-2 text-xs h-8">
            <Link to="/history">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to History
            </Link>
          </Button>

          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading scan…</span>
            </div>
          ) : error ? (
            <div className="glass-panel rounded-xl px-5 py-4 text-sm text-destructive">
              ⚠️ {error}
            </div>
          ) : scan ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Image placeholder */}
              <div className="glass-panel rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                  <span className="text-xs px-4 text-center break-all">{scan.original_filename}</span>
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  { icon: Hash, label: "Scan ID", value: `#${scan.id}` },
                  { icon: FileText, label: "Image", value: scan.original_filename },
                  { icon: Calendar, label: "Date", value: new Date(scan.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                  { icon: ImageIcon, label: "Foods", value: `${scan.detected_foods.length} items` },
                ].map((meta) => (
                  <div key={meta.label} className="glass-panel rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <meta.icon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{meta.label}</span>
                    </div>
                    <p className="text-[13px] font-medium truncate">{meta.value}</p>
                  </div>
                ))}
              </div>

              {/* Labels */}
              {scan.filtered_vision_labels?.length > 0 && (
                <div>
                  <h3 className="section-label mb-2.5">Detected Labels</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {scan.filtered_vision_labels.map((l, i) => <LabelBadge key={l} label={l} index={i} />)}
                  </div>
                </div>
              )}

              {/* Foods */}
              <div>
                <h3 className="section-label mb-2.5">Detected Foods</h3>
                {scan.detected_foods?.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {scan.detected_foods.map((f, i) => (
                      <FoodResultCard key={`${f.input_name}-${i}`} food={f} index={i} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada makanan yang terdeteksi.</p>
                )}
              </div>

              {/* Nutrition */}
              <NutritionSummary
                calories={scan.total_calories}
                protein={scan.total_protein}
                fat={scan.total_fat}
                carbs={scan.total_carbs}
              />
            </motion.div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default ScanDetailPage;
