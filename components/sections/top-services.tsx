'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* --- Types ------------------------------------------------------- */

type FilterKey = 'Limpieza Especializada' | 'Control de Plagas' | 'Seguridad Alimentaria' | 'Servicio Técnico y Maquinaria' | 'Formación Profesional';

interface ServiceCard {
  title: string;
  description: string;
  img: string;
  href: string;
}

/* --- Data -------------------------------------------------------- */

const FILTERS: FilterKey[] = ['Limpieza Especializada', 'Control de Plagas', 'Seguridad Alimentaria', 'Servicio Técnico y Maquinaria', 'Formación Profesional'];

const VIEW_MORE: Record<FilterKey, string> = {
  'Limpieza Especializada': '/servicios',
  'Control de Plagas': '/servicios',
  'Seguridad Alimentaria': '/servicios',
  'Servicio Técnico y Maquinaria': '/servicios',
  'Formación Profesional': '/servicios',
};

const CARDS: Record<FilterKey, ServiceCard[]> = {
  'Limpieza Especializada': [
    {
      title: 'Servicios Globales de Higiene',
      description: 'Soluciones integrales de higiene profesional para empresas e industrias con protocolos certificados.',
      img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=520&fit=crop&auto=format',
      href: '/servicios/servicios-globales-de-higiene',
    },
    {
      title: 'Limpiezas Industriales',
      description: 'Limpieza especializada para entornos industriales y de alta exigencia con equipos de última generación.',
      img: '/images/home/limpiezas-industriales-home.webp',
      href: '/servicios/limpiezas-industriales',
    },
    {
      title: 'Limpiezas en Altura',
      description: 'Trabajos verticales y acceso a zonas de difícil alcance con total seguridad y equipación homologada.',
      img: '/images/home/limpieza-alturas-v2.webp',
      href: '/servicios/limpiezas-en-altura',
    },
    {
      title: 'Tratamiento de Suelos',
      description: 'Mantenimiento, pulido y protección de todo tipo de superficies y pavimentos industriales.',
      img: '/images/home/tratamiento-suelos-v2.webp',
      href: '/servicios/tratamientos-de-suelos',
    },
  ],
  'Control de Plagas': [
    {
      title: 'Desratización, Desinsectación y Desinfección',
      description: 'Control integral de roedores e insectos con métodos certificados, seguros y respetuosos con el entorno.',
      img: '/images/home/ddd-v2.webp',
      href: '/servicios/ddd-desratizacion-desinsectacion-desinfeccion',
    },
    {
      title: 'Tratamiento Anti-Termitas',
      description: 'Detección y eliminación de colonias de termitas con tratamientos de eficacia garantizada y larga duración.',
      img: '/images/servicios/tratamiento-anti-termitas/1-hq.webp',
      href: '/servicios/tratamiento-anti-termitas',
    },
    {
      title: 'Tratamientos de Legionela',
      description: 'Análisis, desinfección y mantenimiento preventivo de instalaciones de agua conforme a normativa vigente.',
      img: '/images/servicios/tratamientos-de-legionela/1-hq.webp',
      href: '/servicios/tratamientos-de-legionela',
    },
    {
      title: 'Ozonización',
      description: 'Desinfección ambiental profunda mediante ozono para espacios libres de patógenos y malos olores.',
      img: '/images/servicios/ozonizacion/1-wide-b.webp',
      href: '/servicios/ozonizacion',
    },
  ],
  'Seguridad Alimentaria': [
    {
      title: 'APPCC — Implantación y Verificación',
      description: 'Implantación y gestión de sistemas de control de puntos críticos en la cadena alimentaria.',
      img: '/images/servicios/appcc-implantacion-y-verificacion/1-hq.webp',
      href: '/servicios/appcc-implantacion-y-verificacion',
    },
    {
      title: 'Formación de Manipulador de Alimentos',
      description: 'Cursos homologados de higiene alimentaria para equipos de trabajo en hostelería e industria.',
      img: '/images/servicios/formacion-de-manipulador-de-alimentos/1-hq-v2.webp',
      href: '/servicios/formacion-de-manipulador-de-alimentos',
    },
    {
      title: 'Tratamientos de Legionela',
      description: 'Control térmico y químico de redes hídricas para prevenir la bacteria Legionella. Cumplimiento RD 861/2003.',
      img: '/images/servicios/tratamientos-de-legionela/1-hq.webp',
      href: '/servicios/tratamientos-de-legionela',
    },
  ],
  'Servicio Técnico y Maquinaria': [
    {
      title: 'Alquiler de Maquinaria',
      description: 'Equipos de limpieza profesionales disponibles por días, semanas o meses sin compromisos de compra.',
      img: '/images/servicios/alquiler-de-maquinaria/1-hq.webp',
      href: '/servicios/alquiler-de-maquinaria',
    },
    {
      title: 'Servicio Técnico Oficial Kärcher',
      description: 'Reparación y mantenimiento oficial de equipos Kärcher realizado por técnicos certificados.',
      img: '/images/servicios/servicio-tecnico-oficial-karcher/1-hq.webp',
      href: '/servicios/servicio-tecnico-oficial-karcher',
    },
    {
      title: 'Reparaciones y Mantenimientos',
      description: 'Servicio de reparación rápida para toda clase de maquinaria de limpieza profesional de cualquier marca.',
      img: '/images/home/reparaciones-mantenimientos-v2.webp',
      href: '/servicios/reparaciones-y-mantenimientos',
    },
    {
      title: 'Tienda de Productos Profesionales',
      description: 'Catálogo completo de maquinaria, accesorios y consumibles de limpieza profesional. Envío rápido.',
      img: '/images/home/tienda-v2.webp',
      href: '/tienda',
    },
  ],
  'Formación Profesional': [
    {
      title: 'Centro de Formación',
      description: 'Cursos homologados en bioseguridad, limpieza especializada y protocolos sanitarios. Formación subvencionada disponible.',
      img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=520&fit=crop&auto=format',
      href: '/servicios/centro-de-formacion',
    },
    {
      title: 'Formación de Manipulador de Alimentos',
      description: 'Certificación oficial para el carné de manipulación de alimentos según Reglamento 852/2004.',
      img: '/images/servicios/formacion-de-manipulador-de-alimentos/1-hq-v2.webp',
      href: '/servicios/formacion-de-manipulador-de-alimentos',
    },
    {
      title: 'APPCC — Implantación y Verificación',
      description: 'Diseño y validación documental del sistema APPCC para cumplimiento normativo integral en tu empresa.',
      img: '/images/servicios/appcc-implantacion-y-verificacion/1-hq.webp',
      href: '/servicios/appcc-implantacion-y-verificacion',
    },
    {
      title: 'Acreditación Técnica de Limpieza',
      description: 'Módulo de 100h para operarios en activo. Competencias avanzadas en maquinaria, química y seguridad laboral.',
      img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=520&fit=crop&auto=format',
      href: '/servicios/centro-de-formacion',
    },
  ],
};

