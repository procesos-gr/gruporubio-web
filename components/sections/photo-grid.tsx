'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const CARD_RADIUS = 12;

/* URL de las reseñas de Google — sustituir por el enlace con place_id real */
const GOOGLE_REVIEWS_URL =
  'https://www.google.com/search?q=Grupo+Rubio+limpiezas+rese%C3%B1as';
const RATING = 4.2;
const REVIEW_COUNT = 184;

/* Centered overlay label + arrow — appears on hover */
function CardOverlay({ title, large = false }: { title: string; large?: boolean }) {
  return (
    <>
      {/* Dark overlay — lightens at rest, darkens on hover */}
      <div
        className="absolute inset-0 transition-colors duration-400 ease-out"
        style={{ background: 'rgba(0,0,0,0.28)' }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-400 ease-out opacity-0 group-hover:opacity-100"
        style={{ background: 'rgba(0,0,0,0.38)' }}
      />

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 px-4 text-center">

        {/* Title */}
        <div
          className="transition-all duration-300 ease-out delay-[30ms]"
          style={{
            fontSize: large ? 26 : 20,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.5px',
            textShadow: '0 2px 12px rgba(0,0,0,0.45)',
            whiteSpace: 'pre-line',
            textAlign: 'center',
          }}
        >
          {title}
        </div>

        {/* Arrow circle — slides up on hover */}
        <div
          className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ease-out opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255,255,255,0.35)',
          }}
        >
          <ArrowUpRight size={16} color="#ffffff" strokeWidth={2.5} />
        </div>

      </div>
    </>
  );
}

/* Logo "G" oficial de Google (4 colores) */
function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

/* Estrella individual — se rellena animada al entrar en viewport */
function AnimatedStar({ fillRatio, delay, play }: { fillRatio: number; delay: number; play: boolean }) {
  const clipId = useRef(`star-clip-${Math.random().toString(36).slice(2)}`).current;
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <defs>
        <clipPath id={clipId}>
          <motion.rect
            x="0" y="0" height="24"
            initial={{ width: 0 }}
            animate={{ width: play ? 24 * fillRatio : 0 }}
            transition={{ duration: 0.4, delay, ease: 'easeOut' }}
          />
        </clipPath>
      </defs>
      <path
        d="M12 2l2.9 6.26L21.8 9.27l-5 4.87 1.18 6.86L12 17.77l-6 3.23 1.18-6.86-5-4.87 6.9-1.01L12 2z"
        fill="#E5E7EB"
      />
      <path
        d="M12 2l2.9 6.26L21.8 9.27l-5 4.87 1.18 6.86L12 17.77l-6 3.23 1.18-6.86-5-4.87 6.9-1.01L12 2z"
        fill="#FBBF24"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}

function ReviewsWidget() {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, RATING, {
      duration: 0.9,
      ease: 'easeOut',
      onUpdate: (v) => setScore(v),
    });
    return () => controls.stop();
  }, [inView]);

  return (
    <motion.a
      ref={ref}
      href={GOOGLE_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className="group"
      style={{
        borderRadius: CARD_RADIUS,
        background: '#ffffff',
        border: '1px solid #EEF1F6',
        boxShadow: '0 1px 2px rgba(16,24,40,0.04), 0 6px 16px rgba(16,24,40,0.06)',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        overflow: 'hidden',
        textDecoration: 'none',
        position: 'relative',
      }}
    >
      {/* Logo Google */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <GoogleG size={26} />
      </div>

      <div style={{ width: 1, height: 30, background: '#EEF1F6', flexShrink: 0 }} />

      {/* Score + estrellas + label */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
            {score.toFixed(1)}
          </span>
          <div style={{ display: 'flex', gap: 1.5 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <AnimatedStar
                key={i}
                play={inView}
                delay={0.15 + i * 0.08}
                fillRatio={Math.max(0, Math.min(1, RATING - i))}
              />
            ))}
          </div>
        </div>
        <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Reseñas de Google · {REVIEW_COUNT}
        </span>
      </div>

      {/* Arrow — aparece al hover */}
      <div
        className="transition-all duration-300 ease-out opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
        style={{
          flexShrink: 0,
          width: 28, height: 28, borderRadius: 8,
          background: '#F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <ArrowUpRight size={15} color="#111827" strokeWidth={2.5} />
      </div>
    </motion.a>
  );
}

export function PhotoGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '44% 24% 1fr',
        gridTemplateRows: '77% 23%',
        gap: 8,
        height: 420,
      }}
    >
      {/* Limpieza — col 1, full height */}
      <Link href="/servicios#limpieza" style={{ display: 'contents' }}>
        <div
          className="group cursor-pointer"
          style={{ position: 'relative', borderRadius: CARD_RADIUS, overflow: 'hidden', gridColumn: 1, gridRow: '1 / 3' }}
        >
          <Image
            src="/images/home/limpieza-profesional-fullbody.webp"
            alt="Limpieza profesional en oficinas y espacios comerciales"
            fill
            quality={90}
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 90vw, 44vw"
          />
          <CardOverlay title={"Limpieza\nProfesional"} large />
        </div>
      </Link>

      {/* Control de Plagas — col 2, row 1 */}
      <Link href="/servicios#plagas" style={{ display: 'contents' }}>
        <div
          className="group cursor-pointer"
          style={{ position: 'relative', borderRadius: CARD_RADIUS, overflow: 'hidden', gridColumn: 2, gridRow: 1 }}
        >
          <Image
            src="/images/home/control-de-plagas.webp"
            alt="Control de plagas y tratamientos DDD"
            fill
            quality={90}
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 90vw, 24vw"
          />
          <CardOverlay title={"Control\nde Plagas"} />
        </div>
      </Link>

      {/* Reviews widget — col 2, row 2 */}
      <div style={{ gridColumn: 2, gridRow: 2 }}>
        <ReviewsWidget />
      </div>

      {/* Tienda — col 3, full height */}
      <Link href="/tienda" style={{ display: 'contents' }}>
        <div
          className="group cursor-pointer"
          style={{ position: 'relative', borderRadius: CARD_RADIUS, overflow: 'hidden', gridColumn: 3, gridRow: '1 / 3' }}
        >
          <Image
            src="/images/home/tienda.jpg"
            alt="Nuestra tienda de productos de higiene y limpieza"
            fill
            quality={90}
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 90vw, 32vw"
          />
          <CardOverlay title={"Nuestra\nTienda"} />
        </div>
      </Link>
    </div>
  );
}
