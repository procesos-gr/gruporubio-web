import Link from "next/link";
import { SERVICES, CATEGORY_LABELS, ServiceCategory } from "@/lib/services-data";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { ArrowRight, Phone } from "lucide-react";

const CATEGORY_ORDER: ServiceCategory[] = ["limpieza", "plagas", "alimentaria", "maquinaria", "formacion"];

const CATEGORY_DESC: Record<ServiceCategory, string> = {
  limpieza: "Desde limpieza de naves industriales hasta fachadas, conductos y suelos. Equipos propios, maquinaria de última generación.",
  plagas: "Desratización, desinsectación y desinfección certificada. Homologados por el Gobierno de Navarra.",
  alimentaria: "Implantación de sistemas APPCC, auditorías sanitarias y formación obligatoria de manipuladores.",
  maquinaria: "Alquiler de maquinaria Kärcher y servicio técnico oficial. Cobertura de averías con equipo de sustitución.",
  formacion: "Centro de Formación propio con cursos presenciales y a distancia, algunos 100% subvencionados.",
};

export default function ServiciosPage() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: CATEGORY_LABELS[cat],
    desc: CATEGORY_DESC[cat],
    services: SERVICES.filter((s) => s.category === cat),
  }));

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* ── Header ── */}
      <div style={{ background: "#111827", padding: "100px 32px 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <Link href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.15s" }}>
              Inicio
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>Servicios</span>
          </nav>

          <h1 style={{
            fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800, color: "#F9FAFB",
            letterSpacing: "-2px", lineHeight: 1.06, maxWidth: 620, marginBottom: 16,
          }}>
            Nuestros servicios
          </h1>
          <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 480, lineHeight: 1.65, marginBottom: 32 }}>
            Cinco áreas de actuación especializadas para cubrir todas las necesidades higiénicas de tu empresa.
          </p>

          {/* Category quick nav */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORY_ORDER.map((cat) => (
              <a
                key={cat}
                href={`#${cat}`}
                style={{
                  display: "inline-flex", alignItems: "center",
                  fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)",
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 6, padding: "6px 14px", textDecoration: "none",
                  whiteSpace: "nowrap", transition: "background 0.15s",
                }}
              >
                {CATEGORY_LABELS[cat]}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sections ── */}
      <div style={{ background: "#FFFFFF" }}>
        {grouped.map(({ cat, label, desc, services }, gi) => (
          <section
            key={cat}
            id={cat}
            style={{
              padding: "56px 32px",
              borderBottom: gi < grouped.length - 1 ? "1px solid #F3F4F6" : "none",
            }}
          >
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              {/* Category header */}
              <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-16 items-start">
                <div style={{ paddingTop: 4 }}>
                  <h2 style={{ fontSize: "clamp(20px, 2vw, 26px)", fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", marginBottom: 12, lineHeight: 1.2 }}>
                    {label}
                  </h2>
                  <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 20 }}>
                    {desc}
                  </p>
                  <Link
                    href="/contacto"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 13, fontWeight: 600, color: "#111827",
                      textDecoration: "none",
                    }}
                  >
                    Pedir presupuesto <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Service list — compact rows */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 16px" }}>
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/servicios/${s.slug}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        className="hover:bg-gray-50 transition-colors duration-100"
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "11px 12px", borderRadius: 6,
                        }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 500, color: "#1F2937", lineHeight: 1.35 }}>
                          {s.title}
                        </span>
                        <ArrowRight size={14} style={{ color: "#D1D5DB", flexShrink: 0, marginLeft: 8 }} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── CTA ── */}
      <div style={{ background: "#111827", padding: "56px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20 }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#F9FAFB", letterSpacing: "-1px", margin: 0 }}>
            ¿No encuentras lo que buscas?
          </h2>
          <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 420, lineHeight: 1.65, margin: 0 }}>
            Cuéntanos tu necesidad. Adaptamos nuestros servicios a cada cliente.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/contacto"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#FFFFFF", color: "#111827",
                fontSize: 14, fontWeight: 700, padding: "13px 24px",
                borderRadius: 8, textDecoration: "none",
              }}
            >
              Contactar ahora <ArrowRight size={15} />
            </Link>
            <a
              href="tel:+34948825025"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.08)", color: "#D1D5DB",
                fontSize: 14, fontWeight: 500, padding: "13px 24px",
                borderRadius: 8, textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Phone size={14} /> 948 82 50 25
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
