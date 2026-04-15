import { useTranslations } from "next-intl";
import { Sparkles, Bug, Wind, ArrowUpToLine, Layers, AlertTriangle } from "lucide-react";

export function ServicesGrid() {
  const t = useTranslations("Index");

  const services = [
    {
      icon: Sparkles,
      title: t("services_cleaning_title"),
      description: t("services_cleaning_desc"),
      color: "text-blue-600",
      bgUrl: "bg-blue-50"
    },
    {
      icon: Bug,
      title: t("services_plagues_title"),
      description: t("services_plagues_desc"),
      color: "text-emerald-600",
      bgUrl: "bg-emerald-50"
    },
    {
      icon: Wind,
      title: t("services_ozone_title"),
      description: t("services_ozone_desc"),
      color: "text-cyan-600",
      bgUrl: "bg-cyan-50"
    },
    {
      icon: ArrowUpToLine,
      title: t("services_height_title"),
      description: t("services_height_desc"),
      color: "text-indigo-600",
      bgUrl: "bg-indigo-50"
    },
    {
      icon: Layers,
      title: t("services_floors_title"),
      description: t("services_floors_desc"),
      color: "text-amber-600",
      bgUrl: "bg-amber-50"
    },
    {
      icon: AlertTriangle,
      title: t("services_special_title"),
      description: t("services_special_desc"),
      color: "text-rose-600",
      bgUrl: "bg-rose-50"
    }
  ];

  return (
    <section id="servicios" className="w-full py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {t("services_title")}
          </h2>
          <div className="mt-4 h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="group relative p-8 bg-white border border-border rounded-[10px] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-500`} />
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${service.bgUrl} ring-1 ring-black/5`}>
                  <Icon className={`w-7 h-7 ${service.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
