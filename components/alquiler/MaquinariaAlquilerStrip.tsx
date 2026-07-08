'use client'

import Link from 'next/link'
import Image from 'next/image'
import { blurProps } from '@/lib/img'
import { ArrowRight } from 'lucide-react'
import { MAQUINARIA } from '@/lib/maquinaria-alquiler'

const CATEGORIA_COLOR: Record<string, string> = {
  Fregadoras:              '#1D4ED8',
  Barredoras:              '#6D28D9',
  'Aspiración industrial': '#B45309',
  'Alta presión':          '#0E7490',
  'Limpieza textil':       '#9D174D',
  'Desinfección ambiental':'#065F46',
  'Tratamiento de suelos': '#92400E',
}

export function MaquinariaAlquilerStrip({ locale }: { locale: string }) {
  const preview = MAQUINARIA.filter((m) => m.disponible).slice(0, 4)

  return (
    <section style={{ background: '#F9FAFB', padding: '56px 32px', borderTop: '1px solid #F3F4F6' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 5px' }}>
              Disponible para alquiler
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', margin: 0 }}>
              Maquinaria que puedes alquilar
            </h2>
          </div>
          <Link
            href={`/${locale}/alquiler`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#111827', color: '#fff',
              padding: '10px 18px', borderRadius: 8,
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Ver catálogo <ArrowRight size={13} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {preview.map((m) => {
            const color = CATEGORIA_COLOR[m.categoria] ?? '#374151'
            return (
              <Link
                key={m.handle}
                href={`/${locale}/alquiler/${m.handle}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', height: 130, background: '#F3F4F6' }}>
                    <Image
                      src={m.imagen}
                      alt={m.titulo}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 640px) 50vw, 25vw"
                      {...blurProps(m.imagen)}
                    />
                  </div>

                  {/* Body */}
                  <div style={{ padding: '12px 14px 14px' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 5px' }}>
                      {m.categoria}
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', lineHeight: 1.3, margin: '0 0 10px' }}>
                      {m.titulo}
                    </p>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color }}>
                      Ver ficha <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 16, textAlign: 'center' }}>
          {MAQUINARIA.length} equipos certificados · Mantenimiento incluido · Servicio Técnico Oficial Kärcher
        </p>
      </div>
    </section>
  )
}
