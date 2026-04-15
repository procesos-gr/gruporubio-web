import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function FeaturesSplit() {
  const t = useTranslations("Index");

  const checks = [
    t("features_check1"),
    t("features_check2"),
    t("features_check3"),
    t("features_check4"),
    t("features_check5"),
    t("features_check6"),
  ];

  return (
    <section className="w-full py-24 bg-slate-50 border-t border-border">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Columna Izquierda: Texto */}
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
              {t("features_tag")}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              {t("features_title")}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              {t("features_desc")}
            </p>
            <Link href="/contacto">
              <Button size="lg" className="rounded-[10px] text-base h-14 px-8 shadow-lg shadow-primary/20">
                {t("features_cta")}
              </Button>
            </Link>
          </div>

          {/* Columna Derecha: Card de checks */}
          <div className="relative">
            {/* Background design elements */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
              <ul className="space-y-6">
                {checks.map((check, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                    </div>
                    <span className="ml-4 text-gray-700 font-medium">{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
