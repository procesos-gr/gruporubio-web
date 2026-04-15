'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const t = useTranslations("Index");
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: t("faq_1_q"), a: t("faq_1_a") },
    { q: t("faq_2_q"), a: t("faq_2_a") },
    { q: t("faq_3_q"), a: t("faq_3_a") },
    { q: t("faq_4_q"), a: t("faq_4_a") },
    { q: t("faq_5_q"), a: t("faq_5_a") },
  ];

  return (
    <section className="w-full py-24 bg-white border-y border-border">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight sticky top-32">
              {t("faq_title")}
            </h2>
          </div>
          
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = open === idx;
              
              return (
                <div 
                  key={idx} 
                  className={`border rounded-xl transition-colors duration-200 ${isOpen ? 'bg-[#EEF4FB] border-blue-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-6">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
