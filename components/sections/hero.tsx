'use client';

import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  return (
    <section style={{ padding: '130px 24px 90px', position: 'relative', overflow: 'hidden' }}>

      {/* Hero banner — fondo sutil */}
      <Image
        src="/images/hero/hero-banner.webp"
        alt=""
        fill
        priority
        quality={85}
        className="object-cover object-center"
        style={{ opacity: 0.55 }}
      />


      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(44px, 5.5vw, 62px)',
            fontWeight: 800,
            color: '#111827',
            lineHeight: 1.08,
            letterSpacing: '-2px',
            marginBottom: 20,
          }}
        >
          Tu espacio,<br />siempre impecable.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
          style={{
            fontSize: 15,
            color: '#1F2937',
            lineHeight: 1.6,
            maxWidth: 480,
            marginBottom: 40,
          }}
        >
          Servicios profesionales de limpieza, control de plagas y productos de higiene
          para hogares y empresas.
        </motion.p>

        {/* Search bar */}
        <div
          style={{
            width: '100%',
            maxWidth: 560,
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: 14,
            border: '1.5px solid #e5e7eb',
            padding: '6px 6px 6px 20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          {/* Zone picker */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 500,
              color: '#111827',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <MapPin size={15} color="#6B7280" />
            Municipio o zona
          </button>

          {/* Separator */}
          <div style={{ width: 1, height: 20, background: '#e5e7eb', flexShrink: 0, margin: '0 14px' }} />

          {/* Search input */}
          <input
            type="text"
            placeholder="Busca servicios o productos..."
            readOnly
            style={{
              flex: 1,
              minWidth: 0,
              background: 'transparent',
              outline: 'none',
              border: 'none',
              fontSize: 13,
              color: '#111827',
            }}
            className="placeholder:text-[#9CA3AF]"
          />

          {/* Search button */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 10,
              background: '#111827',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <Search size={14} />
            Buscar
          </button>
        </div>

      </div>
    </section>
  );
}
