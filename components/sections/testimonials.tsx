'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export function Testimonials() {
  const t = useTranslations("Index");
  const [active, setActive] = useState(0);

  const testimonials = [
    {
      text: t("test_1_text"),
      author: t("test_1_author"),
      location: t("test_1_location"),
    },
    {
      text: t("test_2_text"),
      author: t("test_2_author"),
      location: t("test_2_location"),
    },
    {
      text: t("test_3_text"),
      author: t("test_3_author"),
      location: t("test_3_location"),
    },
  ];

  const next = () => setActive((curr) => (curr === testimonials.length - 1 ? 0 : curr + 1));
  const prev = () => setActive((curr) => (curr === 0 ? testimonials.length - 1 : curr - 1));

  return (
    <section className="w-full py-24 bg-[#EEF4FB]">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            {t("test_title")}
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto flex items-center justify-center">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl w-full p-8 md:p-14 text-center mx-12 md:mx-20 relative min-h-[300px] flex flex-col justify-center">
            
            <div className="flex justify-center mb-6 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
            
            <p className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed mb-8">
              &quot;{testimonials[active].text}&quot;
            </p>
            
            <div>
              <p className="font-bold text-gray-900 text-lg">{testimonials[active].author}</p>
              <p className="text-gray-500">{testimonials[active].location}</p>
            </div>
            
          </div>

          {/* Controls */}
          <button 
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white shadow-md rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors z-10"
            aria-label="Testimonio anterior"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <button 
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white shadow-md rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors z-10"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
        
        {/* Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition-colors ${i === active ? "bg-primary" : "bg-gray-300"}`}
              aria-label={`Ir al testimonio ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
