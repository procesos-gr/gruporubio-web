import Image from 'next/image';
import { ArrowUpRight, Star, ImageIcon } from 'lucide-react';

const CARD_RADIUS = 12;

function ArrowButton() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 14,
        right: 14,
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
        flexShrink: 0,
      }}
    >
      <ArrowUpRight size={15} color="#111827" />
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
        padding: '16px 18px',
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
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: av.bg,
              border: '2px solid #546AE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 9,
              fontWeight: 700,
              marginLeft: i === 0 ? 0 : -8,
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
        <div style={{ fontSize: 34, fontWeight: 800, color: '#ffffff', lineHeight: 1, marginBottom: 4 }}>
          90%
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.72)', lineHeight: 1.4 }}>
          de clientes<br />satisfechos
        </div>
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={11}
            fill={s <= 4 ? '#FCD34D' : 'rgba(255,255,255,0.25)'}
            color="transparent"
          />
        ))}
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginLeft: 4 }}>
          4.2 Google
        </span>
      </div>
    </div>
  );
}

function EmptyCard() {
  return (
    <div
      style={{
        borderRadius: CARD_RADIUS,
        background: '#F0F2F5',
        border: '1.5px dashed #D1D5DB',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <ImageIcon size={22} color="#9CA3AF" />
      <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>Próximamente</span>
    </div>
  );
}

export function PhotoGrid() {
  return (
    <div
      style={{
        display: 'grid',
        /* Col 1: Limpieza (narrower) | Col 2: Plagas + Reviews | Col 3: new card */
        gridTemplateColumns: '50% 27% 23%',
        gridTemplateRows: '62% 38%',
        gap: 8,
        height: 420,
      }}
    >
      {/* Limpieza — spans both rows */}
      <div
        style={{
          position: 'relative',
          borderRadius: CARD_RADIUS,
          overflow: 'hidden',
          gridColumn: 1,
          gridRow: '1 / 3',
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80"
          alt="Limpieza profesional en oficinas y espacios comerciales"
          fill
          className="object-cover object-center"
          sizes="(max-width: 1200px) 50vw, 600px"
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

      {/* Control de Plagas — col 2, row 1 (taller) */}
      <div
        style={{
          position: 'relative',
          borderRadius: CARD_RADIUS,
          overflow: 'hidden',
          gridColumn: 2,
          gridRow: 1,
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=600&q=80"
          alt="Control de plagas y tratamientos DDD"
          fill
          className="object-cover object-center"
          sizes="(max-width: 1200px) 27vw, 320px"
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

      {/* Reviews widget — col 2, row 2 (shorter) */}
      <div style={{ gridColumn: 2, gridRow: 2 }}>
        <ReviewsWidget />
      </div>

      {/* New empty card — col 3, spans both rows */}
      <div
        style={{
          gridColumn: 3,
          gridRow: '1 / 3',
        }}
      >
        <EmptyCard />
      </div>
    </div>
  );
}
