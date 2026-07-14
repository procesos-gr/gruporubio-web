'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Wrench } from 'lucide-react'
import type { MaquinaAlquiler } from '@/lib/maquinaria-alquiler'
import { blurProps } from '@/lib/img'

const CATEGORIA_COLOR: Record<string, string> = {
  Fregadoras:              '#1D4ED8',
  Barredoras:              '#6D28D9',
  'Aspiración industrial': '#B45309',
  Aspiradores:             '#B45309',
  'Alta presión':          '#0E7490',
  'Limpieza textil':       '#9D174D',
  'Limpieza con vapor':    '#0F766E',
  'Desinfección ambiental':'#065F46',
  'Tratamiento de suelos': '#92400E',
  'Equipos auxiliares':    '#475569',
}

export function MaquinaCard({ maquina, locale }: { maquina: MaquinaAlquiler; locale: string }) {
  const color = CATEGORIA_COLOR[maquina.categoria] ?? '#374151'

  return (
    <Link
      href={`/${locale}/alquiler/${maquina.handle}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
          transition: 'box-shadow 0.18s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.10)'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = 'none'
        }}
      >
        {/* Image (placeholder si aún no hay foto, p. ej. modelo por decidir) */}
        <div style={{ position: 'relative', height: 200, background: '#F3F4F6' }}>
          {maquina.imagen ? (
            <Image
              src={maquina.imagen}
              alt={maquina.titulo}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              {...blurProps(maquina.imagen)}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 8,
                background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
              }}
            >
              <Wrench size={40} color="#D1D5DB" strokeWidth={1} />
              <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                Foto próximamente
              </span>
            </div>
          )}
          {/* Category pill over image */}
          <span
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(4px)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            {maquina.categoria}
          </span>
          {maquina.marca === 'Kärcher' && (
            <span
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: '#FFD700',
                color: '#111',
                fontSize: 9,
                fontWeight: 800,
                padding: '3px 7px',
                borderRadius: 4,
                letterSpacing: '0.04em',
              }}
            >
              Kärcher
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '16px 18px 18px' }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.35,
              marginBottom: 14,
              letterSpacing: '-0.2px',
            }}
          >
            {maquina.titulo}
          </h3>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 12,
              borderTop: '1px solid #F3F4F6',
            }}
          >
            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
              {maquina.precioDesde}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                fontWeight: 700,
                color: color,
              }}
            >
              Ver equipo <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
