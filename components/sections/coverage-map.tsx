'use client';

import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./coverage-map-client'), { ssr: false });

/* ─── Stats ──────────────────────────────────────────────────────────── */

const STATS = [
  { number: '+50', label: 'años de experiencia' },
  { number: '+80', label: 'profesionales en plantilla' },
  { number: '3',   label: 'comunidades autónomas' },
];

/* ─── Component ──────────────────────────────────────────────────────── */

export function CoverageMap() {
  return (
    <div style={{ margin: '0 16px 80px', background: '#F0F2F5', borderRadius: 16, padding: '60px 40px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          border: '1px solid #546AE7',
          borderRadius: 6, padding: '4px 12px',
          marginBottom: 14,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#546AE7', letterSpacing: '0.06em' }}>
            Cobertura
          </span>
        </div>
        <h2 style={{
          fontSize: 'clamp(26px, 3vw, 38px)',
          fontWeight: 800,
          color: '#111827',
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

      {/* ── Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        gap: 40,
        alignItems: 'center',
      }}>

        {/* Mapa */}
        <div>
          <MapClient />
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {STATS.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#ffffff',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <span style={{
                fontSize: 42,
                fontWeight: 800,
                color: '#546AE7',
                lineHeight: 1,
                letterSpacing: '-1.5px',
              }}>
                {stat.number}
              </span>
              <span style={{
                fontSize: 14,
                color: '#6B7280',
                lineHeight: 1.4,
                fontWeight: 500,
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
