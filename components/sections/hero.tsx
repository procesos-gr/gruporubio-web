'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Wrench, Sparkles, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SERVICES } from '@/lib/services-data';
import { getMedusa } from '@/lib/medusa';
import { MAQUINARIA } from '@/lib/maquinaria-alquiler';

interface SearchResult {
  type: 'service' | 'product' | 'rental';
  title: string;
  subtitle: string;
  href: string;
}

interface DropdownPos {
  top: number;
  left: number;
  width: number;
}

function matchesQuery(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.every(w => lower.includes(w));
}

function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }

    // Split into words so "control plagas" matches both terms
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);

    const serviceResults: SearchResult[] = SERVICES
      .filter(s =>
        matchesQuery(s.title, words) ||
        matchesQuery(s.categoryLabel, words)
      )
      .slice(0, 5)
      .map(s => ({
        type: 'service',
        title: s.title,
        subtitle: s.categoryLabel,
        href: `/servicios/${s.slug}`,
      }));

    const rentalResults: SearchResult[] = MAQUINARIA
      .filter(m =>
        m.disponible && (
          matchesQuery(m.titulo, words) ||
          matchesQuery(m.categoria, words) ||
          matchesQuery(m.descripcionCorta, words)
        )
      )
      .slice(0, 4)
      .map(m => ({
        type: 'rental' as const,
        title: m.titulo,
        subtitle: m.categoria,
        href: `/alquiler/${m.handle}`,
      }));

    let productResults: SearchResult[] = [];
    try {
      const client = getMedusa();
      const { products } = await client.store.product.list({ q, limit: 4 });
      productResults = (products ?? []).map((p: { title: string; collection?: { title: string } }) => ({
        type: 'product' as const,
        title: p.title,
        subtitle: p.collection?.title ?? 'Producto',
        href: `/tienda`,
      }));
    } catch {
      // Medusa no disponible — solo servicios
    }

    setResults([...serviceResults, ...rentalResults, ...productResults].slice(0, 9));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 220);
    return () => clearTimeout(timer);
  }, [query, search]);

  return { results };
}

export function Hero() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState<DropdownPos | null>(null);
  const { results } = useSearch(query);
  const barRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback(() => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    setDropPos({ top: rect.bottom + 1, left: rect.left, width: rect.width });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePos();
    window.addEventListener('scroll', updatePos, { passive: true });
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos);
      window.removeEventListener('resize', updatePos);
    };
  }, [open, updatePos]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const showDropdown = open && query.trim().length > 0;

  return (
    <section style={{ padding: '130px 24px 90px', position: 'relative', borderRadius: 16 }}>

      {/* Imagen de fondo — clipeada solo dentro de su contenedor */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 16, overflow: 'hidden', zIndex: 0 }}>
        <Image
          src="/images/hero/hero-banner.webp"
          alt=""
          fill
          priority
          quality={85}
          className="object-cover object-center"
          style={{ opacity: 0.55 }}
        />
      </div>

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
        <div ref={barRef} style={{ width: '100%', maxWidth: 560 }}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              borderRadius: showDropdown ? '14px 14px 0 0' : 14,
              border: '1.5px solid #e5e7eb',
              padding: '6px 6px 6px 16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              transition: 'border-radius 0.15s',
            }}
          >
            {/* Icono servicio */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Sparkles size={15} color="#6B7280" />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#374151', whiteSpace: 'nowrap' }}>
                Servicio
              </span>
            </div>

            {/* Separator */}
            <div style={{ width: 1, height: 20, background: '#e5e7eb', flexShrink: 0, margin: '0 14px' }} />

            {/* Input */}
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => { setOpen(true); updatePos(); }}
              placeholder="Busca servicios, alquiler de maquinaria..."
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

            {/* Botón buscar */}
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

        {/* Dropdown — fuera del overflow clip, posición fixed */}
        <AnimatePresence>
          {showDropdown && dropPos && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: dropPos.top,
                left: dropPos.left,
                width: dropPos.width,
                background: '#ffffff',
                border: '1.5px solid #e5e7eb',
                borderTop: 'none',
                borderRadius: '0 0 14px 14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                overflow: 'hidden',
                zIndex: 9999,
                textAlign: 'left',
              }}
            >
              {results.length === 0 && (
                <div style={{ padding: '14px 20px', fontSize: 13, color: '#9CA3AF' }}>
                  No se encontraron resultados para &ldquo;{query}&rdquo;
                </div>
              )}

              {results.length > 0 && (
                <>
                  {(['service', 'rental', 'product'] as const).map(type => {
                    const group = results.filter(r => r.type === type);
                    if (!group.length) return null;
                    const label = type === 'service' ? 'Servicios' : type === 'rental' ? 'Alquiler de maquinaria' : 'Productos';
                    const icon = type === 'service'
                      ? <Wrench size={14} color="#6B7280" />
                      : type === 'rental'
                        ? <Truck size={14} color="#6B7280" />
                        : <Package size={14} color="#6B7280" />;
                    return (
                      <div key={type}>
                        <div
                          style={{
                            padding: '8px 20px 4px',
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: '#9CA3AF',
                          }}
                        >
                          {label}
                        </div>
                        {group.map(r => (
                          <Link
                            key={r.href + r.title}
                            href={r.href}
                            onClick={() => { setOpen(false); setQuery(''); }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: '10px 20px',
                              textDecoration: 'none',
                              background: 'transparent',
                              transition: 'background 0.12s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <div
                              style={{
                                flexShrink: 0,
                                width: 30,
                                height: 30,
                                borderRadius: 6,
                                background: '#F3F4F6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {icon}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {r.title}
                              </p>
                              <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>
                                {r.subtitle}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
