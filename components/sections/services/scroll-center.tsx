'use client';

import { useEffect } from 'react';
import { CATEGORY_LABELS, ServiceCategory } from '@/lib/services-data';

const CATEGORY_ORDER: ServiceCategory[] = ['limpieza', 'plagas', 'alimentaria', 'maquinaria', 'formacion'];

function scrollToCenter(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/** Handles the initial #hash on page load (cross-page navigation) */
export function HashScrollCenter() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    // Small delay so the page layout is settled
    const t = setTimeout(() => scrollToCenter(hash), 80);
    return () => clearTimeout(t);
  }, []);
  return null;
}

/** Category quick-nav that scrolls to center instead of top */
export function ServiciosQuickNav() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {CATEGORY_ORDER.map((cat: ServiceCategory) => (
        <a
          key={cat}
          href={`#${cat}`}
          onClick={(e) => { e.preventDefault(); scrollToCenter(cat); }}
          style={{
            display: 'inline-flex', alignItems: 'center',
            fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6, padding: '6px 14px', textDecoration: 'none',
            whiteSpace: 'nowrap', transition: 'background 0.15s', cursor: 'pointer',
          }}
        >
          {CATEGORY_LABELS[cat]}
        </a>
      ))}
    </div>
  );
}
