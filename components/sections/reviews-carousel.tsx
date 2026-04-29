'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
  {
    initials: 'MG',
    name: 'María G.',
    company: 'Comunidad de propietarios · Pamplona',
    text: 'Llevamos 3 años con Grupo Rubio y la limpieza de nuestra comunidad ha mejorado notablemente. El equipo es puntual, cuidadoso y muy profesional.',
    rating: 5,
    date: 'Hace 2 semanas',
  },
  {
    initials: 'CL',
    name: 'Carlos L.',
    company: 'Gerente · Hotel Restaurante, Tudela',
    text: 'Contratamos sus servicios para la limpieza del hotel y el resultado es impecable. Muy contentos con la atención y la disponibilidad del equipo.',
    rating: 5,
    date: 'Hace 1 mes',
  },
  {
    initials: 'RF',
    name: 'Rosa F.',
    company: 'Responsable de instalaciones · Zaragoza',
    text: 'El servicio de control de plagas DDD fue muy efectivo. Solución rápida sin interrumpir nuestra actividad. Totalmente recomendable.',
    rating: 5,
    date: 'Hace 3 semanas',
  },
  {
    initials: 'JM',
    name: 'Javier M.',
    company: 'Director · Colegio Público, Tudela',
    text: 'Llevan años encargándose de las instalaciones del colegio. Siempre cumplen con los plazos y el resultado es perfecto. Empresa de total confianza.',
    rating: 5,
    date: 'Hace 2 meses',
  },
  {
    initials: 'AB',
    name: 'Ana B.',
    company: 'Propietaria · Piso de alquiler, Logroño',
    text: 'Hicieron la limpieza de fin de obra y el piso quedó perfecto. Muy detallistas, rápidos y el precio muy ajustado. Sin duda volvería a contratarles.',
    rating: 5,
    date: 'Hace 1 semana',
  },
  {
    initials: 'PS',
    name: 'Pedro S.',
    company: 'Encargado · Nave industrial, Pamplona',
    text: 'Excelente servicio de limpieza industrial. Trabajan fuera de horario para no interrumpir la producción y dejan todo impecable. Muy recomendables.',
    rating: 5,
    date: 'Hace 3 meses',
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
            Clientes que confían en nosotros en Google
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
                  {/* Google logo */}
                  <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginLeft: 4, flexShrink: 0 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
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
            href="https://www.google.com/maps/search/Grupo+Rubio+Navarra/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
          >
            Ver todas las reseñas en Google →
          </a>
        </div>

      </div>
    </section>
  );
}
