"use client";

import Marquee from "react-fast-marquee";
import Image from "next/image";
import { useTranslations } from "next-intl";

const logos = [
  { src: "/images/clients/logo-ayuntamiento-tudela.png", alt: "Ayuntamiento de Tudela" },
  { src: "/images/clients/logo-aspil.png", alt: "Aspil" },
  { src: "/images/clients/logo-uvesa.png", alt: "Uvesa" },
  { src: "/images/clients/logo-urzante.png", alt: "Urzante" },
  { src: "/images/clients/sendaviva.png", alt: "Sendaviva" },
  { src: "/images/clients/remigio.png", alt: "Hotel Remigio" },
  { src: "/images/clients/samanes.png", alt: "Samanes" },
  { src: "/images/clients/hoteldelta.png", alt: "Hotel Delta+", invert: true },
  { src: "/images/clients/bodegacirsus.png", alt: "Bodegas Cirsus" },
];

export function TrustLogos() {
  const t = useTranslations("Index");

  return (
    <section className="w-full bg-white">
      <div className="text-center flex flex-col items-center" style={{ paddingTop: 80, paddingBottom: 48, paddingLeft: 24, paddingRight: 24 }}>

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
        {t('ticker_subtitle') && (
          <p style={{
            fontSize: 15,
            color: '#6B7280',
            lineHeight: 1.65,
            maxWidth: 500,
            marginBottom: 0,
          }}>
            {t('ticker_subtitle')}
          </p>
        )}

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
            <div key={logo.alt} style={{ margin: '0 56px', width: 140, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Image
                src={logo.src}
                alt={logo.alt}
                height={48}
                width={140}
                className={`object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300${logo.invert ? ' invert' : ''}`}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
