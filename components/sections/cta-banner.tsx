import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function CTABanner() {
  return (
    <div style={{ background: '#ffffff', padding: '0 0 80px' }}>
      <div style={{ margin: '0 40px', position: 'relative' }}>

        <svg
          viewBox="0 0 1000 280"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        >
          <path
            d="M 0,24 Q 500,0 1000,24 L 1000,256 Q 500,280 0,256 Z"
            fill="#546AE7"
          />
        </svg>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '60px 100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 16,
          }}
        >
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
          <Link href="/contacto" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#111827',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 700,
            padding: '14px 28px',
            borderRadius: 8,
            textDecoration: 'none',
            marginTop: 8,
          }}>
            Contactar ahora <ArrowUpRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
