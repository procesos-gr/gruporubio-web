'use client';

import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./coverage-map-client'), { ssr: false });

/* ─── Stats ──────────────────────────────────────────────────────────── */

const STATS = [
  { number: '+50', label: 'Años de experiencia', icon: '◆' },
  { number: '+80', label: 'Profesionales en plantilla', icon: '◆' },
  { number: '3',   label: 'Comunidades autónomas', icon: '◆' },
];

const ZONES = ['Navarra', 'La Rioja', 'Aragón'];

/* ─── Component ──────────────────────────────────────────────────────── */

export function CoverageMap() {
  return (
    <section style={{ background: '#07090F', padding: '80px 40px', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient glow — background */}
      <div style={{
        position: 'absolute', top: '-20%', left: '30%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 48, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            border: '1px solid rgba(74,222,128,0.4)',
            borderRadius: 6, padding: '4px 12px', width: 'fit-content',
            background: 'rgba(74,222,128,0.06)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', flexShrink: 0, boxShadow: '0 0 6px #4ade80' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#4ade80', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Cobertura
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 44px)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            margin: 0,
          }}>
            Estamos donde nos necesitas
          </h2>
          <p style={{ fontSize: 15, color: '#6B7280', margin: 0, lineHeight: 1.6, maxWidth: 460 }}>
            Operamos en tres comunidades autónomas del norte de España con más de 50 años de trayectoria.
          </p>
        </div>

        {/* ── Grid: mapa + sidebar ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>

          {/* Mapa */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8,
            overflow: 'hidden',
            position: 'relative',
          }}>
            <MapClient />
          </div>

          {/* Sidebar: stats + zonas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Stats */}
            {STATS.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: '#4ade80',
                  lineHeight: 1,
                  letterSpacing: '-1px',
                }}>
                  {stat.number}
                </span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                  {stat.label}
                </span>
              </div>
            ))}

            {/* Zonas cubiertas */}
            <div style={{
              background: 'rgba(74,222,128,0.06)',
              border: '1px solid rgba(74,222,128,0.2)',
              borderRadius: 8,
              padding: '20px 24px',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(74,222,128,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                Zonas de servicio
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ZONES.map((zone) => (
                  <div key={zone} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: '#4ade80',
                      boxShadow: '0 0 8px rgba(74,222,128,0.8)',
                    }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>{zone}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
