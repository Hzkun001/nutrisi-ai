import { motion } from "framer-motion";
import { Leaf, Brain, Shield, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const AboutPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="pt-20 pb-16 px-4 flex-1">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 border border-primary/15 px-3 py-1 text-[11px] font-medium text-primary mb-5">
            <Leaf className="h-3 w-3" />
            About FoodVision
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-3">
            Making nutrition <span className="gradient-text-primary">accessible</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            We believe understanding what you eat shouldn't require a degree in nutrition science. Our AI-powered scanner makes it effortless.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: Brain, title: "AI-First", desc: "Built on state-of-the-art computer vision models" },
            { icon: Zap, title: "Instant", desc: "Get nutrition data in seconds, not minutes" },
            { icon: Shield, title: "Private", desc: "Your food images are never stored or shared" },
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
      </div>
    </main>
    <Footer />
  </div>
);

export default AboutPage;
