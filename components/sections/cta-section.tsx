import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function CtaSection() {
  const t = useTranslations("Index");

  return (
    <section className="w-full bg-primary py-20 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 lg:px-8 max-w-4xl text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
          {t("cta_title")}
        </h2>
        <p className="text-lg text-blue-100 mb-10 max-w-2xl">
          {t("cta_subtitle")}
        </p>
        <Link href="/contacto">
          <Button size="lg" className="bg-white text-primary hover:bg-gray-50 h-14 px-10 text-lg font-semibold rounded-[10px] shadow-xl">
            {t("cta_button")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
