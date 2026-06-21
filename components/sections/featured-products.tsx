'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Variant = {
  calculated_price?: { calculated_amount?: number | null } | null;
};

export type FeaturedProduct = {
  id: string;
  handle: string;
  title: string;
  thumbnail: string | null;
  variants?: Variant[];
};

type Props = {
  products: FeaturedProduct[];
  locale: string;
};

const CARD_W = 250;
const GAP = 16;

function getMinPrice(product: FeaturedProduct): number | null {
  const prices = (product.variants ?? [])
    .map(v => v.calculated_price?.calculated_amount ?? null)
    .filter((p): p is number => p !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
}

function ProductCard({ product, locale }: { product: FeaturedProduct; locale: string }) {
  const minPrice = getMinPrice(product);
  const formattedPrice = minPrice != null
    ? new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(minPrice / 100)
    : 'Consultar';

  return (
    <Link href={`/${locale}/tienda/${product.handle}`} style={{ textDecoration: 'none', display: 'block' }} draggable={false}>
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      style={{
        width: CARD_W,
        flexShrink: 0,
        borderRadius: 12,
        cursor: 'pointer',
        background: '#ffffff',
        overflow: 'hidden',
        fontFamily: 'var(--font-plus-jakarta), sans-serif',
      }}
    >
      {/* Image — tall, dominates the card */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <motion.div
          variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="250px"
              className="object-cover object-center pointer-events-none"
              draggable={false}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #1c2433, #0F1623)',
            }}>
              <div style={{ fontSize: 40, opacity: 0.3 }}>🧴</div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Info strip */}
      <div
        style={{
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 3px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.title}
          </p>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>
            {formattedPrice}
          </span>
        </div>

        {/* Arrow — appears on hover */}
        <motion.div
          variants={{ rest: { opacity: 0, scale: 0.8 }, hover: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            flexShrink: 0,
            width: 30,
            height: 30,
            borderRadius: 8,
            background: '#546AE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowRight size={14} color="#ffffff" strokeWidth={2.5} />
        </motion.div>
      </div>
    </motion.div>
    </Link>
  );
}

export function FeaturedProducts({ products, locale }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const scrollByDir = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * (CARD_W + GAP) * 2, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <section style={{ background: '#0F1623', padding: '88px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 36, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 560 }}>
            <h2
              style={{
                fontSize: 'clamp(26px, 3vw, 38px)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-1px',
                lineHeight: 1.15,
                margin: '0 0 12px',
                fontFamily: 'var(--font-plus-jakarta), sans-serif',
              }}
            >
              Descubre nuestra tienda
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.65, fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              Productos profesionales de limpieza, higiene y desinfección usados por empresas,
              restaurantes y centros de trabajo de toda la región.
            </p>
          </div>

          <Link
            href={`/${locale}/tienda`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#ffffff', color: '#111827', borderRadius: 8,
              padding: '11px 20px', fontSize: 13, fontWeight: 700,
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
              fontFamily: 'var(--font-plus-jakarta), sans-serif',
            }}
          >
            Ver tienda <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* Carrusel con botones laterales */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 0 0 24px', position: 'relative' }}>
        <style>{`
          .fp-track { display: flex; gap: ${GAP}px; overflow-x: auto; padding-right: 24px; scrollbar-width: none; }
          .fp-track::-webkit-scrollbar { display: none; }
          .fp-nav-btn { transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease; }
          .fp-nav-btn:hover:not(:disabled) { transform: translateY(-50%) scale(1.08); box-shadow: 0 6px 20px rgba(0,0,0,0.35); }
          /* Fuera de las tarjetas cuando hay sitio a los lados */
          .fp-nav-prev { left: -64px; }
          .fp-nav-next { right: -40px; }
          @media (max-width: 1330px) {
            .fp-nav-prev { left: 8px; }
            .fp-nav-next { right: 8px; }
          }
        `}</style>

        <div ref={scrollRef} className="fp-track" onScroll={update}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>

        {/* Botones laterales */}
        {([
          { dir: -1 as const, cls: 'fp-nav-prev', enabled: canLeft, Icon: ChevronLeft, label: 'Anterior' },
          { dir: 1 as const, cls: 'fp-nav-next', enabled: canRight, Icon: ChevronRight, label: 'Siguiente' },
        ]).map(({ dir, cls, enabled, Icon, label }) => (
          <button
            key={label}
            className={`fp-nav-btn ${cls}`}
            onClick={() => scrollByDir(dir)}
            disabled={!enabled}
            aria-label={label}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 44,
              height: 44,
              borderRadius: 8,
              background: '#ffffff',
              border: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: enabled ? 'pointer' : 'default',
              opacity: enabled ? 1 : 0.3,
              zIndex: 2,
            }}
          >
            <Icon size={20} color="#0F1623" strokeWidth={2.5} />
          </button>
        ))}
      </div>
    </section>
  );
}
