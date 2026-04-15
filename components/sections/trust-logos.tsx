"use client";

import Marquee from "react-fast-marquee";
import Image from "next/image";
import { useTranslations } from "next-intl";

const logos = [
  { src: "/images/clients/logo-ayuntamiento-tudela.png", alt: "Ayuntamiento de Tudela" },
  { src: "/images/clients/logo-aspil.png", alt: "Aspil" },
  { src: "/images/clients/logo-uvesa.png", alt: "Uvesa" },
];

export function TrustLogos() {
  const t = useTranslations("Index");

  return (
    <section className="w-full bg-[#F8FAFC]">
      {/* Bloque de texto */}
      <div className="text-center flex flex-col items-center" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        <h2
          className="text-[#111827]"
          style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}
        >
          {t('ticker_title')}
        </h2>
        <p
          className="text-[#6b7280]"
          style={{ fontSize: '15px', lineHeight: 1.6, maxWidth: '520px', marginBottom: 0 }}
        >
          {t('ticker_subtitle')}
        </p>
      </div>

      {/* Ticker */}
      <div className="pb-10">
        <Marquee
          speed={40}
          pauseOnHover={true}
          gradient={true}
          gradientColor="#F8FAFC"
          gradientWidth={80}
        >
          {logos.map((logo) => (
            <div key={logo.alt} className="mx-12 flex items-center justify-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                height={48}
                width={150}
                className="h-12 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
