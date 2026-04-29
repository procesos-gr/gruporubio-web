"use client";

import { Phone, MapPin, Mail, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const services = [
  { label: "Limpieza",              href: "/servicios#limpieza" },
  { label: "Control de Plagas",     href: "/servicios#plagas" },
  { label: "Seguridad Alimentaria", href: "/servicios#alimentaria" },
  { label: "Maquinaria",            href: "/servicios#maquinaria" },
  { label: "Formación",             href: "/servicios#formacion" },
  { label: "Ver todos",             href: "/servicios" },
];

const company = [
  { label: "Quiénes somos",        href: "/nosotros" },
  { label: "Todos los servicios",  href: "/servicios" },
  { label: "Tienda",               href: "/tienda" },
  { label: "Contacto",             href: "/contacto" },
];

const legalLinks = [
  { label: "Política de privacidad", href: "/privacidad" },
  { label: "Aviso legal",            href: "/aviso-legal" },
  { label: "Cookies",                href: "/cookies" },
];

export default function Footer() {
  const pathname = usePathname();
  const isPresupuesto = pathname?.includes("/presupuesto");

  return (
    <footer
      style={{ backgroundColor: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="w-full"
    >
      {/* ── Cabecera del footer ── */}
      <div
        className="max-w-7xl mx-auto px-6 pt-16 pb-14"
        style={{ borderBottom: "1px solid #374151" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

          {/* Tagline */}
          <div className="flex flex-col gap-4 max-w-xl">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B7280" }}>
              Grupo Rubio · Desde 1970
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 800,
                color: "#F9FAFB",
                lineHeight: 1.12,
                letterSpacing: "-1.5px",
              }}
            >
              Lo que no se ve<br />también importa.
            </h2>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 lg:items-end">
            <a
              href={isPresupuesto ? "/contacto" : "/presupuesto"}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#ffffff", color: "#111827",
                fontSize: 14, fontWeight: 700, padding: "13px 24px",
                borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap",
              }}
            >
              {isPresupuesto ? "Contactar" : "Solicitar presupuesto"} <ArrowUpRight size={15} />
            </a>
          </div>

        </div>
      </div>

      {/* ── Columnas ── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Columna 1 — Marca */}
          <div className="flex flex-col gap-5">
            <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
              Servicios profesionales de limpieza, higiene y control de plagas
              en Navarra, Aragón y La Rioja.
            </p>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.04)", border: "1px solid #374151",
                borderRadius: 6, padding: "6px 12px", width: "fit-content",
              }}
            >
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>✓ Homologado Gobierno de Navarra</span>
            </div>
            <div className="flex gap-2 mt-1">
              {[
                { icon: LinkedinIcon, label: "LinkedIn" },
                { icon: FacebookIcon, label: "Facebook" },
                { icon: InstagramIcon, label: "Instagram" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-150"
                  style={{ background: "#111827", color: "#9CA3AF", border: "1px solid #374151" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#F9FAFB";
                    (e.currentTarget as HTMLElement).style.borderColor = "#6B7280";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#9CA3AF";
                    (e.currentTarget as HTMLElement).style.borderColor = "#374151";
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2 — Servicios */}
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#F9FAFB" }}>
              Servicios
            </span>
            <ul className="flex flex-col gap-2.5">
              {services.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: "#9CA3AF", textDecoration: "none" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#F9FAFB")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#9CA3AF")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 — Empresa */}
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#F9FAFB" }}>
              Empresa
            </span>
            <ul className="flex flex-col gap-2.5">
              {company.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: "#9CA3AF", textDecoration: "none" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#F9FAFB")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#9CA3AF")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4 — Contacto */}
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#F9FAFB" }}>
              Contacto
            </span>
            <ul className="flex flex-col gap-3">
              {[
                { icon: Phone,  text: "948 82 50 25",       href: "tel:+34948825025" },
                { icon: Mail,   text: "info@gruporubio.es", href: "mailto:info@gruporubio.es" },
                { icon: MapPin, text: "Tudela, Navarra",    href: null },
              ].map(({ icon: Icon, text, href }) => (
                <li key={text} className="flex items-center gap-3">
                  <div
                    style={{
                      width: 30, height: 30, borderRadius: 7,
                      background: "#111827", border: "1px solid #374151",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <Icon size={13} style={{ color: "#9CA3AF" }} />
                  </div>
                  {href ? (
                    <a href={href} className="text-sm" style={{ color: "#9CA3AF", textDecoration: "none" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#F9FAFB")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#9CA3AF")}
                    >{text}</a>
                  ) : (
                    <span className="text-sm" style={{ color: "#9CA3AF" }}>{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-6 pb-8" style={{ borderTop: "1px solid #374151" }}>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-6">
          <p className="text-xs" style={{ color: "#6B7280" }}>
            © 2025 Grupo Rubio Servicios Higiénicos Integrales S.L. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-xs" style={{ color: "#6B7280" }}>
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{ textDecoration: "none", color: "#6B7280" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#D1D5DB")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#6B7280")}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
