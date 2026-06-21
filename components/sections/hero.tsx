'use client';

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Wrench, Truck, X, Loader2, MapPin, ShieldCheck, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SERVICES } from '@/lib/services-data';
import { getMedusa } from '@/lib/medusa';
import { MAQUINARIA } from '@/lib/maquinaria-alquiler';

const QUICK_CATEGORIES = [
  { label: 'Limpieza industrial', href: '/servicios#limpieza' },
  { label: 'Control de plagas', href: '/servicios#plagas' },
  { label: 'Alquiler de maquinaria', href: '/alquiler' },
  { label: 'Productos', href: '/tienda' },
];

const USP_ITEMS = [
  { icon: ShieldCheck, label: 'Productos y maquinaria de uso profesional' },
  { icon: MapPin, label: 'Servicio en Navarra, La Rioja y Aragón' },
  { icon: Award, label: '+55 años de experiencia' },
  { icon: Wrench, label: 'Técnicos propios y maquinaria Kärcher' },
];

interface SearchResult {
  type: 'service' | 'product' | 'rental';
  title: string;
  subtitle: string;
  href: string;
}

function norm(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function matchesQuery(text: string, words: string[]) {
  const lower = norm(text);
  return words.every(w => lower.includes(w));
}

type MedusaProduct = { title: string; handle?: string; description?: string; collection?: { title: string } };

function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [medusaProducts, setMedusaProducts] = useState<MedusaProduct[]>([]);

  // Carga productos de Medusa una sola vez al montar
  useEffect(() => {
    getMedusa().store.product.list({ limit: 100 } as Parameters<ReturnType<typeof getMedusa>['store']['product']['list']>[0])
      .then(({ products }) => setMedusaProducts(products ?? []))
      .catch(() => {});
  }, []);

  const search = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);

    const words = norm(q).split(/\s+/).filter(Boolean);

    const serviceResults: SearchResult[] = SERVICES
      .filter(s => matchesQuery(s.title, words) || matchesQuery(s.categoryLabel, words) || matchesQuery(s.shortDesc, words))
      .slice(0, 5)
      .map(s => ({ type: 'service', title: s.title, subtitle: s.categoryLabel, href: `/servicios/${s.slug}` }));

    const rentalResults: SearchResult[] = MAQUINARIA
      .filter(m => m.disponible && (
        matchesQuery(m.titulo, words) || matchesQuery(m.categoria, words) ||
        matchesQuery(m.marca, words) || matchesQuery(m.descripcionCorta, words)
      ))
      .slice(0, 3)
      .map(m => ({ type: 'rental' as const, title: m.titulo, subtitle: m.categoria, href: `/alquiler/${m.handle}` }));

    const productResults: SearchResult[] = medusaProducts
      .filter(p =>
        matchesQuery(p.title, words) ||
        matchesQuery(p.description ?? '', words) ||
        matchesQuery(p.collection?.title ?? '', words)
      )
      .slice(0, 4)
      .map(p => ({
        type: 'product' as const,
        title: p.title,
        subtitle: p.collection?.title ?? 'Producto',
        href: p.handle ? `/tienda/${p.handle}` : '/tienda',
      }));

    setResults([...serviceResults, ...rentalResults, ...productResults].slice(0, 9));
    setLoading(false);
  }, [medusaProducts]);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 150);
    return () => clearTimeout(timer);
  }, [query, search]);

  return { results, loading };
}

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { results, loading } = useSearch(query);
  const barRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showDropdown = open && query.trim().length > 0;
  const allResults = showDropdown ? results : [];

  // Cierra al clickar fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Reset activeIndex cuando cambian resultados
  useEffect(() => { setActiveIndex(-1); }, [results]);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) {
      if (e.key === 'Enter') handleSearch();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && allResults[activeIndex]) {
        router.push(allResults[activeIndex].href);
        setOpen(false);
        setQuery('');
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  }

  function handleSearch() {
    if (!query.trim()) return;
    // Si hay resultados de servicio, ir al primero; si no, buscar en tienda
    const firstService = results.find(r => r.type === 'service');
    const firstProduct = results.find(r => r.type === 'product');
    if (firstService) router.push(firstService.href);
    else if (firstProduct) router.push(`/tienda?q=${encodeURIComponent(query)}`);
    else router.push(`/tienda?q=${encodeURIComponent(query)}`);
    setOpen(false);
  }

  function handleClear() {
    setQuery('');
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  const groupLabels = { service: 'Servicios', rental: 'Alquiler de maquinaria', product: 'Productos' };
  const groupIcons = {
    service: <Wrench size={14} color="#6B7280" />,
    rental: <Truck size={14} color="#6B7280" />,
    product: <Package size={14} color="#6B7280" />,
  };

  // Índice acumulado por grupo para el activeIndex global
  let globalIdx = -1;

  return (
    <section style={{ padding: '100px 24px 132px', position: 'relative', borderRadius: 16 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 16, overflow: 'hidden', zIndex: 0 }}>
        <Image src="/images/hero/hero-banner-v6.png" alt="" fill priority quality={85} className="object-cover object-center" />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.18) 60%, rgba(255,255,255,0.06) 100%)',
        }} />

        {/* Tira inferior con USPs en scroll continuo */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#0B0F14',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
          zIndex: 1,
        }}>
          <style>{`
            @keyframes heroUspMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
            .hero-usp-track { animation: heroUspMarquee 32s linear infinite; }
          `}</style>
          <div className="hero-usp-track" style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}>
            {[...USP_ITEMS, ...USP_ITEMS].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 32px' }}>
                  <Icon size={14} style={{ color: 'rgba(255,255,255,0.50)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.01em' }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>

        <motion.p
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ fontSize: 12, fontWeight: 700, color: '#1e3a8a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}
        >
          DESDE 1971 ofreciendo soluciones globales de higiene y sanidad ambiental
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
          style={{ fontSize: 'clamp(34px, 4.2vw, 48px)', fontWeight: 800, color: '#111827', lineHeight: 1.08, letterSpacing: '-1.5px', marginBottom: 28 }}
        >
          Desinfección de superficies<br />y ambientes en industrias alimentarias.
        </motion.h1>

        {/* Search bar */}
        <div ref={barRef} style={{ width: '100%', maxWidth: 560, position: 'relative' }}>
          <div style={{
            width: '100%', display: 'flex', alignItems: 'center',
            background: '#ffffff',
            borderRadius: showDropdown ? '12px 12px 0 0' : 12,
            border: `1.5px solid ${open ? '#1e3a8a' : '#e5e7eb'}`,
            padding: '6px 6px 6px 14px',
            boxShadow: open ? '0 0 0 3px rgba(30,58,138,0.08)' : '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'border-color 0.15s, box-shadow 0.15s, border-radius 0.15s',
            boxSizing: 'border-box',
          }}>
            <Search size={16} color={open ? '#1e3a8a' : '#9CA3AF'} style={{ flexShrink: 0, marginRight: 10, transition: 'color 0.15s' }} />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1); }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Busca servicios, maquinaria o productos..."
              autoComplete="off"
              style={{ flex: 1, minWidth: 0, background: 'transparent', outline: 'none', border: 'none', fontSize: 14, color: '#111827', fontFamily: 'inherit' }}
            />

            {/* Loading / clear */}
            {loading && <Loader2 size={15} color="#9CA3AF" style={{ flexShrink: 0, marginRight: 8, animation: 'spin 1s linear infinite' }} />}
            {!loading && query && (
              <button onClick={handleClear} style={{ flexShrink: 0, marginRight: 8, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}>
                <X size={15} color="#9CA3AF" />
              </button>
            )}

            <button
              onClick={handleSearch}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, borderRadius: 8,
                background: '#111827', color: '#ffffff', fontSize: 13, fontWeight: 600,
                padding: '10px 18px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit',
              }}
            >
              <Search size={13} />
              Buscar
            </button>
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.13, ease: 'easeOut' }}
                style={{
                  position: 'absolute', top: '100%', left: 0, width: '100%', boxSizing: 'border-box',
                  background: '#ffffff', border: '1.5px solid #1e3a8a', borderTop: 'none',
                  borderRadius: '0 0 12px 12px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                  overflowY: 'auto', maxHeight: 340, zIndex: 9999, textAlign: 'left',
                }}
              >
                {!loading && results.length === 0 && (
                  <div style={{ padding: '16px 20px', fontSize: 13, color: '#9CA3AF' }}>
                    Sin resultados para <strong style={{ color: '#374151' }}>&ldquo;{query}&rdquo;</strong>
                  </div>
                )}

                {results.length > 0 && (['service', 'rental', 'product'] as const).map(type => {
                  const group = results.filter(r => r.type === type);
                  if (!group.length) return null;
                  return (
                    <div key={type}>
                      <div style={{ padding: '10px 16px 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {groupIcons[type]} {groupLabels[type]}
                      </div>
                      {group.map(r => {
                        globalIdx++;
                        const idx = globalIdx;
                        const isActive = idx === activeIndex;
                        return (
                          <Link
                            key={r.href + r.title}
                            href={r.href}
                            onClick={() => { setOpen(false); setQuery(''); setActiveIndex(-1); }}
                            onMouseEnter={() => setActiveIndex(idx)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12,
                              padding: '10px 16px', textDecoration: 'none',
                              background: isActive ? '#EFF6FF' : 'transparent',
                              borderLeft: isActive ? '3px solid #1e3a8a' : '3px solid transparent',
                              transition: 'background 0.1s',
                            }}
                          >
                            <div style={{
                              flexShrink: 0, width: 32, height: 32, borderRadius: 6,
                              background: isActive ? '#DBEAFE' : '#F3F4F6',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'background 0.1s',
                            }}>
                              {groupIcons[type]}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: isActive ? '#1e3a8a' : '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {r.title}
                              </p>
                              <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
                                {r.subtitle}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Footer del dropdown */}
                {results.length > 0 && (
                  <div
                    onClick={handleSearch}
                    style={{ padding: '10px 16px', borderTop: '1px solid #F3F4F6', fontSize: 12, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Search size={12} /> Ver todos los resultados de &ldquo;{query}&rdquo;
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chips de categorías rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 14 }}
        >
          {QUICK_CATEGORIES.map(cat => (
            <Link
              key={cat.href}
              href={cat.href}
              style={{
                fontSize: 13, fontWeight: 600, color: '#374151',
                background: 'rgba(255,255,255,0.75)', border: '1px solid #E5E7EB',
                borderRadius: 8, padding: '8px 16px', textDecoration: 'none',
              }}
            >
              {cat.label}
            </Link>
          ))}
        </motion.div>

      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
