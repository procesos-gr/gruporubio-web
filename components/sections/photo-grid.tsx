import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const CARDS = [
  {
    id: 'cleaning',
    label: 'Limpieza Profesional',
    src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80',
    alt: 'Limpieza profesional en oficinas y espacios comerciales',
    span: 'left',
  },
  {
    id: 'pest',
    label: 'Control de Plagas',
    src: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=600&q=80',
    alt: 'Control de plagas y tratamientos DDD',
    span: 'right-top',
  },
  {
    id: 'store',
    label: 'Nuestra Tienda',
    src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
    alt: 'Productos de higiene y limpieza profesional',
    span: 'right-bottom',
  },
] as const;

function ArrowButton() {
  return (
    <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
      <ArrowUpRight size={16} className="text-[#111827]" />
    </div>
  );
}

function ReviewsWidget() {
  const AVATARS = [
    { initials: 'ML', bg: '#546AE7' },
    { initials: 'CG', bg: '#16A34A' },
    { initials: 'LS', bg: '#F59E0B' },
  ];

  return (
    <div
      className="absolute bottom-5 left-5 z-20 flex flex-col gap-1.5 rounded-2xl px-4 py-3"
      style={{ background: '#546AE7', minWidth: 180 }}
    >
      {/* Avatars row */}
      <div className="flex items-center">
        {AVATARS.map((av, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#546AE7] flex-shrink-0"
            style={{ background: av.bg, marginLeft: i === 0 ? 0 : -8, zIndex: AVATARS.length - i }}
          >
            {av.initials}
          </div>
        ))}
      </div>
      {/* Text */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-white font-bold text-[22px] leading-none">90%</span>
        <span className="text-white/80 text-[11px] leading-tight">de clientes<br />satisfechos</span>
      </div>
    </div>
  );
}

export function PhotoGrid() {
  const [bigCard, topCard, bottomCard] = CARDS;

  return (
    <section className="w-full bg-[#F8F9FA] pb-20 px-6 lg:px-12">
      <div
        className="mx-auto max-w-6xl"
        style={{
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          gridTemplateRows: '1fr',
          gap: '12px',
          height: 360,
        }}
      >
        {/* Left — big card */}
        <div className="relative rounded-[24px] overflow-hidden" style={{ gridRow: '1', gridColumn: '1' }}>
          <Image
            src={bigCard.src}
            alt={bigCard.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1200px) 60vw, 720px"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}
          />
          {/* Service label */}
          <span className="absolute bottom-4 left-5 text-white font-bold text-[15px] z-10 leading-tight">
            {bigCard.label}
          </span>
          <ArrowButton />
          <ReviewsWidget />
        </div>

        {/* Right — two stacked cards */}
        <div className="flex flex-col gap-3" style={{ gridRow: '1', gridColumn: '2' }}>
          {/* Top card */}
          <div className="relative rounded-[24px] overflow-hidden flex-1">
            <Image
              src={topCard.src}
              alt={topCard.alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1200px) 40vw, 480px"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}
            />
            <span className="absolute bottom-4 left-4 text-white font-bold text-[15px] z-10">
              {topCard.label}
            </span>
            <ArrowButton />
          </div>

          {/* Bottom card */}
          <div className="relative rounded-[24px] overflow-hidden flex-1">
            <Image
              src={bottomCard.src}
              alt={bottomCard.alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1200px) 40vw, 480px"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}
            />
            <span className="absolute bottom-4 left-4 text-white font-bold text-[15px] z-10">
              {bottomCard.label}
            </span>
            <ArrowButton />
          </div>
        </div>
      </div>
    </section>
  );
}
