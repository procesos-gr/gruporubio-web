'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/* ─── SVG Icons ─────────────────────────────────────────────────────── */

function BroomIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 4 L9 20" />
      <path d="M7 17 Q9 21 11 21 L15 21 Q17 21 19 17 Z" />
      <line x1="9" y1="14" x2="19" y2="14" />
    </svg>
  );
}

function BugIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="14" rx="4" ry="5" />
      <circle cx="12" cy="7.5" r="2.5" />
      <line x1="8.5" y1="11.5" x2="4" y2="9" />
      <line x1="8.5" y1="14" x2="4" y2="14" />
      <line x1="8.5" y1="16.5" x2="4" y2="19" />
      <line x1="15.5" y1="11.5" x2="20" y2="9" />
      <line x1="15.5" y1="14" x2="20" y2="14" />
      <line x1="15.5" y1="16.5" x2="20" y2="19" />
      <line x1="10.5" y1="5.5" x2="9.5" y2="3" />
      <line x1="13.5" y1="5.5" x2="14.5" y2="3" />
    </svg>
  );
}

function FactoryIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20 L2 11 L8 8 L8 11 L14 8 L14 11 L22 8 L22 20 Z" />
      <rect x="9" y="14" width="2.5" height="6" rx="0.5" />
      <rect x="12.5" y="14" width="2.5" height="6" rx="0.5" />
      <line x1="5" y1="2" x2="5" y2="8" />
      <line x1="3" y1="2" x2="7" y2="2" />
    </svg>
  );
}

function FloorIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="17" width="18" height="4" rx="2" />
      <line x1="12" y1="17" x2="12" y2="10" />
      <line x1="12" y1="10" x2="7" y2="5" />
      <line x1="7" y1="5" x2="17" y2="5" />
      <line x1="17" y1="5" x2="12" y2="10" />
      <line x1="9" y1="5" x2="9" y2="2" />
      <line x1="15" y1="5" x2="15" y2="2" />
    </svg>
  );
}

/* ─── Card data ──────────────────────────────────────────────────────── */

const CARDS = [
  {
    bg: '#4A152B',
    text: '#ffffff',
    iconBg: 'rgba(255,255,255,0.13)',
    arrowBg: 'rgba(255,255,255,0.18)',
    title: 'Limpieza de Edificios',
    desc: 'Mantenimiento integral para oficinas, comunidades y espacios comerciales.',
    Icon: BroomIcon,
  },
  {
    bg: '#F6C5DB',
    text: '#4A152B',
    iconBg: 'rgba(74,21,43,0.12)',
    arrowBg: 'rgba(74,21,43,0.12)',
    title: 'Control de Plagas',
    desc: 'Eliminación y prevención de plagas con tratamientos homologados.',
    Icon: BugIcon,
  },
  {
    bg: '#3B42B4',
    text: '#ffffff',
    iconBg: 'rgba(255,255,255,0.13)',
    arrowBg: 'rgba(255,255,255,0.18)',
    title: 'Limpieza Industrial',
    desc: 'Soluciones especializadas para naves, almacenes y entornos industriales.',
    Icon: FactoryIcon,
  },
  {
    bg: '#8AE9B3',
    text: '#0B3D2E',
    iconBg: 'rgba(11,61,46,0.12)',
    arrowBg: 'rgba(11,61,46,0.12)',
    title: 'Tratamiento de Suelos',
    desc: 'Pulido, cristalizado y mantenimiento de todo tipo de pavimentos.',
    Icon: FloorIcon,
  },
] as const;

/* ─── Component ──────────────────────────────────────────────────────── */

export function TopServices() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section style={{ padding: '80px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, gap: 32 }}>

        {/* Left: tags + title */}
        <div style={{ flexShrink: 0 }}>
          {/* Pill tags row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <span style={{ fontSize: 16, color: '#111827' }}>✦</span>
            <span style={{
              border: '1.5px solid #D1D5DB', borderRadius: 999,
              padding: '3px 13px', fontSize: 12, fontWeight: 600, color: '#374151',
            }}>
              Destacados
            </span>
            <span style={{
              border: '1.5px solid #D1D5DB', borderRadius: 999,
              padding: '3px 13px', fontSize: 12, fontWeight: 600, color: '#374151',
            }}>
              Servicios
            </span>
          </div>
          {/* Title */}
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 800,
            color: '#111827',
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            margin: 0,
          }}>
            Nuestros servicios<br />más solicitados.
          </h2>
        </div>

        {/* Right: description + button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20, maxWidth: 280, paddingTop: 48 }}>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.65, margin: 0 }}>
            Limpieza profesional, control de plagas y mucho más para tu hogar o empresa.
          </p>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            borderRadius: 999, background: '#111827', color: '#fff',
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
              opacity: hovered === null ? 1 : hovered === i ? 1 : 0.82,
              zIndex: hovered === i ? 10 : 1,
            }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            style={{
              background: card.bg,
              borderRadius: 16,
              height: 320,
              padding: 24,
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Icon container */}
            <div style={{
              width: 50, height: 50, borderRadius: 12,
              background: card.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <card.Icon color={card.text} />
            </div>

            {/* Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h3 style={{
                fontSize: 18, fontWeight: 700, color: card.text,
                letterSpacing: '-0.3px', lineHeight: 1.2, margin: 0,
              }}>
                {card.title}
              </h3>
              <p style={{
                fontSize: 13, color: card.text, opacity: 0.68,
                lineHeight: 1.55, margin: 0,
              }}>
                {card.desc}
              </p>
            </div>

            {/* Hover arrow — fades in */}
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
                    background: card.arrowBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <ArrowUpRight size={16} color={card.text} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
