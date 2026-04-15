'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Award, ShieldCheck, ClipboardCheck, Leaf, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Review {
  initials: string;
  name: string;
  company: string;
  text: string;
  date: string;
}

interface TrustPill {
  title: string;
  desc: string;
  Icon: LucideIcon;
}

function Stars() {
  return (
    <div className="flex items-center gap-0.5 flex-shrink-0">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function ReviewsCarousel() {
  const t = useTranslations('Index');
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const reviews: Review[] = [
    {
      initials: t('rc_r1_initials'),
      name: t('rc_r1_name'),
      company: t('rc_r1_company'),
      text: t('rc_r1_text'),
      date: t('rc_r1_date'),
    },
    {
      initials: t('rc_r2_initials'),
      name: t('rc_r2_name'),
      company: t('rc_r2_company'),
      text: t('rc_r2_text'),
      date: t('rc_r2_date'),
    },
    {
      initials: t('rc_r3_initials'),
      name: t('rc_r3_name'),
      company: t('rc_r3_company'),
      text: t('rc_r3_text'),
      date: t('rc_r3_date'),
    },
  ];

  const pills: TrustPill[] = [
    { title: t('rc_pill_1_title'), desc: t('rc_pill_1_desc'), Icon: Award },
    { title: t('rc_pill_2_title'), desc: t('rc_pill_2_desc'), Icon: ShieldCheck },
    { title: t('rc_pill_3_title'), desc: t('rc_pill_3_desc'), Icon: ClipboardCheck },
    { title: t('rc_pill_4_title'), desc: t('rc_pill_4_desc'), Icon: Leaf },
  ];

  const goTo = useCallback((idx: number) => {
    setActive(idx);
    setAnimKey((k) => k + 1);
  }, []);

  const next = useCallback(() => {
    goTo((active + 1) % reviews.length);
  }, [active, reviews.length, goTo]);

  const prev = useCallback(() => {
    goTo((active - 1 + reviews.length) % reviews.length);
  }, [active, reviews.length, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const review = reviews[active];

  return (
    <section className="w-full bg-[#f9fafb] py-16">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">

        {/* Cabecera centrada */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
            {t('rc_label')}
          </p>
          <h2 className="text-[28px] font-bold text-gray-900">
            {t('rc_title')}
          </h2>
        </div>

        {/* Trust pills 2×2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          {pills.map((pill) => (
            <div key={pill.title} className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#f3f4f6', borderRadius: '8px' }}
              >
                <pill.Icon className="w-5 h-5 text-[#6b7280]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-snug">
                  {pill.title}
                </p>
                <p className="text-[13px] text-gray-400 leading-snug mt-0.5">
                  {pill.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel */}
        <div
          className="relative flex items-center justify-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Flecha izquierda */}
          <button
            onClick={prev}
            aria-label="Reseña anterior"
            className="absolute left-0 md:-left-6 z-10 w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-150 flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>

          {/* Card */}
          <div className="w-full max-w-[640px] mx-12 md:mx-14">
            <div
              key={animKey}
              className="bg-white border border-gray-200 rounded-2xl p-8 animate-fade-slide"
            >
              {/* Fila superior */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-base font-bold text-blue-600">
                      {review.initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900 leading-tight">
                      {review.name}
                    </p>
                    <p className="text-[13px] text-gray-400 leading-snug mt-0.5">
                      {review.company}
                    </p>
                  </div>
                </div>
                <Stars />
              </div>

              {/* Texto */}
              <p className="text-base italic text-gray-700 text-center leading-relaxed mb-6">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Pie */}
              <p className="text-xs text-gray-400 text-center">{review.date}</p>
            </div>
          </div>

          {/* Flecha derecha */}
          <button
            onClick={next}
            aria-label="Siguiente reseña"
            className="absolute right-0 md:-right-6 z-10 w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-150 flex-shrink-0"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir a la reseña ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                i === active ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* CTA Google */}
        <div className="text-center mt-8">
          <a
            href="#"
            className="text-[13px] text-primary font-medium hover:opacity-75 transition-opacity"
          >
            {t('rc_cta')} →
          </a>
        </div>

      </div>
    </section>
  );
}
