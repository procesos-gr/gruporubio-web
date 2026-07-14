import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { MaquinaCard } from "@/components/alquiler/MaquinaCard"
import { getMaquinaria, getCategoriasDe } from "@/lib/maquinaria"
import { buildAlternates } from "@/lib/seo"
import Link from "next/link"
import { ArrowRight, Clock, Phone, ShieldCheck } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: "Alquiler de Maquinaria Industrial — Grupo Rubio",
    description:
      "Alquiler de maquinaria de limpieza industrial profesional en Navarra. Fregadoras, hidrolimpiadoras, barredoras, aspiradores y más.",
    alternates: buildAlternates(locale, "alquiler"),
  }
}

export default async function AlquilerPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const maquinaria = await getMaquinaria()
  const categorias = getCategoriasDe(maquinaria)

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div
        style={{
          background: "#111827",
          padding: "120px 32px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 65% 50%, rgba(37,99,235,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <h1
            style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              fontWeight: 800,
              color: "#F9FAFB",
              letterSpacing: "-2px",
              lineHeight: 1.06,
              maxWidth: 620,
              marginBottom: 16,
            }}
          >
            Alquiler de maquinaria industrial
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "#9CA3AF",
              maxWidth: 520,
              lineHeight: 1.65,
              marginBottom: 32,
            }}
          >
            Maquinaria de limpieza profesional disponible para alquiler por días, semanas o meses.
            Entrega en obra, asistencia técnica incluida.
          </p>

          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              { icon: <Clock size={14} />, text: "Entrega en 24h" },
              { icon: <ShieldCheck size={14} />, text: "Mantenimiento incluido" },
              { icon: <Phone size={14} />, text: "Soporte técnico" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                <span style={{ color: "#2563EB" }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog */}
      <div style={{ background: "#F9FAFB", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px" }}>
          {categorias.map((cat) => {
            const maquinas = maquinaria.filter((m) => m.categoria === cat)
            return (
              <div key={cat} style={{ marginBottom: 56 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#111827",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    {cat}
                  </h2>
                  <div
                    style={{ flex: 1, height: 1, background: "#E5E7EB", marginTop: 2 }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {maquinas.map((m) => (
                    <MaquinaCard key={m.handle} maquina={m} locale={locale} />
                  ))}
                </div>
              </div>
            )
          })}

          {/* Bottom CTA */}
          <div
            style={{
              background: "#111827",
              borderRadius: 8,
              padding: "36px 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#F9FAFB",
                  marginBottom: 6,
                  letterSpacing: "-0.4px",
                }}
              >
                ¿No encuentras lo que necesitas?
              </p>
              <p style={{ fontSize: 14, color: "#9CA3AF" }}>
                Contacta con nosotros y buscamos la solución adecuada para tu proyecto.
              </p>
            </div>
            <Link
              href={`/${locale}/contacto`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#2563EB",
                color: "#FFFFFF",
                padding: "13px 24px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Contactar <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
