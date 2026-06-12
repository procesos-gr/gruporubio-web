'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const PRODUCTS = [
  {
    name: 'Desengrasante Industrial 5L',
    rating: 4.9,
    price: '18,50 €',
    img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=260&fit=crop&auto=format',
  },
  {
    name: 'Fregasuelos Concentrado 2L',
    rating: 4.7,
    price: '8,90 €',
    img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=260&fit=crop&auto=format',
  },
  {
    name: 'Desinfectante Multiusos 1L',
    rating: 4.8,
    price: '6,50 €',
    img: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=260&fit=crop&auto=format',
  },
  {
    name: 'Bolsas Basura Reforzadas x100',
    rating: 4.6,
    price: '12,90 €',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=260&fit=crop&auto=format',
  },
  {
    name: 'Papel Higiénico Industrial x12',
    rating: 4.8,
    price: '22,00 €',
    img: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400&h=260&fit=crop&auto=format',
  },
  {
    name: 'Guantes Nitrilo Talla M x50',
    rating: 4.5,
    price: '9,95 €',
    img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=260&fit=crop&auto=format',
  },
];

const CARD_W = 250;
const GAP = 16;

function ProductCard({ product }: { product: typeof PRODUCTS[number] }) {
  return (
    <Link href="/tienda" style={{ textDecoration: 'none', display: 'block' }} draggable={false}>
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
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="250px"
            className="object-cover object-center pointer-events-none"
            draggable={false}
          />
        </motion.div>

        {/* Rating chip — top right */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            borderRadius: 8,
            padding: '3px 8px',
            fontSize: 11,
            fontWeight: 700,
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <span style={{ color: '#F59E0B' }}>★</span>
          {product.rating.toFixed(1)}
        </div>
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
            {product.name}
          </p>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>
            {product.price}
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

export function FeaturedProducts() {
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
              Lo que nuestros clientes más eligen
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.65, fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              Productos profesionales de limpieza, higiene y desinfección usados por empresas,
              restaurantes y centros de trabajo de toda la región.
            </p>
          </div>

          <Link
            href="/tienda"
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
          .fp-nav-btn { transition: background 0.2s ease, opacity 0.2s ease, transform 0.15s ease; }
          .fp-nav-btn:hover:not(:disabled) { background: #ffffff !important; transform: scale(1.06); }
          .fp-nav-btn:hover:not(:disabled) svg { stroke: #0F1623 !important; }
        `}</style>

        <div ref={scrollRef} className="fp-track" onScroll={update}>
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>

        {/* Botones laterales */}
        {([
          { dir: -1 as const, side: { left: 8 }, enabled: canLeft, Icon: ChevronLeft, label: 'Anterior' },
          { dir: 1 as const, side: { right: 8 }, enabled: canRight, Icon: ChevronRight, label: 'Siguiente' },
        ]).map(({ dir, side, enabled, Icon, label }) => (
          <button
            key={label}
            className="fp-nav-btn"
            onClick={() => scrollByDir(dir)}
            disabled={!enabled}
            aria-label={label}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              ...side,
              width: 44,
              height: 44,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: enabled ? 'pointer' : 'default',
              opacity: enabled ? 1 : 0.25,
              zIndex: 2,
            }}
          >
            <Icon size={20} color="#ffffff" strokeWidth={2.5} />
          </button>
        ))}
      </div>
    </section>
  );
}
