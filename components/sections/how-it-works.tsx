import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export function HowItWorks() {
  const t = useTranslations("Index");

  const steps = [
    { num: "01", title: t("hiw_step1_title"), desc: t("hiw_step1_desc") },
    { num: "02", title: t("hiw_step2_title"), desc: t("hiw_step2_desc") },
    { num: "03", title: t("hiw_step3_title"), desc: t("hiw_step3_desc") },
  ];

  return (
    <section className="w-full py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {t("hiw_title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting arrow for desktop */}
          <div className="hidden md:block absolute top-[40%] left-[20%] w-[60%] h-px bg-primary/20 -z-10" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center p-6 bg-white rounded-2xl group">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-8xl font-black text-primary/10 select-none transition-transform group-hover:scale-110 duration-500">
                {step.num}
              </div>
              <div className="relative z-10 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg ring-8 ring-white mb-6">
                {idx + 1}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-xs">{step.desc}</p>
              
              {/* Arrow linking to next step on mobile only, hidden on desktop since we have the line */}
              {idx < steps.length - 1 && (
                <div className="md:hidden mt-8 text-primary/40">
                  <ArrowRight className="w-8 h-8 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
