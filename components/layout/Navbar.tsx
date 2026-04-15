'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      }}
    >
      {/* Logo — left */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
        <Image
          src="/images/brand/logo-grupo-rubio.webp"
          alt="Grupo Rubio"
          height={36}
          width={160}
          style={{ height: 36, width: 'auto' }}
          priority
        />
      </Link>

      {/* Right group: links + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
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

        <Link
          href="/contacto"
          style={{
            display: 'inline-flex',
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
      </div>
    </nav>
  );
}
