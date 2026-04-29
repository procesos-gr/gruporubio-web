'use client'

import Link from 'next/link'
import { Wrench, ChevronRight } from 'lucide-react'
import type { MaquinaAlquiler } from '@/lib/maquinaria-alquiler'

export function MaquinasRelacionadas({
  maquinas,
  locale,
}: {
  maquinas: MaquinaAlquiler[]
  locale: string
}) {
  return (
    <div style={{ background: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 28,
          }}
        >
          <h2
            style={{
              fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.4px',
            }}
          >
            Más maquinaria disponible
          </h2>
          <Link
            href={`/${locale}/alquiler`}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 13, fontWeight: 600, color: '#2563EB', textDecoration: 'none',
            }}
          >
            Ver todo <ChevronRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {maquinas.map((m) => (
            <Link
              key={m.handle}
              href={`/${locale}/alquiler/${m.handle}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: '#FFFFFF', borderRadius: 8, border: '1px solid #E5E7EB',
                  padding: '18px', display: 'flex', alignItems: 'flex-start', gap: 14,
                  transition: 'box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 8, background: '#F3F4F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Wrench size={18} color="#9CA3AF" />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 13, fontWeight: 700, color: '#111827',
                      lineHeight: 1.3, marginBottom: 4,
                    }}
                  >
                    {m.titulo}
                  </p>
                  <p style={{ fontSize: 12, color: '#2563EB', fontWeight: 600 }}>
                    {m.precioDesde}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
