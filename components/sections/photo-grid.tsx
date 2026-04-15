import Image from 'next/image';
import { ArrowUpRight, Star } from 'lucide-react';

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
        padding: '14px 16px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      {/* Left: avatars + label + stars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
        {/* Avatars */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {AVATARS.map((av, i) => (
            <div
              key={i}
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: av.bg,
                border: '2px solid #546AE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 8,
                fontWeight: 700,
                marginLeft: i === 0 ? 0 : -7,
                zIndex: AVATARS.length - i,
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {av.initials}
            </div>
          ))}
        </div>

        {/* Label */}
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.82)', lineHeight: 1.35, whiteSpace: 'nowrap' }}>
          de clientes<br />satisfechos
        </div>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={10}
              fill={s <= 4 ? '#FCD34D' : 'rgba(255,255,255,0.25)'}
              color="transparent"
            />
          ))}
        </div>
      </div>

      {/* Right: big number */}
      <div style={{ fontSize: 38, fontWeight: 800, color: '#ffffff', lineHeight: 1, flexShrink: 0 }}>
        90%
      </div>
    </div>
  );
}


export function PhotoGrid() {
  return (
    <div
      style={{
        display: 'grid',
        /* Col 1: Limpieza | Col 2: Plagas + Reviews | Col 3: new card (1fr fills remaining → equal margins) */
        gridTemplateColumns: '44% 24% 1fr',
        gridTemplateRows: '70% 30%',
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
          src="/images/servicios/limpieza_profesional.jpg"
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
          src="/images/servicios/control_de_plagas.jpg"
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

      {/* Tienda — col 3, spans both rows */}
      <div
        style={{
          position: 'relative',
          borderRadius: CARD_RADIUS,
          overflow: 'hidden',
          gridColumn: 3,
          gridRow: '1 / 3',
        }}
      >
        <Image
          src="/images/servicios/tienda.jpg"
          alt="Nuestra tienda de productos de higiene y limpieza"
          fill
          className="object-cover object-center"
          sizes="(max-width: 1200px) 32vw, 380px"
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
          Nuestra Tienda
        </span>
        <ArrowButton />
      </div>
    </div>
  );
}
