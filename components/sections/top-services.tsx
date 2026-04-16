'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

/* ─── Types ──────────────────────────────────────────────────────────── */

type FilterKey = 'Limpieza' | 'Plagas' | 'Seguridad Alimentaria' | 'Maquinaria';

interface ServiceCard {
  title: string;
  img: string;
}

/* ─── Data ───────────────────────────────────────────────────────────── */

const FILTERS: FilterKey[] = ['Limpieza', 'Plagas', 'Seguridad Alimentaria', 'Maquinaria'];

const CARDS: Record<FilterKey, ServiceCard[]> = {
  Limpieza: [
    {
      title: 'Servicios Globales de Higiene',
      img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=520&fit=crop&auto=format',
    },
    {
      title: 'Limpieza Industrial',
      img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=520&fit=crop&auto=format',
    },
    {
      title: 'Limpiezas en Altura',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=520&fit=crop&auto=format',
    },
    {
      title: 'Tratamiento de Suelos',
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=520&fit=crop&auto=format',
    },
  ],
  Plagas: [
    {
      title: 'Desratización y Desinsectación',
      img: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800&h=520&fit=crop&auto=format',
    },
    {
      title: 'Control de Termitas',
      img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=520&fit=crop&auto=format',
    },
    {
      title: 'Tratamiento de Legionela',
      img: 'https://images.unsplash.com/photo-1548407260-da850faa41e3?w=800&h=520&fit=crop&auto=format',
    },
    {
      title: 'Ozonización',
      img: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=520&fit=crop&auto=format',
    },
  ],
  'Seguridad Alimentaria': [
    {
      title: 'APPCC',
      img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=520&fit=crop&auto=format',
    },
    {
      title: 'Formación Manipulador de Alimentos',
      img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=520&fit=crop&auto=format',
    },
    {
      title: 'Auditorías Sanitarias',
      img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=520&fit=crop&auto=format',
    },
    {
      title: 'Consultoría Alimentaria',
      img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=520&fit=crop&auto=format',
    },
  ],
  Maquinaria: [
    {
      title: 'Alquiler de Maquinaria',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=520&fit=crop&auto=format',
    },
    {
      title: 'Servicio Técnico Kärcher',
      img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=520&fit=crop&auto=format',
    },
    {
      title: 'Reparaciones',
      img: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=520&fit=crop&auto=format',
    },
    {
      title: 'Venta de Equipos',
      img: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=520&fit=crop&auto=format',
    },
  ],
};

/* ─── Component ──────────────────────────────────────────────────────── */

export function TopServices() {
  const [active, setActive] = useState<FilterKey>('Limpieza');

  return (
    <section style={{ background: '#0B0C10', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 40,
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            margin: 0,
          }}>
            Nuestros servicios
          </h2>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => {
              const isActive = active === f;
              return (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  style={{
                    border: '1px solid #546AE7',
                    borderRadius: 9999,
                    padding: '8px 18px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s ease, color 0.2s ease',
                    background: isActive ? '#546AE7' : 'transparent',
                    color: isActive ? '#ffffff' : '#546AE7',
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Cards grid with AnimatePresence ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
            }}
          >
            {CARDS[active].map((card, i) => (
              <motion.div
                key={card.title}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  background: '#1a1f3a',
                  borderRadius: 12,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                }}
              >
                {/* Image — 60% height */}
                <div style={{ position: 'relative', height: 200 }}>
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 25vw"
                    className="object-cover object-center"
                  />
                  {/* Arrow button over image */}
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.22)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ArrowUpRight size={15} color="#ffffff" />
                  </div>
                </div>

                {/* Title */}
                <div style={{ padding: '14px 16px 18px' }}>
                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: 1.3,
                    letterSpacing: '-0.2px',
                  }}>
                    {card.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
