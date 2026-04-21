'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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

function ProductCard({ product }: { product: typeof PRODUCTS[number] }) {
  return (
    <Link href="/tienda" style={{ textDecoration: 'none', display: 'block' }}>
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      style={{
        borderRadius: 8,
        border: '1px solid #E5E7EB',
        cursor: 'pointer',
        background: '#ffffff',
        overflow: 'hidden',
        fontFamily: 'var(--font-plus-jakarta), sans-serif',
      }}
    >
      {/* Image — tall, dominates the card */}
      <div style={{ position: 'relative', height: 155, overflow: 'hidden' }}>
        <motion.div
          variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="20vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Rating chip — top right */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            borderRadius: 9999,
            padding: '2px 7px',
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

      {/* Compact info strip */}
      <div
        style={{
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.name}
          </p>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>
            {product.price}
          </span>
        </div>

        {/* Arrow — appears on hover */}
        <motion.div
          variants={{ rest: { opacity: 0, scale: 0.8 }, hover: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: 6,
            background: '#546AE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowRight size={13} color="#ffffff" strokeWidth={2.5} />
        </motion.div>
      </div>
    </motion.div>
    </Link>
  );
}

export function FeaturedProducts() {
  return (
    <section style={{ background: '#ffffff', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: 48, alignItems: 'center' }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2
              style={{
                fontSize: 'clamp(24px, 2.8vw, 34px)',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-1px',
                lineHeight: 1.15,
                margin: 0,
                fontFamily: 'var(--font-plus-jakarta), sans-serif',
              }}
            >
              Lo que nuestros clientes más eligen
            </h2>
            <p
              style={{
                fontSize: 15,
                color: '#6B7280',
                margin: 0,
                lineHeight: 1.65,
                fontFamily: 'var(--font-plus-jakarta), sans-serif',
              }}
            >
              Selección de productos profesionales de limpieza, higiene y desinfección
              utilizados por empresas, restaurantes y centros de trabajo en toda la región.
            </p>
            <div>
              <Link
                href="/tienda"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#111827',
                  color: '#ffffff',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-plus-jakarta), sans-serif',
                }}
              >
                Ver Tienda <ArrowRight size={13} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Right: 2×3 grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {PRODUCTS.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
