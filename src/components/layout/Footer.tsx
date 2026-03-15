import { Leaf } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-200 mt-auto bg-white">
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3 group">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-cyan-400 text-white flex items-center justify-center shadow-sm">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-gray-900">Nutrisi AI</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px] mx-auto md:mx-0">
              {t("footer.description")}
            </p>
          </div>

          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center md:text-left">
            {[
              {
                title: t("footer.product"),
                links: [t("footer.product.scan"), t("footer.product.history"), t("footer.product.api")],
              },
              {
                title: t("footer.company"),
                links: [t("footer.company.about"), t("footer.company.blog"), t("footer.company.career")],
              },
              {
                title: t("footer.legal"),
                links: [t("footer.legal.privacy"), t("footer.legal.terms"), t("footer.legal.contact")],
              },
            ].map((section, index) => (
              <div
                key={section.title}
                className={index === 2 ? "col-span-2 md:col-span-1" : ""}
              >
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-100 mt-8 pt-5 text-center">
          <p className="text-[11px] text-gray-400">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
