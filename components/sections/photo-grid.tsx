import Image from 'next/image';
import { ArrowUpRight, Star } from 'lucide-react';

const CARD_RADIUS = 20;

function ArrowButton() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 14,
        right: 14,
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
        flexShrink: 0,
      }}
    >
      <ArrowUpRight size={16} color="#111827" />
    </div>
  );
}

function ReviewsWidget() {
  const AVATARS = [
    { initials: 'ML', bg: '#818CF8' },
    { initials: 'CG', bg: '#34D399' },
    { initials: 'LS', bg: '#FCD34D' },
  ];

  return (
    <div
      style={{
        borderRadius: CARD_RADIUS,
        background: '#546AE7',
        padding: '24px 26px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Avatars */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {AVATARS.map((av, i) => (
          <div
            key={i}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: av.bg,
              border: '2.5px solid #546AE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              marginLeft: i === 0 ? 0 : -10,
              zIndex: AVATARS.length - i,
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {av.initials}
          </div>
        ))}
      </div>

      {/* Stat */}
      <div>
        <div style={{ fontSize: 44, fontWeight: 800, color: '#ffffff', lineHeight: 1, marginBottom: 6 }}>
          90%
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.45 }}>
          de clientes<br />satisfechos
        </div>
      </div>

      {/* Stars + rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={13}
            fill={s <= 4 ? '#FCD34D' : 'rgba(255,255,255,0.25)'}
            color="transparent"
          />
        ))}
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginLeft: 5 }}>
          4.2 en Google
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
        gridTemplateColumns: '60% 40%',
        gap: 8,
        height: 380,
      }}
    >
      {/* Left — Limpieza (full height) */}
      <div style={{ position: 'relative', borderRadius: CARD_RADIUS, overflow: 'hidden' }}>
        <Image
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80"
          alt="Limpieza profesional en oficinas y espacios comerciales"
          fill
          className="object-cover object-center"
          sizes="(max-width: 1200px) 60vw, 720px"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            bottom: 16,
            left: 18,
            color: '#ffffff',
            fontWeight: 700,
            fontSize: 15,
            zIndex: 10,
          }}
        >
          Limpieza Profesional
        </span>
        <ArrowButton />
      </div>

      {/* Right — top photo + bottom reviews widget */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Control de Plagas photo */}
        <div style={{ position: 'relative', borderRadius: CARD_RADIUS, overflow: 'hidden', flex: 1 }}>
          <Image
            src="https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=600&q=80"
            alt="Control de plagas y tratamientos DDD"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1200px) 40vw, 480px"
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
            }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 15,
              zIndex: 10,
            }}
          >
            Control de Plagas
          </span>
          <ArrowButton />
        </div>

        {/* Reviews widget — own cell, same flex size as photo above */}
        <div style={{ flex: 1 }}>
          <ReviewsWidget />
        </div>

      </div>
    </div>
  );
}
