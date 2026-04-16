import { ArrowUpRight } from 'lucide-react';

export function CTABanner() {
  return (
    <div style={{ background: '#ffffff', padding: '0 0 80px' }}>
      <div
        style={{
          margin: '0 40px',
          background: '#546AE7',
          borderRadius: '60px 60px 60px 60px / 80px 80px 80px 80px',
          padding: '60px 80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 40,
        }}
      >
        {/* ── Left: text + button ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 520 }}>
          <h2 style={{
            fontSize: 'clamp(26px, 3vw, 38px)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-1px',
            lineHeight: 1.15,
            margin: 0,
          }}>
            ¿No sabes qué servicio necesitas?
          </h2>
          <p style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.65,
            margin: 0,
          }}>
            Cuéntanos tu caso y te asesoramos sin compromiso.
          </p>
          <div>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#111827',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              padding: '14px 28px',
              borderRadius: 9999,
              border: 'none',
              cursor: 'pointer',
              marginTop: 8,
            }}>
              Contactar ahora <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* ── Right: placeholder ── */}
        <div style={{
          width: 300,
          height: 300,
          flexShrink: 0,
          borderRadius: 16,
          border: '2px dashed rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.45)',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}>
            Imagen próximamente
          </span>
        </div>
      </div>
    </div>
  );
}
