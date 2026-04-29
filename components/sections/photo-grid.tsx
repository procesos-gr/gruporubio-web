'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';

const CARD_RADIUS = 12;

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

function ReviewsWidget() {
  const AVATARS = [
    { initials: 'ML', bg: '#818CF8' },
    { initials: 'CG', bg: '#34D399' },
    { initials: 'LS', bg: '#FBBF24' },
  ];

  return (
    <div
      className="group cursor-pointer"
      style={{
        borderRadius: CARD_RADIUS,
        background: 'linear-gradient(135deg, #6677EC 0%, #4254CC 100%)',
        padding: '0 16px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        overflow: 'hidden',
        position: 'relative',
        transition: 'filter 0.25s ease, transform 0.25s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.filter = 'brightness(1)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Decorative circle */}
      <div style={{
        position: 'absolute', right: -24, top: -24,
        width: 100, height: 100, borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)',
        pointerEvents: 'none',
      }} />

      {/* Avatars */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {AVATARS.map((av, i) => (
          <div
            key={i}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: av.bg,
              border: '2.5px solid #5060D8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 11, fontWeight: 700,
              marginLeft: i === 0 ? 0 : -12,
              zIndex: AVATARS.length - i, position: 'relative', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              transition: 'transform 0.2s ease',
            }}
          >
            {av.initials}
          </div>
        ))}
      </div>

      {/* Score + Google */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, gap: 4 }}>
        <span style={{ fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>
          4.2
        </span>
        <div style={{ display: 'flex', gap: 0, fontSize: 15, fontWeight: 800 }}>
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#EA4335' }}>o</span>
          <span style={{ color: '#FBBC05' }}>o</span>
          <span style={{ color: '#4285F4' }}>g</span>
          <span style={{ color: '#34A853' }}>l</span>
          <span style={{ color: '#EA4335' }}>e</span>
        </div>
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={28} fill={s <= 4 ? '#FBBF24' : 'rgba(255,255,255,0.2)'} color="transparent" />
          ))}
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
          Reseñas en Google
        </span>
      </div>
    </div>
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
            src="/images/home/limpieza-profesional.webp"
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
            src="/images/home/tienda.webp"
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
