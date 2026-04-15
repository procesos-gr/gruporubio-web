'use client';

import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';

function CleanerIllustration() {
  return (
    <svg width="160" height="220" viewBox="0 0 160 220" fill="none" aria-hidden="true">
      {/* Head */}
      <circle cx="78" cy="32" r="22" fill="#FDBCB4" />
      {/* Hair */}
      <path d="M56 28 Q78 10 100 28 Q100 16 78 10 Q56 16 56 28Z" fill="#3D2B1F" />
      {/* Uniform body */}
      <rect x="58" y="56" width="40" height="54" rx="8" fill="#546AE7" />
      {/* Left arm reaching out/down */}
      <rect
        x="38" y="60" width="24" height="11" rx="5.5"
        fill="#546AE7"
        transform="rotate(35 50 65)"
      />
      {/* Right arm */}
      <rect
        x="96" y="60" width="22" height="11" rx="5.5"
        fill="#546AE7"
        transform="rotate(-15 107 65)"
      />
      {/* Legs */}
      <rect x="61" y="108" width="15" height="46" rx="7.5" fill="#374151" />
      <rect x="82" y="108" width="15" height="46" rx="7.5" fill="#374151" />
      {/* Shoes */}
      <rect x="57" y="150" width="22" height="11" rx="5.5" fill="#1F2937" />
      <rect x="79" y="150" width="22" height="11" rx="5.5" fill="#1F2937" />
      {/* Mop handle */}
      <line x1="50" y1="70" x2="22" y2="185" stroke="#9CA3AF" strokeWidth="5" strokeLinecap="round" />
      {/* Mop head base */}
      <ellipse cx="22" cy="188" rx="18" ry="7" fill="#D1D5DB" />
      {/* Mop strands */}
      {[10, 15, 20, 25, 30, 34].map((x, i) => (
        <line key={i} x1={x} y1="188" x2={x - 1} y2="208" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {/* Cloth in hand */}
      <rect x="36" y="84" width="20" height="14" rx="5" fill="#E0E7FF" transform="rotate(30 46 91)" />
    </svg>
  );
}

function PestControlIllustration() {
  return (
    <svg width="160" height="220" viewBox="0 0 160 220" fill="none" aria-hidden="true">
      {/* Head */}
      <circle cx="80" cy="32" r="22" fill="#FDBCB4" />
      {/* Safety cap */}
      <path d="M58 28 Q80 8 102 28 Q98 14 80 10 Q62 14 58 28Z" fill="#F59E0B" />
      <rect x="56" y="27" width="48" height="6" rx="3" fill="#D97706" />
      {/* Face mask hint */}
      <rect x="66" y="40" width="28" height="14" rx="6" fill="#E5E7EB" opacity="0.7" />
      {/* Uniform body */}
      <rect x="58" y="56" width="42" height="55" rx="8" fill="#16A34A" />
      {/* Backpack tank */}
      <rect x="100" y="58" width="28" height="48" rx="10" fill="#6B7280" />
      <rect x="105" y="65" width="18" height="34" rx="6" fill="#9CA3AF" />
      <circle cx="114" cy="64" r="4" fill="#D1D5DB" />
      {/* Hose from tank to hand */}
      <path d="M100 90 Q86 94 76 86 Q66 80 52 84" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Left arm extended with wand */}
      <rect
        x="36" y="77" width="26" height="10" rx="5"
        fill="#16A34A"
        transform="rotate(-10 49 82)"
      />
      {/* Spray wand */}
      <rect x="5" y="75" width="33" height="7" rx="3.5" fill="#4B5563" />
      {/* Nozzle cone */}
      <path d="M5 76 L0 82 L5 82Z" fill="#374151" />
      {/* Spray droplets */}
      <circle cx="0" cy="80" r="2" fill="#A7F3D0" opacity="0.7" />
      <circle cx="-4" cy="76" r="1.5" fill="#A7F3D0" opacity="0.5" />
      <circle cx="-3" cy="84" r="1.5" fill="#A7F3D0" opacity="0.5" />
      {/* Right arm at tank */}
      <rect
        x="96" y="64" width="18" height="10" rx="5"
        fill="#16A34A"
        transform="rotate(10 105 69)"
      />
      {/* Legs */}
      <rect x="62" y="109" width="15" height="45" rx="7.5" fill="#374151" />
      <rect x="81" y="109" width="15" height="45" rx="7.5" fill="#374151" />
      {/* Boots */}
      <rect x="58" y="150" width="22" height="12" rx="6" fill="#1F2937" />
      <rect x="79" y="150" width="22" height="12" rx="6" fill="#1F2937" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative w-full bg-[#F8F9FA] pt-32 pb-20 overflow-hidden">
      {/* Left illustration */}
      <div className="absolute left-4 xl:left-16 bottom-8 hidden lg:block opacity-90 select-none pointer-events-none">
        <CleanerIllustration />
      </div>

      {/* Right illustration */}
      <div className="absolute right-4 xl:right-16 bottom-8 hidden lg:block opacity-90 select-none pointer-events-none">
        <PestControlIllustration />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF2FF] text-[#546AE7] text-[12px] font-semibold mb-8 border border-[#C7D2FE]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#546AE7] inline-block" />
          Servicios profesionales en Navarra
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-[52px] md:text-[62px] font-extrabold text-[#111827] leading-[1.08] tracking-[-2px] mb-5"
        >
          Tu espacio,<br />siempre impecable.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
          className="text-[15px] text-[#6B7280] leading-relaxed max-w-[480px] mb-10"
        >
          Servicios profesionales de limpieza, control de plagas y productos de higiene
          para hogares y empresas en Navarra.
        </motion.p>

        {/* Search bar */}
        <div className="w-full max-w-[580px] flex items-center bg-white rounded-full border border-[#e5e7eb] px-2 py-1.5"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {/* Zone picker */}
          <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-[#111827] hover:text-[#546AE7] transition-colors whitespace-nowrap rounded-full hover:bg-[#F8F9FA] flex-shrink-0">
            <MapPin size={15} className="text-[#6B7280]" />
            <span>Municipio o zona</span>
          </button>

          {/* Separator */}
          <div className="w-px h-5 bg-[#e5e7eb] flex-shrink-0 mx-1" />

          {/* Search input */}
          <input
            type="text"
            placeholder="Busca servicios o productos..."
            className="flex-1 bg-transparent text-[13px] text-[#111827] placeholder:text-[#9CA3AF] outline-none border-0 px-3 min-w-0"
            readOnly
          />

          {/* Search button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827] text-white text-[13px] font-semibold hover:bg-[#1f2937] transition-colors flex-shrink-0 whitespace-nowrap">
            <Search size={14} />
            Buscar
          </button>
        </div>
      </div>
    </section>
  );
}
