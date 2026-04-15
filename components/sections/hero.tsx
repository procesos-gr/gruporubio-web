'use client';

import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';

export function Hero() {
  return (
    <section className="w-full bg-[#F8F9FA] pt-32 pb-12">
      <div className="flex flex-col items-center text-center px-6 max-w-3xl mx-auto">

        {/* Pill badge */}
        <div
          className="inline-flex items-center gap-2 mb-8"
          style={{
            borderRadius: 9999,
            background: '#EEF2FF',
            border: '1px solid #C7D2FE',
            color: '#546AE7',
            fontSize: 12,
            fontWeight: 600,
            padding: '6px 16px',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#546AE7', display: 'inline-block' }} />
          Servicios profesionales en Navarra
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(44px, 6vw, 62px)',
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
            color: '#6B7280',
            lineHeight: 1.6,
            maxWidth: 480,
            marginBottom: 40,
          }}
        >
          Servicios profesionales de limpieza, control de plagas y productos de higiene
          para hogares y empresas en Navarra.
        </motion.p>

        {/* Search bar */}
        <div
          className="w-full flex items-center bg-white"
          style={{
            maxWidth: 580,
            borderRadius: 9999,
            border: '1.5px solid #e5e7eb',
            padding: '6px 6px 6px 20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          {/* Zone picker */}
          <button
            className="flex items-center gap-2 flex-shrink-0 hover:text-[#546AE7] transition-colors"
            style={{ fontSize: 13, fontWeight: 500, color: '#111827', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', whiteSpace: 'nowrap' }}
          >
            <MapPin size={15} color="#6B7280" />
            Municipio o zona
          </button>

          {/* Separator */}
          <div style={{ width: 1, height: 20, background: '#e5e7eb', flexShrink: 0, margin: '0 12px' }} />

          {/* Search input */}
          <input
            type="text"
            placeholder="Busca servicios o productos..."
            readOnly
            className="flex-1 min-w-0 bg-transparent outline-none border-0"
            style={{ fontSize: 13, color: '#111827' }}
          />

          {/* Search button */}
          <button
            className="flex items-center gap-2 flex-shrink-0 hover:bg-[#1f2937] transition-colors"
            style={{
              borderRadius: 9999,
              background: '#111827',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
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
