'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles, Bug, Factory, Layers } from 'lucide-react';

/* ─── Card data ──────────────────────────────────────────────────────── */

const CARDS = [
  {
    title: 'Limpieza de Edificios',
    desc: 'Mantenimiento integral para oficinas, comunidades y espacios comerciales.',
    Icon: Sparkles,
    order: '01',
  },
  {
    title: 'Control de Plagas',
    desc: 'Eliminación y prevención de plagas con tratamientos homologados.',
    Icon: Bug,
    order: '02',
  },
  {
    title: 'Limpieza Industrial',
    desc: 'Soluciones especializadas para naves, almacenes y entornos industriales.',
    Icon: Factory,
    order: '03',
  },
  {
    title: 'Tratamiento de Suelos',
    desc: 'Pulido, cristalizado y mantenimiento de todo tipo de pavimentos.',
    Icon: Layers,
    order: '04',
  },
] as const;

/* ─── Component ──────────────────────────────────────────────────────── */

export function TopServices() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section style={{ background: '#0B0C10', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, gap: 32 }}>

          {/* Left: pills + title */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{
                border: '1px solid #546AE7', borderRadius: 9999,
                padding: '4px 14px', fontSize: 12, fontWeight: 600, color: '#546AE7',
                background: 'transparent',
              }}>
                Destacados
              </span>
              <span style={{
                border: '1px solid #546AE7', borderRadius: 9999,
                padding: '4px 14px', fontSize: 12, fontWeight: 600, color: '#546AE7',
                background: 'transparent',
              }}>
                Servicios
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              margin: 0,
            }}>
              Nuestros servicios<br />más solicitados.
            </h2>
          </div>

          {/* Right: description + button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20, maxWidth: 280, paddingTop: 52 }}>
            <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.65, margin: 0 }}>
              Limpieza profesional, control de plagas y mucho más para tu hogar o empresa.
            </p>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              borderRadius: 9999, background: '#546AE7', color: '#ffffff',
              fontSize: 13, fontWeight: 600, padding: '10px 22px',
              border: 'none', cursor: 'pointer',
            }}>
              Ver todos <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* ── Card grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              animate={{
                scale: hovered === null ? 1 : hovered === i ? 1.03 : 0.97,
                y: hovered === i ? -4 : 0,
                opacity: hovered === null ? 1 : hovered === i ? 1 : 0.7,
                zIndex: hovered === i ? 10 : 1,
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              style={{
                background: '#1a1f3a',
                borderRadius: 16,
                borderTop: '3px solid #546AE7',
                height: 320,
                padding: 24,
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
              }}
            >
              {/* Order number — decorative */}
              <span style={{
                position: 'absolute', top: 16, right: 20,
                fontSize: 64, fontWeight: 800,
                color: 'rgba(84, 106, 231, 0.15)',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}>
                {card.order}
              </span>

              {/* Icon + Title */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 54, height: 54, borderRadius: '50%',
                  background: 'rgba(84, 106, 231, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <card.Icon size={24} color="#546AE7" strokeWidth={1.8} />
                </div>
                <h3 style={{
                  fontSize: 22, fontWeight: 700, color: '#546AE7',
                  letterSpacing: '-0.5px', lineHeight: 1.15, margin: 0,
                }}>
                  {card.title}
                </h3>
              </div>

              {/* Description */}
              <p style={{
                fontSize: 13, color: '#9CA3AF',
                lineHeight: 1.55, margin: 0,
              }}>
                {card.desc}
              </p>

              {/* Hover arrow */}
              <AnimatePresence>
                {hovered === i && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    style={{
                      position: 'absolute', bottom: 20, right: 20,
                      width: 36, height: 36, borderRadius: '50%',
                      background: '#546AE7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <ArrowUpRight size={16} color="#ffffff" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
