import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Upload, Brain, BarChart3, Clock, PieChart, Scan } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatCard from "@/components/shared/StatCard";
import FoodResultCard from "@/components/scanner/FoodResultCard";
import LabelBadge from "@/components/scanner/LabelBadge";
import { mockFoods, mockLabels } from "@/lib/mock-data";
import heroImage from "@/assets/hero-food-scan.webp";
import { useLanguage } from "@/lib/i18n";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const previewLabelEnMap: Record<string, string> = {
  Nasi: "Rice",
  "Ayam goreng": "Fried chicken",
  Protein: "Protein",
  "Masakan Indonesia": "Indonesian cuisine",
  "Makan siang": "Lunch",
  Sehat: "Healthy",
};

const previewFoodEnMap: Record<string, string> = {
  "Ayam goreng": "Fried chicken",
  "Ayam goreng paha": "Fried chicken thigh",
  "Nasi putih": "White rice",
  Nasi: "Rice",
  "Telur goreng": "Fried egg",
  Ketimun: "Cucumber",
  "Tahu goreng": "Fried tofu",
};

const Landing = () => {
  const { t, locale } = useLanguage();
  const previewSectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: previewSectionRef,
    offset: ["start end", "end start"],
  });
  const previewScrollY = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [64, 28, -28, -64]),
    { stiffness: 120, damping: 26, mass: 0.45 },
  );
  const previewLabels = locale === "en"
    ? mockLabels.map((label) => previewLabelEnMap[label] ?? label)
    : mockLabels;
  const previewFoods = locale === "en"
    ? mockFoods.map((food) => ({
      ...food,
      input_name: previewFoodEnMap[food.input_name] ?? food.input_name,
      display_name: previewFoodEnMap[food.display_name] ?? food.display_name,
      matched_name: previewFoodEnMap[food.matched_name] ?? food.matched_name,
    }))
    : mockFoods;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 px-4 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] md:w-[800px] md:h-[800px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[340px] h-[340px] md:w-[500px] md:h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative z-10 mx-auto max-w-5xl">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/50 px-3.5 md:px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-600 mb-6 md:mb-8 shadow-sm">
              <Sparkles className="h-4 w-4 text-green-500" />
              {t("landing.badge")}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-5 md:mb-6 tracking-tight text-gray-900"
            >
              {t("landing.title.1")}{" "}
              <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-upscayl-gradient animate-gradient-shift bg-[length:200%_auto]">
                {t("landing.title.2")}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-normal"
            >
              {t("landing.description")}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button asChild size="lg" className="relative group overflow-hidden rounded-full px-8 h-12 sm:h-14 bg-gray-900 text-white hover:bg-gray-800 font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto">
                <Link to="/scan">
                  <span className="relative z-10 flex items-center gap-2">
                    <Scan className="h-4 w-4 sm:h-5 sm:w-5" />
                    {t("landing.cta.primary")}
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 h-12 sm:h-14 border-gray-200 bg-white text-gray-700 font-semibold text-sm sm:text-base shadow-sm transition-all w-full sm:w-auto hover:bg-gradient-to-r hover:from-green-400 hover:to-cyan-200 hover:text-white hover:border-transparent"
              >
                <a href="#demo">
                  {t("landing.cta.secondary")}
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative rounded-2xl overflow-hidden border border-gray-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] mx-auto max-w-4xl bg-white"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
            <img src={heroImage} alt={t("landing.heroAlt")} className="w-full h-auto object-cover" />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-4 relative">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-gray-900">{t("landing.how.title")}</h2>
            <p className="text-gray-500 text-base md:text-lg">{t("landing.how.description")}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: Upload, title: t("landing.how.step1.title"), desc: t("landing.how.step1.desc") },
              { step: "02", icon: Brain, title: t("landing.how.step2.title"), desc: t("landing.how.step2.desc") },
              { step: "03", icon: BarChart3, title: t("landing.how.step3.title"), desc: t("landing.how.step3.desc") },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-white border border-gray-100 rounded-3xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-3xl" />
                <span className="text-sm font-bold bg-clip-text text-transparent bg-upscayl-gradient tracking-widest">{item.step}</span>
                <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto my-6 border border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-8 w-8 text-gray-600 group-hover:text-green-500 transition-colors" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 px-4 border-t border-gray-100 relative bg-gradient-to-b from-transparent to-gray-50/50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-gray-900">{t("landing.features.title")}</h2>
            <p className="text-gray-500 text-base md:text-lg">{t("landing.features.description")}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Brain, title: t("landing.features.f1.title"), desc: t("landing.features.f1.desc") },
              { icon: BarChart3, title: t("landing.features.f2.title"), desc: t("landing.features.f2.desc") },
              { icon: Clock, title: t("landing.features.f3.title"), desc: t("landing.features.f3.desc") },
              { icon: PieChart, title: t("landing.features.f4.title"), desc: t("landing.features.f4.desc") },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex gap-4 sm:gap-5"
              >
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-50 to-cyan-50 flex flex-shrink-0 items-center justify-center border border-gray-100">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section
        id="demo"
        ref={previewSectionRef}
        className="py-16 md:py-24 px-4 border-t border-gray-100 bg-gray-50/50"
      >
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-gray-900">{t("landing.preview.title")}</h2>
            <p className="text-gray-500 text-base md:text-lg">{t("landing.preview.description")}</p>
          </motion.div>

          <div className="grid items-start md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-12">
            <motion.div style={{ y: previewScrollY }} className="space-y-6 md:pr-2 md:will-change-transform">
              <div className="p-5 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-5">{t("landing.preview.labels")}</h3>
                <div className="flex flex-wrap gap-2">
                  {previewLabels.map((l, i) => <LabelBadge key={l} label={l} index={i} />)}
                </div>
              </div>
              <div className="p-5 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-5">{t("landing.preview.items")}</h3>
                <div className="space-y-3">
                  {previewFoods.slice(0, 3).map((f, i) => <FoodResultCard key={f.input_name} food={f} index={i} />)}
                </div>
              </div>
            </motion.div>
            <div className="p-5 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm h-fit self-start md:sticky md:top-24">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">{t("landing.preview.summary")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard label={t("stat.calories")} value={520} unit="kcal" color="calories" index={0} />
                <StatCard label={t("stat.protein")} value={35} unit="g" color="protein" index={1} />
                <StatCard label={t("stat.fat")} value={18} unit="g" color="fat" index={2} />
                <StatCard label={t("stat.carbs")} value={60} unit="g" color="carbs" index={3} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-upscayl-gradient opacity-5 blur-[100px]" />
        <div className="container mx-auto max-w-2xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-100 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-12 shadow-2xl"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-gray-900">
              {t("landing.final.title")}
            </h2>
            <p className="text-gray-500 text-base md:text-lg mb-6 md:mb-8">
              {t("landing.final.description")}
            </p>
            <Button asChild size="lg" className="rounded-full px-6 sm:px-10 h-12 sm:h-14 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold text-sm sm:text-base shadow-lg transition-all hover:scale-105 hover:shadow-xl border-0 w-full sm:w-auto">
              <Link to="/scan">
                {t("landing.final.button")} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
