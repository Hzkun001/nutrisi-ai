import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Clock, Image as ImageIcon, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import EmptyStateCard from "@/components/shared/EmptyStateCard";
import { Button } from "@/components/ui/button";
import { fetchHistory } from "@/lib/api";
import type { HistoryScan } from "@/lib/types";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [scans, setScans] = useState<HistoryScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory()
      .then(setScans)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-12 md:pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold">Scan History</h1>
            <p className="text-sm text-muted-foreground mt-0.5">View all your past food scans</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading history…</span>
            </div>
          ) : error ? (
            <div className="glass-panel rounded-xl px-5 py-4 text-sm text-destructive">
              ⚠️ {error}
            </div>
          ) : scans.length === 0 ? (
            <EmptyStateCard
              icon={Clock}
              title="No scans yet"
              description="Upload your first food image to see it here."
            />
          ) : (
            <div className="glass-panel rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-[auto_1fr_100px_140px_72px] gap-4 px-4 py-2.5 border-b border-border/50 section-label">
                <span className="w-10">Image</span>
                <span>Filename</span>
                <span className="text-right">Calories</span>
                <span className="text-right">Date</span>
                <span />
              </div>

              {/* Rows */}
              {scans.map((scan, i) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/history/${scan.id}`)}
                  className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_100px_140px_72px] gap-3 md:gap-4 px-4 py-3 items-center border-b border-border/30 last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{scan.original_filename}</p>
                    <p className="text-xs text-muted-foreground md:hidden mt-0.5">
                      {scan.total_calories} kcal · {new Date(scan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="hidden md:block text-sm text-right text-stat-calories font-semibold tabular-nums">
                    {scan.total_calories} kcal
                  </span>
                  <span className="hidden md:block text-[13px] text-right text-muted-foreground">
                    {new Date(scan.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <div className="hidden md:flex justify-end">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs h-7 px-2">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
