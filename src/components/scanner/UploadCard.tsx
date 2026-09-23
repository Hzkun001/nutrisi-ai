import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, Loader2, Sparkles, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

type UploadState = "empty" | "preview" | "loading";

interface UploadCardProps {
  onAnalyze?: (file: File, model?: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

const UploadCard = ({ onAnalyze, isLoading = false, error }: UploadCardProps) => {
  const { t } = useLanguage();
  const [state, setState] = useState<UploadState>("empty");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("qwen/qwen3.8-27b");

  const displayState: UploadState = isLoading ? "loading" : state;

  const handleFile = useCallback((file: File) => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setSelectedFile(file);
    setState("preview");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  }, [handleFile]);

  const handleSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }, [handleFile]);

  const handleAnalyze = () => {
    if (selectedFile) {
      onAnalyze?.(selectedFile, selectedModel);
    }
  };

  const handleClear = () => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setSelectedFile(null);
    setState("empty");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-50 to-cyan-50 flex flex-shrink-0 items-center justify-center border border-gray-100">
          <Upload className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">{t("upload.title")}</h2>
          <p className="text-xs text-gray-500">{t("upload.subtitle")}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {displayState === "empty" && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[220px] sm:min-h-[280px] lg:min-h-[360px]"
          >
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-gray-200 hover:border-green-400 p-6 sm:p-8 lg:p-10 cursor-pointer transition-all duration-300 group bg-gray-50 hover:bg-green-50/50 min-h-[220px] sm:min-h-[280px] lg:min-h-[360px] w-full"
            >
              <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center group-hover:border-green-200 group-hover:shadow-sm transition-all">
                <ImageIcon className="h-6 w-6 text-gray-400 group-hover:text-green-500 transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm sm:text-base font-bold text-gray-700">{t("upload.drop.title")}</p>
                <p className="text-sm text-gray-400 mt-1">{t("upload.drop.desc")}</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleSelect} />
            </label>
          </motion.div>
        )}

        {displayState === "preview" && previewUrl && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 aspect-[4/3] flex items-center justify-center p-2">
              <img src={previewUrl} alt={t("upload.previewAlt")} className="max-w-full max-h-full object-contain rounded-2xl shadow-sm" />
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 shadow-sm flex items-center justify-center transition-colors border border-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* AI Vision Model Selector */}
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3.5 space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-800">
                  <Sparkles className="h-3.5 w-3.5 text-green-600" />
                  {t("upload.model")}
                </span>
                <span className="text-[10px] text-green-700 bg-green-100/70 px-2 py-0.5 rounded font-semibold border border-green-200/50">
                  Vision AI
                </span>
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isLoading}
                className="w-full text-xs font-medium bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all cursor-pointer shadow-sm"
              >
                <optgroup label="Groq LPU Vision (Inference Ultra Cepat)">
                  <option value="qwen/qwen3.8-27b">Groq - Qwen 3.8 27B Vision (LPU Ultra Cepat ~0.1s)</option>
                </optgroup>
                <optgroup label="Google Gemini Vision">
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Default - Cepat & Akurat)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Stabil)</option>
                  <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite (Ringan)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Detail Kompleks)</option>
                </optgroup>
                <optgroup label="xAI Grok Vision">
                  <option value="grok-2-vision-1212">xAI - Grok 2 Vision 1212 (Multimodal Cerdas)</option>
                  <option value="grok-vision-beta">xAI - Grok Vision Beta (Eksperimental)</option>
                </optgroup>
              </select>
              <p className="text-[11px] text-gray-400 px-0.5">
                {t("upload.model.desc")}
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-100 p-4">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700 leading-snug font-medium">{error}</p>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              className="w-full gap-2 h-14 rounded-2xl bg-gradient-to-r from-green-600 to-cyan-500 hover:from-green-500 hover:to-cyan-400 text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border-0"
              disabled={isLoading}
            >
              <Sparkles className="h-5 w-5" />
              {t("upload.button")}
            </Button>
          </motion.div>
        )}

        {displayState === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-6 py-20 bg-gray-50 rounded-3xl border border-gray-100"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 animate-pulse" />
              <Loader2 className="h-12 w-12 text-green-600 animate-spin relative z-10" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900 mb-1">{t("upload.loading.title")}</p>
              <p className="text-sm text-gray-500 animate-pulse">{t("upload.loading.desc")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadCard;
