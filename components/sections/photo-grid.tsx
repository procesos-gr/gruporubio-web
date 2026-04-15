import Image from 'next/image';
import { ArrowUpRight, Star } from 'lucide-react';

const CARD_RADIUS = 20;

function ArrowButton() {
  return (
    <div
      className="absolute bottom-4 right-4 flex items-center justify-center flex-shrink-0 bg-white"
      style={{ width: 36, height: 36, borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
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
      className="w-full h-full flex flex-col justify-between"
      style={{
        borderRadius: CARD_RADIUS,
        background: '#546AE7',
        padding: '22px 24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Avatars */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {AVATARS.map((av, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-white font-bold"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: av.bg,
              border: '2.5px solid #546AE7',
              fontSize: 11,
              marginLeft: i === 0 ? 0 : -10,
              zIndex: AVATARS.length - i,
              position: 'relative',
            }}
          >
            {av.initials}
          </div>
        ))}
      </div>

      {/* Stat */}
      <div>
        <div style={{ fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 6 }}>
          90%
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>
          de clientes<br />satisfechos
        </div>
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={13} fill={s <= 4 ? '#FCD34D' : 'rgba(255,255,255,0.3)'} color="transparent" />
        ))}
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginLeft: 4 }}>4.2 en Google</span>
      </div>
    </div>
  );
}

export function PhotoGrid() {
  return (
    <section className="w-full bg-[#F8F9FA] pb-20 px-6 lg:px-12">
      <div
        className="mx-auto max-w-6xl"
        style={{
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          gap: 8,
          height: 380,
        }}
      >
        {/* Left — big Limpieza card */}
        <div className="relative overflow-hidden" style={{ borderRadius: CARD_RADIUS }}>
          <Image
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80"
            alt="Limpieza profesional en oficinas y espacios comerciales"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1200px) 60vw, 720px"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}
          />
          <span
            className="absolute text-white font-bold"
            style={{ bottom: 16, left: 20, fontSize: 15, zIndex: 10 }}
          >
            Limpieza Profesional
          </span>
          <ArrowButton />
        </div>

        {/* Right column — pest photo (top) + reviews widget (bottom) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

          {/* Top: Control de Plagas photo */}
          <div className="relative overflow-hidden flex-1" style={{ borderRadius: CARD_RADIUS }}>
            <Image
              src="https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=600&q=80"
              alt="Control de plagas y tratamientos DDD"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1200px) 40vw, 480px"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}
            />
            <span
              className="absolute text-white font-bold"
              style={{ bottom: 16, left: 16, fontSize: 15, zIndex: 10 }}
            >
              Control de Plagas
            </span>
            <ArrowButton />
          </div>

          {/* Bottom: Reviews widget cell */}
          <div style={{ flex: 1 }}>
            <ReviewsWidget />
          </div>

        </div>
      </div>
    </section>
  );
}
