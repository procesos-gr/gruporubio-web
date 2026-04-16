"use client";

import Marquee from "react-fast-marquee";
import Image from "next/image";
import { useTranslations } from "next-intl";

const logos = [
  { src: "/images/clients/logo-ayuntamiento-tudela.png", alt: "Ayuntamiento de Tudela" },
  { src: "/images/clients/logo-aspil.png", alt: "Aspil" },
  { src: "/images/clients/logo-uvesa.png", alt: "Uvesa" },
];

const STATS = [
  { value: "+500", label: "clientes activos" },
  { value: "+50 años", label: "de experiencia" },
  { value: "3", label: "comunidades autónomas" },
];

export function TrustLogos() {
  const t = useTranslations("Index");

  return (
    <section className="w-full bg-white">
      <div className="text-center flex flex-col items-center" style={{ paddingTop: 80, paddingBottom: 48, paddingLeft: 24, paddingRight: 24 }}>

        {/* Pill badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#EEF2FF', border: '1px solid #C7D2FE',
          borderRadius: 999, padding: '4px 14px',
          fontSize: 11, fontWeight: 700, color: '#546AE7',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#546AE7', display: 'inline-block' }} />
          Empresas que confían en nosotros
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 800,
          color: '#111827',
          letterSpacing: '-1px',
          lineHeight: 1.1,
          marginBottom: 16,
          maxWidth: 640,
        }}>
          {t('ticker_title')}
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: 15,
          color: '#6B7280',
          lineHeight: 1.65,
          maxWidth: 500,
          marginBottom: 48,
        }}>
          {t('ticker_subtitle')}
        </p>

        {/* Stats row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          borderRadius: 16, overflow: 'hidden',
          border: '1px solid #E5E7EB',
          marginBottom: 56,
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '18px 36px',
              borderRight: i < STATS.length - 1 ? '1px solid #E5E7EB' : 'none',
              background: '#fff',
            }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#111827', letterSpacing: '-1px', lineHeight: 1 }}>
                {s.value}
              </span>
              <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, marginTop: 4, whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Logo ticker */}
      <div style={{ paddingBottom: 64 }}>
        <Marquee
          speed={38}
          pauseOnHover
          gradient
          gradientColor="#ffffff"
          gradientWidth={100}
        >
          {logos.map((logo) => (
            <div key={logo.alt} style={{ margin: '0 56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src={logo.src}
                alt={logo.alt}
                height={56}
                width={180}
                className="h-14 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
