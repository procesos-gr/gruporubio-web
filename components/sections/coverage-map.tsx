'use client';

import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./coverage-map-client'), { ssr: false });

/* ─── Stats cards ────────────────────────────────────────────────────── */

const STATS = [
  { number: '+50', label: 'años de experiencia' },
  { number: '+80', label: 'profesionales en plantilla' },
  { number: '3',   label: 'comunidades autónomas' },
];

/* ─── Component ──────────────────────────────────────────────────────── */

export function CoverageMap() {
  return (
    <section style={{ background: '#0B0C10', padding: '80px 40px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 6, padding: '4px 12px',
          marginBottom: 14,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>
            Cobertura
          </span>
        </div>
        <h2 style={{
          fontSize: 'clamp(26px, 3vw, 38px)',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-1px',
          lineHeight: 1.15,
          margin: '0 0 10px',
        }}>
          Estamos donde nos necesitas
        </h2>
        <p style={{ fontSize: 15, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
          Prestamos servicio en Navarra, Aragón y La Rioja
        </p>
      </div>

      {/* ── Grid: mapa + stats ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        gap: 24,
        alignItems: 'stretch',
      }}>

        {/* Mapa */}
        <div style={{ borderRadius: 8, overflow: 'hidden' }}>
          <MapClient />
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {STATS.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#1a1f3a',
                borderRadius: 8,
                padding: '24px 28px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <span style={{
                fontSize: 44,
                fontWeight: 800,
                color: '#4ade80',
                lineHeight: 1,
                letterSpacing: '-1.5px',
              }}>
                {stat.number}
              </span>
              <span style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.4,
                fontWeight: 500,
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
