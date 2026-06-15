'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { GOOGLE_REVIEWS_URL } from '@/lib/company-info';

const REVIEWS = [
  {
    initials: 'SU',
    name: 'Sara Urzaiz',
    company: 'Reseña verificada en Google',
    text: 'Mejor empresa de limpieza con diferencia, son muy profesionales y meticulosos. El sistema de agua con ósmosis deja los cristales muy limpios y duran por más tiempo. La máxima calidad a precio altamente competitivo. La calidad y profesionalidad de todo el equipo son inmejorables.',
    rating: 5,
    date: 'Google',
  },
  {
    initials: 'MM',
    name: 'Mihai Mora',
    company: 'Reseña verificada en Google',
    text: 'Grupo que abarca el sector de limpiezas industriales y servicios higiénicos integrales. Muy profesionales, y destacaría por encima el trato por parte de los empleados en las oficinas centrales.',
    rating: 5,
    date: 'Google',
  },
  {
    initials: 'J',
    name: 'Joel',
    company: 'Reseña verificada en Google',
    text: 'Excelente lugar para adquirir productos de higiene, grandes profesionales y un buen centro de formación donde se imparten cursos de varias modalidades formativas. Recomendable.',
    rating: 5,
    date: 'Google',
  },
  {
    initials: 'CF',
    name: 'Carlos Frocada',
    company: 'Reseña verificada en Google',
    text: 'Una tienda al público con productos y equipos profesionales de limpieza. Merece la pena visitarla.',
    rating: 5,
    date: 'Google',
  },
  {
    initials: 'SS',
    name: 'Sandra Suárez',
    company: 'Reseña verificada en Google',
    text: 'Excelente atención.',
    rating: 5,
    date: 'Google',
  },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export function ReviewsCarousel() {
  const [[index, dir], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const go = useCallback((newDir: number) => {
    setPage(([prev]) => [(prev + newDir + REVIEWS.length) % REVIEWS.length, newDir]);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 4500);
    return () => clearInterval(t);
  }, [paused, go]);

  const review = REVIEWS[index];

  return (
    <section style={{ background: '#F9FAFB', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, color: '#111827', letterSpacing: '-1.5px', lineHeight: 1.1, margin: 0 }}>
            Lo que dicen de nosotros
          </h2>
        </div>

        {/* Card carousel */}
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Prev */}
          <button
            onClick={() => go(-1)}
            aria-label="Anterior"
            style={{
              position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)',
              zIndex: 10, width: 40, height: 40, borderRadius: '50%',
              background: '#fff', border: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <ChevronLeft size={18} color="#374151" />
          </button>

          {/* Card */}
          <div style={{ overflow: 'hidden', borderRadius: 16 }}>
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={index}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{
                  background: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderRadius: 16,
                  padding: '40px 48px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 24,
                  textAlign: 'center',
                }}
              >
                {/* Stars */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={18} fill={s <= review.rating ? '#FBBF24' : '#E5E7EB'} color="transparent" />
                  ))}
                </div>

                {/* Text */}
                <p style={{ fontSize: 17, color: '#111827', lineHeight: 1.7, margin: 0, maxWidth: 620, fontWeight: 400 }}>
                  "{review.text}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: '#F0F2F5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>{review.initials}</span>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>{review.name}</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, marginTop: 2 }}>{review.company}</p>
                  </div>
                </div>

                {/* Date */}
                <p style={{ fontSize: 12, color: '#D1D5DB', margin: 0 }}>{review.date}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next */}
          <button
            onClick={() => go(1)}
            aria-label="Siguiente"
            style={{
              position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)',
              zIndex: 10, width: 40, height: 40, borderRadius: '50%',
              background: '#fff', border: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <ChevronRight size={18} color="#374151" />
          </button>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 28 }}>
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage([i, i > index ? 1 : -1])}
              aria-label={`Reseña ${i + 1}`}
              style={{
                width: i === index ? 20 : 8,
                height: 8,
                borderRadius: 99,
                background: i === index ? '#111827' : '#D1D5DB',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
          >
            Ver todas las reseñas →
          </a>
        </div>

      </div>
    </section>
  );
}