/* --- Section: showcase interactivo (lista + visual que cambia) --- */

export function TopServices() {
  const [active, setActive] = useState<FilterKey>('Limpieza Especializada');
  const [hovered, setHovered] = useState(0);

  const list = CARDS[active];
  const selected = list[Math.min(hovered, list.length - 1)];

  return (
    <section style={{ background: '#F7F8FB', padding: '88px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* -- Header -- */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 36,
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Nuestros servicios
          </h2>

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => {
              const isActive = active === f;
              return (
                <button
                  key={f}
                  onClick={() => { setActive(f); setHovered(0); }}
                  style={{
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                    background: isActive ? '#111827' : '#ffffff',
                    color: isActive ? '#ffffff' : '#6B7280',
                    borderColor: isActive ? '#111827' : '#E5E7EB',
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* -- Showcase split -- */}
        <style>{`
          .ts-showcase {
            display: grid;
            grid-template-columns: 0.85fr 1.15fr;
            gap: 28px;
            align-items: stretch;
          }
          @media (max-width: 860px) {
            .ts-showcase { grid-template-columns: 1fr; gap: 18px; }
            .ts-showcase .ts-img { min-height: 300px; }
          }
        `}</style>
        <div className="ts-showcase">
          {/* Left: lista de servicios de la categoría activa */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
            >
              {list.map((card, i) => {
                const isOn = i === Math.min(hovered, list.length - 1);
                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        borderRadius: 10,
                        padding: '18px 18px 18px 20px',
                        background: isOn ? '#ffffff' : 'transparent',
                        boxShadow: isOn ? '0 1px 2px rgba(16,24,40,0.04), 0 8px 22px rgba(16,24,40,0.07)' : 'none',
                        transition: 'background 0.25s ease, box-shadow 0.25s ease',
                        cursor: 'pointer',
                      }}
                    >
                      {/* Barra de acento a la izquierda */}
                      <motion.div
                        animate={{ opacity: isOn ? 1 : 0, scaleY: isOn ? 1 : 0.3 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{
                          position: 'absolute', left: 0, top: 14, bottom: 14, width: 3,
                          borderRadius: 3, background: '#546AE7',
                        }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: isOn ? '#111827' : '#6B7280',
                            lineHeight: 1.3,
                            transition: 'color 0.25s ease',
                          }}
                        >
                          {card.title}
                        </span>
                        <motion.div
                          animate={{ opacity: isOn ? 1 : 0, x: isOn ? 0 : -6 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 7, background: '#111827' }}
                        >
                          <ArrowUpRight size={14} color="#ffffff" strokeWidth={2.5} />
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Ver todos */}
              <Link
                href={VIEW_MORE[active]}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 14, fontWeight: 700, color: '#111827',
                  textDecoration: 'none', marginTop: 10, marginLeft: 20,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                Ver todos los servicios
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Right: visual grande que cambia con crossfade */}
          <Link href={selected.href} style={{ textDecoration: 'none', display: 'block' }}>
            <div
              className="ts-img"
              style={{
                position: 'relative',
                borderRadius: 14,
                overflow: 'hidden',
                height: 460,
                maxHeight: '60vh',
                background: '#0F1623',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active + selected.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  {/* Imagen rellenando todo el panel (recorta lo que sobra) */}
                  <Image
                    src={selected.img}
                    alt={selected.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 55vw"
                    className="object-cover object-center"
                    quality={90}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Gradiente inferior */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,22,35,0.88) 0%, rgba(15,22,35,0.30) 45%, rgba(15,22,35,0) 70%)' }} />

              {/* Texto */}
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '32px 34px' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active + selected.title + '-txt'}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <h3 style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.6px', lineHeight: 1.2, margin: '0 0 10px' }}>
                      {selected.title}
                    </h3>
                    <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, margin: '0 0 18px', maxWidth: 520 }}>
                      {selected.description}
                    </p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#ffffff', color: '#111827', fontSize: 13.5, fontWeight: 700, padding: '10px 18px', borderRadius: 8 }}>
                      Ver servicio <ArrowUpRight size={15} strokeWidth={2.5} />
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}
