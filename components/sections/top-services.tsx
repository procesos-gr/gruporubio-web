'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* ─── Types ──────────────────────────────────────────────────────────── */

type FilterKey = 'Limpieza Especializada' | 'Control de Plagas' | 'Seguridad Alimentaria' | 'Servicio Técnico y Maquinaria' | 'Formación Profesional';

interface ServiceCard {
  title: string;
  description: string;
  img: string;
  rating: number;
  reviews: number;
  href: string;
}

/* ─── Data ───────────────────────────────────────────────────────────── */

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
      rating: 4.9,
      reviews: 214,
      href: '/servicios/servicios-globales-de-higiene',
    },
    {
      title: 'Limpieza Industrial',
      description: 'Limpieza especializada para entornos industriales y de alta exigencia con equipos de última generación.',
      img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=520&fit=crop&auto=format',
      rating: 4.7,
      reviews: 98,
      href: '/servicios/limpiezas-industriales',
    },
    {
      title: 'Limpiezas en Altura',
      description: 'Trabajos verticales y acceso a zonas de difícil alcance con total seguridad y equipación homologada.',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=520&fit=crop&auto=format',
      rating: 4.8,
      reviews: 57,
      href: '/servicios/limpiezas-en-altura',
    },
    {
      title: 'Tratamiento de Suelos',
      description: 'Mantenimiento, pulido y protección de todo tipo de superficies y pavimentos industriales.',
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=520&fit=crop&auto=format',
      rating: 4.6,
      reviews: 133,
      href: '/servicios',
    },
  ],
  'Control de Plagas': [
    {
      title: 'Desratización y Desinsectación',
      description: 'Control integral de roedores e insectos con métodos certificados, seguros y respetuosos con el entorno.',
      img: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800&h=520&fit=crop&auto=format',
      rating: 4.8,
      reviews: 176,
      href: '/servicios/ddd-desratizacion-desinsectacion-desinfeccion',
    },
    {
      title: 'Control de Termitas',
      description: 'Detección y eliminación de colonias de termitas con tratamientos de eficacia garantizada y larga duración.',
      img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=520&fit=crop&auto=format',
      rating: 4.7,
      reviews: 89,
      href: '/servicios/tratamiento-anti-termitas',
    },
    {
      title: 'Tratamiento de Legionela',
      description: 'Análisis, desinfección y mantenimiento preventivo de instalaciones de agua conforme a normativa vigente.',
      img: 'https://images.unsplash.com/photo-1548407260-da850faa41e3?w=800&h=520&fit=crop&auto=format',
      rating: 5.0,
      reviews: 42,
      href: '/servicios/tratamientos-de-legionela',
    },
    {
      title: 'Ozonización',
      description: 'Desinfección ambiental profunda mediante ozono para espacios libres de patógenos y malos olores.',
      img: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=520&fit=crop&auto=format',
      rating: 4.5,
      reviews: 61,
      href: '/servicios/ozonizacion',
    },
  ],
  'Seguridad Alimentaria': [
    {
      title: 'APPCC — Implantación y Verificación',
      description: 'Implantación y gestión de sistemas de control de puntos críticos en la cadena alimentaria.',
      img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=520&fit=crop&auto=format',
      rating: 4.9,
      reviews: 38,
      href: '/servicios/appcc-implantacion-y-verificacion',
    },
    {
      title: 'Formación Manipulador de Alimentos',
      description: 'Cursos homologados de higiene alimentaria para equipos de trabajo en hostelería e industria.',
      img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=520&fit=crop&auto=format',
      rating: 4.8,
      reviews: 112,
      href: '/servicios/formacion-de-manipulador-de-alimentos',
    },
    {
      title: 'Tratamientos de Legionela',
      description: 'Control térmico y químico de redes hídricas para prevenir la bacteria Legionella. Cumplimiento RD 861/2003.',
      img: 'https://images.unsplash.com/photo-1548407260-da850faa41e3?w=800&h=520&fit=crop&auto=format',
      rating: 4.9,
      reviews: 42,
      href: '/servicios/tratamientos-de-legionela',
    },
    {
      title: 'DDD en Industria Alimentaria',
      description: 'Desratización, desinsectación y desinfección bajo protocolos APPCC para plantas de procesado alimentario.',
      img: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800&h=520&fit=crop&auto=format',
      rating: 4.8,
      reviews: 67,
      href: '/servicios/ddd-desratizacion-desinsectacion-desinfeccion',
    },
  ],
  'Servicio Técnico y Maquinaria': [
    {
      title: 'Alquiler de Maquinaria',
      description: 'Equipos de limpieza profesionales disponibles por días, semanas o meses sin compromisos de compra.',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=520&fit=crop&auto=format',
      rating: 4.7,
      reviews: 83,
      href: '/servicios/alquiler-de-maquinaria',
    },
    {
      title: 'Servicio Técnico Kärcher',
      description: 'Reparación y mantenimiento oficial de equipos Kärcher realizado por técnicos certificados.',
      img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=520&fit=crop&auto=format',
      rating: 4.9,
      reviews: 147,
      href: '/servicios/servicio-tecnico-oficial-karcher',
    },
    {
      title: 'Reparaciones',
      description: 'Servicio de reparación rápida para toda clase de maquinaria de limpieza profesional de cualquier marca.',
      img: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=520&fit=crop&auto=format',
      rating: 4.6,
      reviews: 66,
      href: '/servicios/reparaciones-y-mantenimientos',
    },
    {
      title: 'Tienda de Productos Profesionales',
      description: 'Catálogo completo de maquinaria, accesorios y consumibles de limpieza profesional. Envío rápido.',
      img: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=520&fit=crop&auto=format',
      rating: 4.8,
      reviews: 91,
      href: '/tienda',
    },
  ],
  'Formación Profesional': [
    {
      title: 'Centro de Formación',
      description: 'Cursos homologados en bioseguridad, limpieza especializada y protocolos sanitarios. Formación subvencionada disponible.',
      img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=520&fit=crop&auto=format',
      rating: 4.9,
      reviews: 58,
      href: '/servicios/centro-de-formacion',
    },
    {
      title: 'Formación Manipulador de Alimentos',
      description: 'Certificación oficial para el carné de manipulación de alimentos según Reglamento 852/2004.',
      img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=520&fit=crop&auto=format',
      rating: 4.8,
      reviews: 112,
      href: '/servicios/formacion-de-manipulador-de-alimentos',
    },
    {
      title: 'APPCC — Implantación y Verificación',
      description: 'Diseño y validación documental del sistema APPCC para cumplimiento normativo integral en tu empresa.',
      img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=520&fit=crop&auto=format',
      rating: 4.9,
      reviews: 38,
      href: '/servicios/appcc-implantacion-y-verificacion',
    },
    {
      title: 'Acreditación Técnica de Limpieza',
      description: 'Módulo de 100h para operarios en activo. Competencias avanzadas en maquinaria, química y seguridad laboral.',
      img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=520&fit=crop&auto=format',
      rating: 4.7,
      reviews: 34,
      href: '/servicios/centro-de-formacion',
    },
  ],
};

