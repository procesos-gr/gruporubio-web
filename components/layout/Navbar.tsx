'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, ArrowRight, Store, Truck } from 'lucide-react';
import { SERVICES, CATEGORY_LABELS, ServiceCategory } from '@/lib/services-data';
import { CartButton } from "@/components/tienda/CartButton"

function FlagES() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="20" height="14" fill="#c60b1e"/>
      <rect y="3.5" width="20" height="7" fill="#ffc400"/>
    </svg>
  );
}

function FlagGB() {
  return (
    <svg width="20" height="14" viewBox="0 0 60 40" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="60" height="40" fill="#012169"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5"/>
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="12"/>
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="7"/>
    </svg>
  );
}

function FlagFR() {
  return (
    <svg width="20" height="14" viewBox="0 0 30 20" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="10" height="20" fill="#002395"/>
      <rect x="10" width="10" height="20" fill="#fff"/>
      <rect x="20" width="10" height="20" fill="#ED2939"/>
    </svg>
  );
}

const FLAG_MAP: Record<string, React.ReactNode> = {
  es: <FlagES />,
  en: <FlagGB />,
  fr: <FlagFR />,
};

const LOCALES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];

const CATEGORY_ORDER: ServiceCategory[] = ['limpieza', 'plagas', 'alimentaria', 'maquinaria', 'formacion'];

