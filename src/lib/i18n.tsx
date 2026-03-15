import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Locale = "id" | "en";

type Dictionary = Record<string, string>;

const messages: Record<Locale, Dictionary> = {
  id: {
    "locale.id": "ID",
    "locale.en": "EN",

    "navbar.scan": "Scan",
    "navbar.history": "Riwayat",
    "navbar.about": "Tentang",
    "navbar.menuOpen": "Buka menu navigasi",
    "navbar.menuClose": "Tutup menu navigasi",

    "footer.description": "Analisis gizi makanan berbasis AI. Bantu Anda lebih paham apa yang dikonsumsi setiap hari.",
    "footer.product": "Produk",
    "footer.product.scan": "Scan Makanan",
    "footer.product.history": "Riwayat Analisis",
    "footer.product.api": "API (Segera)",
    "footer.company": "Perusahaan",
    "footer.company.about": "Tentang Kami",
    "footer.company.blog": "Blog (Segera)",
    "footer.company.career": "Karier (Segera)",
    "footer.legal": "Legal",
    "footer.legal.privacy": "Privasi",
    "footer.legal.terms": "Syarat Layanan",
    "footer.legal.contact": "Kontak",
    "footer.copyright": "© 2026 Nutrisi AI. Semua hak dilindungi.",

    "landing.badge": "Asisten Gizi Berbasis AI",
    "landing.title.1": "Analisis Nutrisi",
    "landing.title.2": "Untuk Kesempurnaan Gizi",
    "landing.description": "Unggah foto sarapan, makan siang, atau camilan. Nutrisi AI akan membantu memperkirakan kalori, protein, lemak, dan karbohidrat dengan cepat dan mudah dipahami.",
    "landing.cta.primary": "Mulai Scan Sekarang",
    "landing.cta.secondary": "Lihat Cara Kerja",
    "landing.heroAlt": "Nutrisi AI menganalisis sepiring makanan",
    "landing.how.title": "Cara Kerja Nutrisi AI",
    "landing.how.description": "Hanya 3 langkah sederhana untuk memahami isi gizi makananmu",
    "landing.how.step1.title": "Unggah foto makanan",
    "landing.how.step1.desc": "Tarik foto ke area upload atau pilih dari galeri.",
    "landing.how.step2.title": "AI menganalisis gambar",
    "landing.how.step2.desc": "Sistem mengenali jenis makanan secara otomatis.",
    "landing.how.step3.title": "Lihat hasil gizinya",
    "landing.how.step3.desc": "Dapatkan estimasi kalori, protein, lemak, dan karbohidrat.",
    "landing.features.title": "Kenapa Pilih Nutrisi AI?",
    "landing.features.description": "Dirancang supaya mudah dipakai semua kalangan",
    "landing.features.f1.title": "Deteksi Makanan Otomatis",
    "landing.features.f1.desc": "AI mengenali isi piring dari berbagai sudut foto.",
    "landing.features.f2.title": "Estimasi Gizi Cepat",
    "landing.features.f2.desc": "Kalori dan makro langsung ditampilkan dalam hitungan detik.",
    "landing.features.f3.title": "Riwayat Scan Harian",
    "landing.features.f3.desc": "Simpan hasil scan untuk melihat pola makan dari waktu ke waktu.",
    "landing.features.f4.title": "Tampilan Mudah Dibaca",
    "landing.features.f4.desc": "Ringkasan nutrisi disajikan ringkas, jelas, dan tidak membingungkan.",
    "landing.preview.title": "Contoh Hasil Scan",
    "landing.preview.description": "Gambaran hasil analisis makanan secara real-time",
    "landing.preview.labels": "Label Terdeteksi",
    "landing.preview.items": "Item Makanan",
    "landing.preview.summary": "Ringkasan Nutrisi",
    "landing.final.title": "Siap mulai hidup lebih sadar gizi?",
    "landing.final.description": "Yuk, mulai dari satu foto makanan hari ini. Gratis, cepat, dan mudah digunakan.",
    "landing.final.button": "Mulai Scan Gratis",

    "about.badge": "Tentang Nutrisi AI",
    "about.title.1": "Membuat informasi gizi",
    "about.title.2": "lebih mudah dipahami",
    "about.description": "Kami percaya memahami makanan sehari-hari tidak harus rumit. Cukup unggah foto, lalu Nutrisi AI membantu memberi gambaran nilai gizinya secara cepat.",
    "about.card1.title": "Berbasis AI",
    "about.card1.desc": "Menggunakan model computer vision untuk mengenali makanan.",
    "about.card2.title": "Cepat",
    "about.card2.desc": "Hasil estimasi gizi muncul dalam hitungan detik.",
    "about.card3.title": "Privat",
    "about.card3.desc": "Foto makanan Anda tidak dibagikan ke publik.",
    "about.extra.audience.title": "Nutrisi AI cocok untuk siapa?",
    "about.extra.audience.desc": "Cocok untuk pelajar, pekerja, orang tua, maupun siapa saja yang ingin mulai memperhatikan pola makan tanpa istilah gizi yang rumit.",
    "about.extra.note.title": "Catatan penting",
    "about.extra.note.desc": "Hasil yang ditampilkan adalah estimasi berbasis foto dan porsi standar. Untuk kebutuhan medis atau diet khusus, tetap konsultasikan dengan ahli gizi atau tenaga kesehatan.",

    "scanner.title": "Pemindai Makanan AI",
    "scanner.description": "Unggah foto makanan Anda, lalu dapatkan estimasi gizi secara instan dengan bantuan AI.",
    "scanner.empty.title": "Menunggu Gambar",
    "scanner.empty.desc": "Unggah foto makanan di sebelah kiri lalu klik Analisis untuk melihat estimasi gizinya.",
    "scanner.labels": "Label Terdeteksi",
    "scanner.foods": "Makanan Terdeteksi",
    "scanner.unmatched": "Label yang belum cocok di database:",
    "scanner.error": "Terjadi kesalahan saat menganalisis gambar.",

    "upload.title": "Unggah Gambar",
    "upload.subtitle": "JPG, PNG, atau WebP (Maks 10MB)",
    "upload.drop.title": "Taruh foto makanan di sini",
    "upload.drop.desc": "atau klik untuk pilih file",
    "upload.previewAlt": "Pratinjau makanan",
    "upload.button": "Analisis Nutrisi",
    "upload.loading.title": "Sedang menganalisis...",
    "upload.loading.desc": "AI sedang membaca isi makanan pada foto Anda",

    "history.title": "Riwayat Scan",
    "history.description": "Lihat semua hasil scan makanan Anda sebelumnya",
    "history.loading": "Memuat riwayat...",
    "history.empty.title": "Belum ada scan",
    "history.empty.desc": "Unggah foto makanan pertama Anda untuk melihat hasilnya di sini.",
    "history.header.image": "Gambar",
    "history.header.file": "Nama File",
    "history.header.calories": "Kalori",
    "history.header.date": "Tanggal",
    "history.view": "Lihat",

    "detail.back": "Kembali ke Riwayat",
    "detail.loading": "Memuat detail scan...",
    "detail.meta.id": "ID Scan",
    "detail.meta.image": "Gambar",
    "detail.meta.date": "Tanggal",
    "detail.meta.foods": "Makanan",
    "detail.item": "item",
    "detail.labels": "Label Terdeteksi",
    "detail.foods": "Makanan Terdeteksi",
    "detail.noFoods": "Tidak ada makanan yang terdeteksi.",

    "summary.title": "Ringkasan Nutrisi",
    "summary.source": "Sumber data: Kaggle (Indonesian Food and Drink Nutrition)",

    "stat.calories": "Kalori",
    "stat.protein": "Protein",
    "stat.fat": "Lemak",
    "stat.carbs": "Karbo",

    "food.unknown": "Makanan tidak dikenal",
    "food.metric.cal": "Kal",
    "food.metric.pro": "Pro",
    "food.metric.fat": "Lem",
    "food.metric.carb": "Karb",

    "notfound.title": "Ups! Halaman tidak ditemukan",
    "notfound.back": "Kembali ke Beranda",
  },
  en: {
    "locale.id": "ID",
    "locale.en": "EN",

    "navbar.scan": "Scan",
    "navbar.history": "History",
    "navbar.about": "About",
    "navbar.menuOpen": "Open navigation menu",
    "navbar.menuClose": "Close navigation menu",

    "footer.description": "AI-powered food nutrition analysis. Helps you better understand your daily intake.",
    "footer.product": "Product",
    "footer.product.scan": "Food Scanner",
    "footer.product.history": "Scan History",
    "footer.product.api": "API (Soon)",
    "footer.company": "Company",
    "footer.company.about": "About Us",
    "footer.company.blog": "Blog (Soon)",
    "footer.company.career": "Careers (Soon)",
    "footer.legal": "Legal",
    "footer.legal.privacy": "Privacy",
    "footer.legal.terms": "Terms",
    "footer.legal.contact": "Contact",
    "footer.copyright": "© 2026 Nutrisi AI. All rights reserved.",

    "landing.badge": "AI Nutrition Assistant",
    "landing.title.1": "Just snap your meal",
    "landing.title.2": "and get nutrition results instantly.",
    "landing.description": "Upload a breakfast, lunch, or snack photo. Nutrisi AI estimates calories, protein, fat, and carbs in a way that is easy to understand.",
    "landing.cta.primary": "Start Scanning",
    "landing.cta.secondary": "See How It Works",
    "landing.heroAlt": "Nutrisi AI analyzing a plate of food",
    "landing.how.title": "How Nutrisi AI Works",
    "landing.how.description": "Three simple steps to understand your nutrition",
    "landing.how.step1.title": "Upload a food photo",
    "landing.how.step1.desc": "Drag and drop or select an image from your gallery.",
    "landing.how.step2.title": "AI analyzes the image",
    "landing.how.step2.desc": "The system identifies food items automatically.",
    "landing.how.step3.title": "See nutrition results",
    "landing.how.step3.desc": "Get estimated calories, protein, fat, and carbs.",
    "landing.features.title": "Why Nutrisi AI?",
    "landing.features.description": "Designed to be easy for everyone",
    "landing.features.f1.title": "Automatic Food Detection",
    "landing.features.f1.desc": "AI recognizes plate contents from different photo angles.",
    "landing.features.f2.title": "Fast Nutrition Estimate",
    "landing.features.f2.desc": "Calories and macros are shown in seconds.",
    "landing.features.f3.title": "Daily Scan History",
    "landing.features.f3.desc": "Keep your scan records and track your eating patterns.",
    "landing.features.f4.title": "Easy-to-Read Results",
    "landing.features.f4.desc": "Nutrition summary is concise, clear, and practical.",
    "landing.preview.title": "Scan Result Preview",
    "landing.preview.description": "A real-time example of food analysis output",
    "landing.preview.labels": "Detected Labels",
    "landing.preview.items": "Food Items",
    "landing.preview.summary": "Nutrition Summary",
    "landing.final.title": "Ready to eat smarter?",
    "landing.final.description": "Start with one food photo today. Free, fast, and easy to use.",
    "landing.final.button": "Start Free Scan",

    "about.badge": "About Nutrisi AI",
    "about.title.1": "Making nutrition information",
    "about.title.2": "easier to understand",
    "about.description": "We believe understanding your daily meals should not be complicated. Upload a photo and Nutrisi AI helps provide a quick nutrition estimate.",
    "about.card1.title": "AI-Powered",
    "about.card1.desc": "Built with computer vision models for food recognition.",
    "about.card2.title": "Fast",
    "about.card2.desc": "Get nutrition estimates in seconds.",
    "about.card3.title": "Private",
    "about.card3.desc": "Your food images are not shared publicly.",
    "about.extra.audience.title": "Who is Nutrisi AI for?",
    "about.extra.audience.desc": "Great for students, workers, parents, and anyone who wants to improve eating habits without complex nutrition terms.",
    "about.extra.note.title": "Important note",
    "about.extra.note.desc": "Results are estimates based on photos and standard portions. For medical needs or specific diets, consult a nutrition professional.",

    "scanner.title": "AI Food Scanner",
    "scanner.description": "Upload your meal photo and get an instant nutrition estimate.",
    "scanner.empty.title": "Waiting for an Image",
    "scanner.empty.desc": "Upload a food image on the left, then click Analyze to view nutrition results.",
    "scanner.labels": "Detected Labels",
    "scanner.foods": "Detected Foods",
    "scanner.unmatched": "Labels not matched in database:",
    "scanner.error": "Something went wrong while analyzing the image.",

    "upload.title": "Upload Image",
    "upload.subtitle": "JPG, PNG, or WebP (Max 10MB)",
    "upload.drop.title": "Drop your food image here",
    "upload.drop.desc": "or click to browse files",
    "upload.previewAlt": "Food preview",
    "upload.button": "Analyze Nutrition",
    "upload.loading.title": "Analyzing...",
    "upload.loading.desc": "AI is reading the food in your photo",

    "history.title": "Scan History",
    "history.description": "View all your previous food scans",
    "history.loading": "Loading history...",
    "history.empty.title": "No scans yet",
    "history.empty.desc": "Upload your first food image to see results here.",
    "history.header.image": "Image",
    "history.header.file": "Filename",
    "history.header.calories": "Calories",
    "history.header.date": "Date",
    "history.view": "View",

    "detail.back": "Back to History",
    "detail.loading": "Loading scan details...",
    "detail.meta.id": "Scan ID",
    "detail.meta.image": "Image",
    "detail.meta.date": "Date",
    "detail.meta.foods": "Foods",
    "detail.item": "items",
    "detail.labels": "Detected Labels",
    "detail.foods": "Detected Foods",
    "detail.noFoods": "No foods detected.",

    "summary.title": "Nutrition Summary",
    "summary.source": "Data source: Kaggle (Indonesian Food and Drink Nutrition)",

    "stat.calories": "Calories",
    "stat.protein": "Protein",
    "stat.fat": "Fat",
    "stat.carbs": "Carbs",

    "food.unknown": "Unknown food",
    "food.metric.cal": "Cal",
    "food.metric.pro": "Pro",
    "food.metric.fat": "Fat",
    "food.metric.carb": "Carb",

    "notfound.title": "Oops! Page not found",
    "notfound.back": "Return to Home",
  },
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: string) => string;
};

const STORAGE_KEY = "nutrisi_ai_locale";

const I18nContext = createContext<I18nContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "id";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "en" ? "en" : "id";
  });

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: string) => messages[locale][key] ?? messages.id[key] ?? key;
    const set = (next: Locale) => {
      setLocale(next);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
    };

    return { locale, setLocale: set, t };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
};
