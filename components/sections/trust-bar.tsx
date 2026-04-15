import { useTranslations } from "next-intl";

export function TrustBar() {
  const t = useTranslations("Index");

  const stats = [
    { title: t("trust_years"), desc: t("trust_years_desc") },
    { title: t("trust_clients"), desc: t("trust_clients_desc") },
    { title: t("trust_coverage"), desc: t("trust_coverage_desc") },
    { title: t("trust_rating"), desc: t("trust_rating_desc") },
  ];

  return (
    <section className="w-full bg-slate-50 border-y border-border py-12">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
          {stats.map((stat, idx) => (
            <div key={idx} className={`flex flex-col items-center justify-center text-center ${idx === 0 ? '' : 'pl-8'}`}>
              <span className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
                {stat.title}
              </span>
              <span className="text-sm md:text-base font-medium text-gray-600">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
