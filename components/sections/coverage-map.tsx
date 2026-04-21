'use client';

import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./coverage-map-client'), { ssr: false });

const ZONES = ['Navarra', 'La Rioja', 'Aragón'];

const STATS: { bold: string; light: string }[] = [
  { bold: '+55', light: 'años de experiencia' },
  { bold: '+80', light: 'profesionales en plantilla' },
  { bold: '3',   light: 'comunidades autónomas' },
];

export function CoverageMap() {
  return (
    <section style={{ background: '#ffffff', padding: '96px 40px' }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.3fr 1fr',
        gap: 64,
        alignItems: 'center',
      }}>

        {/* ── Mapa en tarjeta gris ── */}
        <div style={{
          background: '#F0F2F5',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          height: 480,
          overflow: 'hidden',
          padding: 8,
        }}>
          <MapClient />
        </div>

        {/* ── Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          {/* Label */}
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#546AE7',
          }}>
            Cobertura geográfica
          </span>

          {/* Zonas */}
          <div>
            <div style={{ height: 1, background: '#546AE7', marginBottom: 22 }} />
            {ZONES.map((zone, i) => (
              <div key={zone}>
                <span style={{
                  display: 'block',
                  fontSize: 30,
                  fontWeight: 800,
                  color: '#111827',
                  letterSpacing: '-0.5px',
                  lineHeight: 1,
                  marginBottom: 22,
                }}>
                  {zone}
                </span>
                <div style={{
                  height: 1,
                  background: '#E5E7EB',
                  marginBottom: i < ZONES.length - 1 ? 22 : 0,
                }} />
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {STATS.map(s => (
              <p key={s.light} style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.4 }}>
                <strong style={{ color: '#111827', fontWeight: 800, marginRight: 4 }}>{s.bold}</strong>
                {s.light}
              </p>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
