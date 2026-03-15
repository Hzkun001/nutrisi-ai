import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scan, Clock, Info, Leaf, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();

  const navLinks = [
    { to: "/scan", label: t("navbar.scan"), icon: Scan },
    { to: "/history", label: t("navbar.history"), icon: Clock },
    { to: "/about", label: t("navbar.about"), icon: Info },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActiveLink = (to: string) => (
    location.pathname === to || location.pathname.startsWith(`${to}/`)
  );

  return (
    <header className="fixed top-2 left-0 right-0 z-50 px-3 sm:px-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex h-14 items-center justify-between rounded-full bg-white/70 backdrop-blur-xl border border-gray-200/50 px-4 sm:px-6 shadow-sm">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-cyan-400 text-white shadow-sm transition-transform group-hover:scale-105 shrink-0">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-gray-900 truncate">
              Nutrisi AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-4 py-2 text-[14px] font-medium transition-colors rounded-full"
                >
                  <span className={`relative z-10 flex items-center gap-2 ${isActive ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-900"}`}>
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-gray-100 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden h-9 w-9 rounded-full border border-gray-200 bg-white/90 text-gray-700 flex items-center justify-center"
            aria-label={mobileOpen ? t("navbar.menuClose") : t("navbar.menuOpen")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div className="hidden md:flex items-center rounded-full bg-gray-100 p-1 border border-gray-200">
            {(["id", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLocale(lang)}
                className={`h-7 px-2.5 rounded-full text-[11px] font-semibold transition-colors ${
                  locale === lang ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {t(`locale.${lang}`)}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden mt-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-200/70 shadow-lg p-2"
            >
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-1 flex items-center gap-2 px-1 py-1">
                {(["id", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLocale(lang)}
                    className={`h-8 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                      locale === lang
                        ? "bg-gray-100 text-gray-900 border-gray-200"
                        : "bg-white text-gray-500 border-gray-200 hover:text-gray-900"
                    }`}
                  >
                    {t(`locale.${lang}`)}
                  </button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
