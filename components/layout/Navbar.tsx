'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Servicios', href: '/servicios' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

export function Navbar() {
  return (
    <nav
      className="fixed top-0 z-50 w-full h-16 bg-[#F8F9FA]"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px' }}
    >
      {/* Logo — left */}
      <Link href="/" className="flex items-center gap-2 flex-shrink-0">
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 28, height: 28, borderRadius: 8, background: '#546AE7' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1.5L12.5 4.25V9.75L7 12.5L1.5 9.75V4.25L7 1.5Z" fill="white" />
            <circle cx="7" cy="7" r="2.2" fill="#546AE7" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#111827', letterSpacing: '-0.01em' }}>
          Grupo Rubio
        </span>
      </Link>

      {/* Links — centered absolutely */}
      <div
        className="hidden md:flex items-center"
        style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', gap: 32 }}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center hover:text-[#111827] transition-colors"
            style={{ gap: 3, fontSize: 14, fontWeight: 500, color: '#374151' }}
          >
            {link.label}
            <ChevronDown size={13} color="#9CA3AF" style={{ marginTop: 1 }} />
          </Link>
        ))}
      </div>

      {/* CTA — right */}
      <Link
        href="/contacto"
        className="hidden sm:inline-flex items-center gap-1.5 hover:bg-[#4459d6] transition-colors flex-shrink-0 whitespace-nowrap"
        style={{
          borderRadius: 9999,
          background: '#546AE7',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          padding: '10px 24px',
        }}
      >
        Solicitar presupuesto <span aria-hidden="true">→</span>
      </Link>
    </nav>
  );
}
