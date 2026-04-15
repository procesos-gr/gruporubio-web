'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Servicios', href: '/servicios' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        right: 16,
        height: 72,
        zIndex: 50,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        /* At top: transparent → blends with the grey hero card behind it.
           On scroll: frosted white so it reads clearly over any content. */
        background: scrolled ? 'rgba(255,255,255,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.07)' : 'none',
        transition: 'background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          textDecoration: 'none',
          marginLeft: 16,
        }}
      >
        <Image
          src="/images/brand/logo-grupo-rubio.webp"
          alt="Grupo Rubio"
          height={58}
          width={240}
          style={{ height: 58, width: 'auto' }}
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
              fontSize: 15,
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
            borderRadius: 10,
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
