import Image from 'next/image';
import { ArrowUpRight, Star } from 'lucide-react';

const CARD_RADIUS = 12;

/* Arrow button — animated on card hover via Tailwind group-hover */
function ArrowButton() {
  return (
    <div
      className="
        absolute bottom-3.5 right-3.5
        w-[34px] h-[34px] rounded-full bg-white
        flex items-center justify-center
        shadow-sm
        transition-transform duration-200 ease-out
        group-hover:scale-110
      "
    >
      <ArrowUpRight
        size={15}
        color="#111827"
        className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </div>
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
      style={{
        borderRadius: CARD_RADIUS,
        background: 'linear-gradient(135deg, #6677EC 0%, #4254CC 100%)',
        padding: '0 20px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Decorative circle — background accent */}
      <div style={{
        position: 'absolute', right: -28, top: -28,
        width: 110, height: 110, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        pointerEvents: 'none',
      }} />

      {/* Left — avatars + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {AVATARS.map((av, i) => (
            <div
              key={i}
              style={{
                width: 26, height: 26, borderRadius: '50%',
                background: av.bg, border: '2.5px solid #5060D8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 9, fontWeight: 700,
                marginLeft: i === 0 ? 0 : -9,
                zIndex: AVATARS.length - i, position: 'relative', flexShrink: 0,
              }}
            >
              {av.initials}
            </div>
          ))}
        </div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
          Clientes<br />satisfechos
        </span>
      </div>

      {/* Center — big stat */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>
          90%
        </span>
      </div>

      {/* Right — stars + score */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={11} fill={s <= 4 ? '#FBBF24' : 'rgba(255,255,255,0.2)'} color="transparent" />
          ))}
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
          4.2 · Google
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
      <div
        className="group"
        style={{ position: 'relative', borderRadius: CARD_RADIUS, overflow: 'hidden', gridColumn: 1, gridRow: '1 / 3' }}
      >
        <Image
          src="/images/servicios/limpieza_profesional.jpg"
          alt="Limpieza profesional en oficinas y espacios comerciales"
          fill
          quality={90}
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 90vw, 44vw"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
        <span className="absolute text-white font-bold" style={{ bottom: 16, left: 18, fontSize: 15, zIndex: 10 }}>
          Limpieza Profesional
        </span>
        <ArrowButton />
      </div>

      {/* Control de Plagas — col 2, row 1 */}
      <div
        className="group"
        style={{ position: 'relative', borderRadius: CARD_RADIUS, overflow: 'hidden', gridColumn: 2, gridRow: 1 }}
      >
        <Image
          src="/images/servicios/control_de_plagas.jpg"
          alt="Control de plagas y tratamientos DDD"
          fill
          quality={90}
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 90vw, 24vw"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
        <span className="absolute text-white font-bold" style={{ bottom: 16, left: 16, fontSize: 15, zIndex: 10 }}>
          Control de Plagas
        </span>
        <ArrowButton />
      </div>

      {/* Reviews widget — col 2, row 2 */}
      <div style={{ gridColumn: 2, gridRow: 2 }}>
        <ReviewsWidget />
      </div>

      {/* Tienda — col 3, full height */}
      <div
        className="group"
        style={{ position: 'relative', borderRadius: CARD_RADIUS, overflow: 'hidden', gridColumn: 3, gridRow: '1 / 3' }}
      >
        <Image
          src="/images/servicios/tienda.jpg"
          alt="Nuestra tienda de productos de higiene y limpieza"
          fill
          quality={90}
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 90vw, 32vw"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
        <span className="absolute text-white font-bold" style={{ bottom: 16, left: 16, fontSize: 15, zIndex: 10 }}>
          Nuestra Tienda
        </span>
        <ArrowButton />
      </div>
    </div>
  );
}
