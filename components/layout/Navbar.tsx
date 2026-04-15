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
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        padding: '0 32px',
        position: 'relative',
        background: 'transparent',
      }}
    >
      {/* Logo — left */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, textDecoration: 'none' }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: '#546AE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
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

      {/* Links — centered absolutely within the nav */}
      <div
        className="hidden md:flex"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          alignItems: 'center',
          gap: 32,
        }}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 14,
              fontWeight: 500,
              color: '#374151',
              textDecoration: 'none',
            }}
          >
            {link.label}
            <ChevronDown size={13} color="#9CA3AF" style={{ marginTop: 1 }} />
          </Link>
        ))}
      </div>

      {/* CTA — right */}
      <Link
        href="/contacto"
        className="hidden sm:inline-flex"
        style={{
          alignItems: 'center',
          gap: 6,
          borderRadius: 9999,
          background: '#546AE7',
          color: '#ffffff',
          fontSize: 13,
          fontWeight: 600,
          padding: '10px 24px',
          textDecoration: 'none',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        Solicitar presupuesto <span aria-hidden="true">→</span>
      </Link>
    </nav>
  );
}
