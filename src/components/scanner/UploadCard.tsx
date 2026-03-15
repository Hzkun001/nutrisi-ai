import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, Loader2, Sparkles, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type UploadState = "empty" | "preview" | "loading";

interface UploadCardProps {
  onAnalyze?: (file: File) => void;
  isLoading?: boolean;
  error?: string | null;
}

const UploadCard = ({ onAnalyze, isLoading = false, error }: UploadCardProps) => {
  const [state, setState] = useState<UploadState>("empty");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const displayState: UploadState = isLoading ? "loading" : state;

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
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
  }, [handleFile]);

  const handleAnalyze = () => {
    if (selectedFile) {
      onAnalyze?.(selectedFile);
    }
  };

  const handleClear = () => {
    setState("empty");
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-6 h-full shadow-lg">
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-50 to-cyan-50 flex flex-shrink-0 items-center justify-center border border-gray-100">
          <Upload className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">Upload Image</h2>
          <p className="text-xs text-gray-500">JPG, PNG, or WebP (Max 10MB)</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {displayState === "empty" && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full min-h-[320px] sm:min-h-[400px]"
          >
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-gray-200 hover:border-green-400 p-6 sm:p-10 lg:p-12 cursor-pointer transition-all duration-300 group bg-gray-50 hover:bg-green-50/50 h-full w-full"
            >
              <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center group-hover:border-green-200 group-hover:shadow-sm transition-all">
                <ImageIcon className="h-6 w-6 text-gray-400 group-hover:text-green-500 transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm sm:text-base font-bold text-gray-700">Drop your food image here</p>
                <p className="text-sm text-gray-400 mt-1">or click to browse files</p>
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
              <img src={previewUrl} alt="Food preview" className="max-w-full max-h-full object-contain rounded-2xl shadow-sm" />
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 shadow-sm flex items-center justify-center transition-colors border border-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
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
              Analyze Nutrition
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
              <p className="text-lg font-bold text-gray-900 mb-1">Analyzing...</p>
              <p className="text-sm text-gray-500 animate-pulse">Running AI Vision Models</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadCard;
