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
    <nav className="fixed w-full h-16 flex items-center px-6 lg:px-12 top-0 z-50 bg-[#F8F9FA]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#546AE7] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1.5L12.5 4.25V9.75L7 12.5L1.5 9.75V4.25L7 1.5Z" fill="white" strokeWidth="0" />
            <circle cx="7" cy="7" r="2.2" fill="#546AE7" />
          </svg>
        </div>
        <span className="font-bold text-[#111827] text-[15px] tracking-tight">Grupo Rubio</span>
      </Link>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-0.5 text-[14px] font-medium text-[#374151] hover:text-[#111827] transition-colors"
          >
            {link.label}
            <ChevronDown size={13} className="text-[#9CA3AF] mt-px" />
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="ml-auto">
        <Link
          href="/contacto"
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#546AE7] text-white text-[13px] font-semibold hover:bg-[#4459d6] transition-colors whitespace-nowrap"
        >
          Solicitar presupuesto
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </nav>
  );
}
