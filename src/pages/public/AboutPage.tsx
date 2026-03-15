import { motion } from "framer-motion";
import { Leaf, Brain, Shield, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/lib/i18n";

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="pt-20 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 border border-primary/15 px-3 py-1 text-[11px] font-medium text-primary mb-5">
              <Leaf className="h-3 w-3" />
              {t("about.badge")}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-3">
              {t("about.title.1")} <span className="gradient-text-primary">{t("about.title.2")}</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              {t("about.description")}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: Brain, title: t("about.card1.title"), desc: t("about.card1.desc") },
              { icon: Zap, title: t("about.card2.title"), desc: t("about.card2.desc") },
              { icon: Shield, title: t("about.card3.title"), desc: t("about.card3.desc") },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="glass-panel rounded-xl p-5 text-center"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/8 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-panel rounded-xl p-5 sm:p-6 mt-4"
          >
            <h2 className="text-sm font-semibold mb-2">{t("about.extra.audience.title")}</h2>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {t("about.extra.audience.desc")}
            </p>
            <h3 className="text-sm font-semibold mb-2">{t("about.extra.note.title")}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("about.extra.note.desc")}
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