/* ─── Star rating ────────────────────────────────────────────────────── */

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((s) => {
          const filled = rating >= s;
          const half = !filled && rating >= s - 0.5;
          return (
            <Star
              key={s}
              size={13}
              fill={filled || half ? '#F59E0B' : 'none'}
              color={filled || half ? '#F59E0B' : '#D1D5DB'}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
        {rating.toFixed(1)}
      </span>
      <span style={{ fontSize: 12, color: '#9CA3AF' }}>
        ({reviews} valoraciones)
      </span>
    </div>
  );
}

/* ─── Service Card ───────────────────────────────────────────────────── */

function Card({ card }: { card: ServiceCard }) {
  return (
    <Link href={card.href} style={{ textDecoration: 'none', display: 'block' }}>
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      style={{ cursor: 'pointer' }}
    >
      {/* Image container with overflow hidden */}
      <div
        style={{
          position: 'relative',
          height: 260,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {/* Image — scales on hover */}
        <motion.div
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.04 },
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image
            src={card.img}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 90vw, 25vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Dark overlay — expands from bottom on hover */}
        <motion.div
          variants={{
            rest: { height: 68 },
            hover: { height: '50%' },
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          {/* Title row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <span
              style={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 16,
                fontFamily: 'var(--font-plus-jakarta), sans-serif',
                lineHeight: 1.3,
                flex: 1,
              }}
            >
              {card.title}
            </span>

            {/* Arrow circle — rotates on hover */}
            <motion.div
              variants={{
                rest: { rotate: 0 },
                hover: { rotate: 45 },
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowUpRight size={14} color="#111827" strokeWidth={2.5} />
            </motion.div>
          </div>

          {/* Description — fades in on hover */}
          <motion.p
            variants={{
              rest: { opacity: 0, y: 6 },
              hover: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.06 }}
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 13,
              fontWeight: 400,
              margin: '8px 0 0',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {card.description}
          </motion.p>
        </motion.div>
      </div>

      {/* Rating — outside the image */}
      <div style={{ paddingTop: 10 }}>
        <StarRating rating={card.rating} reviews={card.reviews} />
      </div>
    </motion.div>
    </Link>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */

export function TopServices() {
  const [active, setActive] = useState<FilterKey>('Limpieza Especializada');

  return (
    <section style={{ background: '#ffffff', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 40,
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
                  onClick={() => setActive(f)}
                  style={{
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s ease, color 0.2s ease',
                    background: isActive ? '#111827' : '#ffffff',
                    color: isActive ? '#ffffff' : '#6B7280',
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
            }}>
              {CARDS[active].slice(0, 4).map((card) => (
                <Card key={card.title} card={card} />
              ))}
            </div>

            {/* Ver más */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
              <Link
                href={VIEW_MORE[active]}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 14, fontWeight: 700, color: '#111827',
                  textDecoration: 'none', borderBottom: '2px solid #111827',
                  paddingBottom: 2, transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                Ver todos los servicios
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
