'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: '¿En qué zonas trabajáis?',
    a: 'Operamos principalmente en Navarra, La Rioja y Aragón, aunque realizamos proyectos en todo el ámbito nacional. Contamos con equipos propios en Tudela, Pamplona y Zaragoza.',
  },
  {
    q: '¿Cómo solicito un presupuesto?',
    a: 'Puedes contactarnos a través del formulario de nuestra web, por email a info@gruporubio.es o por teléfono al 948 82 50 25. Respondemos en menos de 24 horas laborables con un presupuesto personalizado y sin compromiso.',
  },
  {
    q: '¿Trabajáis con particulares y con empresas?',
    a: 'Sí. Atendemos tanto a particulares (limpieza de pisos, comunidades de vecinos) como a empresas, industrias, hoteles, colegios e instituciones públicas. Cada servicio se adapta a las necesidades específicas del cliente.',
  },
  {
    q: '¿Qué incluye el servicio de control de plagas?',
    a: 'Nuestro servicio DDD cubre desratización, desinsectación y desinfección. Utilizamos productos homologados a nivel europeo, seguros para personas, animales y el medio ambiente. También realizamos tratamientos de termitas, legionela y ozonización.',
  },
  {
    q: '¿Tenéis certificaciones de calidad?',
    a: 'Sí, contamos con certificación ISO 9001 y seguimos los protocolos APPCC para servicios de seguridad alimentaria. Nuestros técnicos están formados y habilitados por las autoridades sanitarias competentes.',
  },
  {
    q: '¿Con qué frecuencia se realizan los servicios?',
    a: 'La frecuencia se acuerda según las necesidades de cada cliente: diaria, semanal, quincenal o mensual. Para servicios puntuales como limpiezas de fin de obra o tratamientos DDD también ofrecemos intervenciones únicas.',
  },
  {
    q: '¿Podéis trabajar fuera del horario laboral?',
    a: 'Sí. Adaptamos nuestros horarios para no interrumpir la actividad de nuestros clientes. Trabajamos en horario nocturno, fines de semana y festivos cuando es necesario, especialmente en entornos industriales y hostelería.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ background: '#ffffff', padding: '80px 24px' }}>
      <style>{`
        .faq-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 80px; align-items: start; }
        @media (max-width: 860px) {
          .faq-grid { grid-template-columns: 1fr; gap: 32px; }
          .faq-grid > div:first-child { position: static !important; }
        }
      `}</style>
      <div className="faq-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Left — título sticky */}
        <div style={{ position: 'sticky', top: 100 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 12 }}>
            Preguntas frecuentes
          </p>
          <h2 style={{
            fontSize: 'clamp(26px, 3vw, 38px)',
            fontWeight: 800,
            color: '#111827',
            letterSpacing: '-1.5px',
            lineHeight: 1.12,
            margin: '0 0 20px',
          }}>
            Todo lo que necesitas saber
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.65, margin: '0 0 28px' }}>
            Si no encuentras lo que buscas, escríbenos y te respondemos en menos de 24h.
          </p>
          <a
            href="/contacto"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#111827',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              padding: '11px 22px',
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            Contactar →
          </a>
        </div>

        {/* Right — acordeón */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{ borderBottom: '1px solid #F3F4F6' }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    padding: '20px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#111827',
                    lineHeight: 1.4,
                  }}>
                    {faq.q}
                  </span>
                  <div
                    style={{
                      width: 28, height: 28,
                      borderRadius: 7,
                      background: isOpen ? '#111827' : '#F3F4F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'background 0.2s ease',
                    }}
                  >
                    {isOpen
                      ? <Minus size={13} color="#ffffff" />
                      : <Plus size={13} color="#6B7280" />
                    }
                  </div>
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? 300 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                  }}
                >
                  <p style={{
                    fontSize: 14,
                    color: '#6B7280',
                    lineHeight: 1.7,
                    paddingBottom: 20,
                    margin: 0,
                  }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