const FEATURED: Record<ServiceCategory, string[]> = {
  limpieza: [
    'servicios-globales-de-higiene',
    'limpiezas-industriales',
    'limpiezas-en-altura',
    'ozonizacion',
    'limpiezas-de-fin-de-obra',
    'limpieza-de-conductos-de-climatizacion',
    'limpiezas-de-fachadas-y-grafitis',
  ],
  plagas: [
    'ddd-desratizacion-desinsectacion-desinfeccion',
    'tratamiento-anti-termitas',
    'retirada-de-nidos-de-avispas',
    'eliminar-plagas-de-cucarachas',
    'tratamientos-de-legionela',
    'control-de-aves',
    'desinsectacion-de-carcoma',
  ],
  alimentaria: [
    'appcc-implantacion-y-verificacion',
    'formacion-de-manipulador-de-alimentos',
  ],
  maquinaria: [
    'alquiler-de-maquinaria',
    'servicio-tecnico-oficial-karcher',
    'reparaciones-y-mantenimientos',
  ],
  formacion: [
    'centro-de-formacion',
  ],
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentLocale = LOCALES.find(l => pathname.startsWith(`/${l.code}`))?.code ?? 'es';

  const switchLocale = (code: string) => {
    const segments = pathname.split('/');
    segments[1] = code;
    router.push(segments.join('/'));
    setLangOpen(false);
  };

  const isOnDarkPage =
    pathname.includes('/servicios') ||
    pathname.includes('/nosotros') ||
    pathname.includes('/contacto') ||
    pathname.includes('/tienda') ||
    pathname.includes('/alquiler') ||
    pathname.includes('/presupuesto');

  const showDark = scrolled || open;

  // Re-evaluate scroll state on every navigation (fixes back-button transparency bug)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [pathname]);

  const onEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const onLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const linkColor = (!showDark && isOnDarkPage) ? 'rgba(255,255,255,0.88)' : '#374151';
  const chevronColor = (!showDark && isOnDarkPage) ? 'rgba(255,255,255,0.45)' : '#9CA3AF';

  return (
    <>
      <style>{`
        .nav-btn-tienda {
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .nav-btn-tienda::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .nav-btn-tienda:hover::before { transform: translateX(100%); }
        .nav-btn-tienda:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,0.40); }
        .nav-btn-cta:hover { opacity: 0.88; transform: translateY(-1px); }
        .nav-btn-cta { transition: opacity 0.2s ease, transform 0.2s ease; }
      `}</style>

      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 16, left: 16, right: 16,
          height: 68,
          zIndex: 50,
          borderRadius: open ? '12px 12px 0 0' : 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          background: (scrolled || open) ? 'rgba(255,255,255,0.96)' : 'transparent',
          backdropFilter: (scrolled || open) ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: (scrolled || open) ? 'blur(14px)' : 'none',
          boxShadow: (scrolled && !open) ? '0 2px 24px rgba(0,0,0,0.07)' : 'none',
          transition: 'background 0.3s ease, box-shadow 0.3s ease, border-radius 0.15s ease, top 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, margin: '0 auto' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0, marginRight: 36 }}>
            <Image
              src="/images/brand/logo-grupo-rubio.webp"
              alt="Grupo Rubio"
              height={56}
              width={220}
              style={{ height: 56, width: 'auto' }}
              priority
            />
          </Link>

          {/* Inicio */}
          <Link
            href="/"
            className="group"
            style={{
              display: 'flex', alignItems: 'center',
              fontSize: 14, fontWeight: 700, color: linkColor,
              textDecoration: 'none',
              padding: '6px 14px', borderRadius: 8,
              whiteSpace: 'nowrap', position: 'relative',
              transition: 'color 0.25s ease',
            }}
          >
            <span style={{ position: 'relative' }}>
              Inicio
              <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 rounded-full bg-current transition-all duration-300 ease-out group-hover:w-full" />
            </span>
          </Link>

          {/* Servicios — dropdown trigger */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <Link
              href="/servicios"
              className="group"
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 14, fontWeight: 700, color: linkColor,
                textDecoration: 'none',
                padding: '6px 14px', borderRadius: 8,
                whiteSpace: 'nowrap', position: 'relative',
                transition: 'color 0.25s ease',
              }}
            >
              <span style={{ position: 'relative' }}>
                Servicios
                <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 rounded-full bg-current transition-all duration-300 ease-out group-hover:w-full" />
              </span>
              <ChevronDown
                size={12}
                style={{
                  color: chevronColor,
                  marginTop: 1,
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease, color 0.25s ease',
                }}
              />
            </Link>

          </div>

          {/* Nosotros + Contacto */}
          {[
            { label: 'Nosotros', href: '/nosotros' },
            { label: 'Contacto', href: '/contacto' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group"
              style={{
                display: 'flex', alignItems: 'center',
                fontSize: 14, fontWeight: 700, color: linkColor,
                textDecoration: 'none',
                padding: '6px 14px', borderRadius: 8,
                whiteSpace: 'nowrap', position: 'relative',
                transition: 'color 0.25s ease',
              }}
            >
              <span style={{ position: 'relative' }}>
                {link.label}
                <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 rounded-full bg-current transition-all duration-300 ease-out group-hover:w-full" />
              </span>
            </Link>
          ))}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Language selector */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => { if (langTimer.current) clearTimeout(langTimer.current); setLangOpen(true); }}
            onMouseLeave={() => { langTimer.current = setTimeout(() => setLangOpen(false), 120); }}
          >
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                color: (!showDark && isOnDarkPage) ? 'rgba(255,255,255,0.75)' : '#6B7280',
                padding: '6px 10px', borderRadius: 8,
                transition: 'color 0.2s ease',
              }}
            >
              {FLAG_MAP[currentLocale]}
              <ChevronDown size={11} style={{
                transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }} />
            </button>

            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: '#FFFFFF',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              overflow: 'hidden',
              minWidth: 130,
              zIndex: 60,
              opacity: langOpen ? 1 : 0,
              pointerEvents: langOpen ? 'auto' : 'none',
              transform: langOpen ? 'translateY(0)' : 'translateY(-4px)',
              transition: 'opacity 0.15s ease, transform 0.15s ease',
            }}>
              {LOCALES.map((locale) => {
                const isActive = locale.code === currentLocale;
                return (
                  <button
                    key={locale.code}
                    onClick={() => switchLocale(locale.code)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '9px 14px',
                      background: isActive ? '#F9FAFB' : 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      fontSize: 13, fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#111827' : '#6B7280',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    {FLAG_MAP[locale.code]}
                    {locale.label}
                    {isActive && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#111827' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/presupuesto"
            className="nav-btn-cta"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              borderRadius: 8,
              background: !showDark && isOnDarkPage ? 'rgba(255,255,255,0.14)' : '#111827',
              border: !showDark && isOnDarkPage ? '1px solid rgba(255,255,255,0.22)' : '1px solid transparent',
              color: '#ffffff',
              fontSize: 13, fontWeight: 600,
              padding: '10px 20px',
              textDecoration: 'none',
              flexShrink: 0, whiteSpace: 'nowrap',
              marginLeft: 8,
            }}
          >
            Solicitar presupuesto
          </Link>

          {/* Tienda — accent button */}
          <Link
            href="/tienda"
            className="nav-btn-tienda"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              borderRadius: 8,
              background: !showDark && isOnDarkPage
                ? 'rgba(255,255,255,0.12)'
                : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              border: !showDark && isOnDarkPage ? '1px solid rgba(255,255,255,0.22)' : '1px solid transparent',
              color: '#ffffff',
              fontSize: 13, fontWeight: 600,
              padding: '10px 18px',
              textDecoration: 'none',
              flexShrink: 0, whiteSpace: 'nowrap',
              marginLeft: 8,
              boxShadow: !showDark && isOnDarkPage ? 'none' : '0 2px 8px rgba(37,99,235,0.30)',
            }}
          >
            <Store size={14} />
            Tienda
          </Link>

          <div style={{ color: linkColor }}>
            <CartButton />
          </div>

        </div>

        {/* ── Mega-menu dropdown — absolute child of nav ── */}
        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#FFFFFF',
            borderRadius: '0 0 12px 12px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.06)',
            borderLeft: '1px solid #E5E7EB',
            borderRight: '1px solid #E5E7EB',
            borderBottom: '1px solid #E5E7EB',
            padding: '28px 32px 24px',
            pointerEvents: open ? 'auto' : 'none',
            opacity: open ? 1 : 0,
            visibility: open ? 'visible' : 'hidden',
            transition: 'opacity 0.18s ease, visibility 0.18s ease',
          }}
        >
          {/* Category columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 28 }}>
            {CATEGORY_ORDER.map((cat) => {
              const catServices = FEATURED[cat]
                .map((slug) => SERVICES.find((s) => s.slug === slug))
                .filter(Boolean);
              return (
                <div key={cat}>
                  <p style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.11em',
                    textTransform: 'uppercase', color: '#9CA3AF',
                    margin: '0 0 10px',
                  }}>
                    {CATEGORY_LABELS[cat]}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {catServices.map((s) => s && (
                      <li key={s.slug}>
                        <Link
                          href={`/servicios/${s.slug}`}
                          onClick={() => setOpen(false)}
                          style={{
                            display: 'block', fontSize: 13, fontWeight: 500,
                            color: '#374151', textDecoration: 'none',
                            padding: '5px 8px', borderRadius: 6, lineHeight: 1.4,
                            transition: 'background 0.12s ease, color 0.12s ease',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = '#F9FAFB';
                            (e.currentTarget as HTMLElement).style.color = '#111827';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = '#374151';
                          }}
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 14, marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              href="/alquiler"
              onClick={() => setOpen(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                fontSize: 12, fontWeight: 600,
                color: '#fff',
                background: '#111827',
                padding: '7px 14px',
                borderRadius: 6,
                textDecoration: 'none',
              }}
            >
              <Truck size={12} /> Catálogo de alquiler
            </Link>
            <Link
              href="/servicios"
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 600, color: '#111827',
                textDecoration: 'none',
              }}
            >
              Ver catálogo completo <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
