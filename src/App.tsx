import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/public/Landing";
import ScannerPage from "./pages/scanner/ScannerPage";
import HistoryPage from "./pages/history/HistoryPage";
import ScanDetailPage from "./pages/scanner/ScanDetailPage";
import AboutPage from "./pages/public/AboutPage";
import NotFound from "./pages/public/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/scan" element={<ScannerPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<ScanDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
