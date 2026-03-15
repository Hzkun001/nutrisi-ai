import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import UploadCard from "@/components/scanner/UploadCard";
import FoodResultCard from "@/components/scanner/FoodResultCard";
import NutritionSummary from "@/components/scanner/NutritionSummary";
import LabelBadge from "@/components/scanner/LabelBadge";
import LoadingState from "@/components/shared/LoadingState";
import EmptyStateCard from "@/components/shared/EmptyStateCard";
import { Scan as ScanIcon, AlertTriangle } from "lucide-react";
import { analyzeImage } from "@/lib/api";
import type { ScanResult } from "@/lib/types";

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const result = await analyzeImage(file);
      setScanResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menganalisis gambar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[360px] h-[360px] md:w-[500px] md:h-[500px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[420px] h-[420px] md:w-[600px] md:h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />
      <main className="relative z-10 pt-24 md:pt-28 pb-12 md:pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 md:mb-10 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight mb-2.5 md:mb-3 text-gray-900">
              AI Food Scanner
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">Upload a photo of your meal and get an instant AI nutrition estimate powered by advanced vision models.</p>
          </div>

          <div className="grid xl:grid-cols-[380px_1fr] gap-6 lg:gap-8">
            {/* Left — Upload */}
            <div>
              <UploadCard
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                error={error}
              />
            </div>

            {/* Right — Results */}
            <div>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingState />
                  </motion.div>
                ) : !scanResult ? (
                  <EmptyStateCard
                    key="empty"
                    icon={ScanIcon}
                    title="Awaiting Image"
                    description="Upload a food image on the left and click Analyze to reveal nutrition metrics."
                  />
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Labels */}
                    <div className="p-5 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-5">Detected Labels</h3>
                      <div className="flex flex-wrap gap-2">
                        {scanResult.vision_labels.map((l, i) => <LabelBadge key={l} label={l} index={i} />)}
                      </div>
                    </div>

                    {/* Foods */}
                    <div className="p-5 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-5">Detected Foods</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {scanResult.detected_foods.map((f, i) => <FoodResultCard key={f.input_name} food={f} index={i} />)}
                      </div>
                    </div>

                    {/* Unmatched Labels Notice */}
                    {scanResult.unmatched_labels?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start gap-3 sm:gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 sm:px-5 py-4 backdrop-blur-sm"
                      >
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-amber-400 mb-2">
                            Mismatched Database Entries:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {scanResult.unmatched_labels.map((label) => (
                              <span
                                key={label}
                                className="inline-block rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Summary */}
                    <div className="p-5 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
                      <NutritionSummary
                        calories={scanResult.total.calories}
                        protein={scanResult.total.protein}
                        fat={scanResult.total.fat}
                        carbs={scanResult.total.carbs}
                      />
                    </div>

                    {/* Note */}
                    {scanResult.note && (
                      <p className="text-sm text-gray-500 flex items-center gap-2 px-4">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500" />
                        {scanResult.note}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScannerPage;
