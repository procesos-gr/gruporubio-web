import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { RentalRequestForm } from "@/components/alquiler/RentalRequestForm"
import { MaquinasRelacionadas } from "@/components/alquiler/MaquinasRelacionadas"
import { getMaquina, MAQUINARIA } from "@/lib/maquinaria-alquiler"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ChevronRight,
  Wrench,
  Clock,
  ShieldCheck,
  Truck,
  Phone,
} from "lucide-react"
import type { Metadata } from "next"

export async function generateStaticParams() {
  return MAQUINARIA.map((m) => ({ handle: m.handle }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const maquina = getMaquina(handle)
  if (!maquina) return {}
  return {
    title: `${maquina.titulo} — Alquiler | Grupo Rubio`,
    description: maquina.descripcionCorta,
  }
}

export default async function AlquilerDetallePage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { locale, handle } = await params
  const maquina = getMaquina(handle)
  if (!maquina) notFound()

  const disponibleColor = maquina.disponible ? "#15803D" : "#DC2626"
  const disponibleBg = maquina.disponible ? "#F0FDF4" : "#FEF2F2"
  const disponibleBorder = maquina.disponible ? "#BBF7D0" : "#FECACA"

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#F9FAFB", minHeight: "100vh" }}>
      <Navbar />

      {/* Breadcrumb strip */}
      <div style={{ background: "#111827" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 32px 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              flexWrap: "wrap",
            }}
          >
            <Link href={`/${locale}`} style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
              Inicio
            </Link>
            <ChevronRight size={12} />
            <Link
              href={`/${locale}/alquiler`}
              style={{
                color: "rgba(255,255,255,0.45)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <ArrowLeft size={12} />
              Alquiler de maquinaria
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{maquina.titulo}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ background: "#FFFFFF", borderTop: "1px solid #1F2937" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 64px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left: image placeholder + specs */}
            <div>
              {/* Image area */}
              <div
                style={{
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  overflow: "hidden",
                  marginBottom: 24,
                  background: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
                  height: 340,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <Wrench size={64} color="#D1D5DB" strokeWidth={1} />
                <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>
                  Foto próximamente
                </span>
              </div>

              {/* Specs card */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #F3F4F6",
                    background: "#F9FAFB",
                  }}
                >
                  <h2
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#111827",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Ficha técnica
                  </h2>
                </div>
                <div style={{ padding: "0 20px" }}>
                  {maquina.specs.map((spec, i) => (
                    <div
                      key={spec.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 0",
                        borderBottom:
                          i < maquina.specs.length - 1 ? "1px solid #F3F4F6" : "none",
                        gap: 12,
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>
                        {spec.label}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "#111827",
                          fontWeight: 700,
                          textAlign: "right",
                        }}
                      >
                        {spec.valor}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: info + form */}
            <div>
              {/* Badges */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    background: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    borderRadius: 6,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#1D4ED8",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {maquina.categoria}
                </span>
                <span
                  style={{
                    background: disponibleBg,
                    border: `1px solid ${disponibleBorder}`,
                    borderRadius: 6,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: disponibleColor,
                  }}
                >
                  {maquina.disponible ? "● Disponible" : "○ No disponible"}
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: "clamp(22px, 3vw, 34px)",
                  fontWeight: 800,
                  color: "#111827",
                  letterSpacing: "-1px",
                  lineHeight: 1.1,
                  marginBottom: 14,
                }}
              >
                {maquina.titulo}
              </h1>

              {/* Price */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  marginBottom: 20,
                  paddingBottom: 20,
                  borderBottom: "1px solid #F3F4F6",
                }}
              >
                <span
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: "#111827",
                    letterSpacing: "-1px",
                  }}
                >
                  {maquina.precioDesde}
                </span>
                <span style={{ fontSize: 13, color: "#6B7280" }}>IVA no incluido</span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: 15,
                  color: "#4B5563",
                  lineHeight: 1.75,
                  marginBottom: 20,
                }}
              >
                {maquina.descripcion}
              </p>

              {/* Use cases */}
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: 10,
                  }}
                >
                  Aplicaciones habituales
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {maquina.usos.map((uso) => (
                    <span
                      key={uso}
                      style={{
                        background: "#F3F4F6",
                        border: "1px solid #E5E7EB",
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      {uso}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trust row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                  marginBottom: 28,
                  paddingBottom: 24,
                  borderBottom: "1px solid #F3F4F6",
                }}
              >
                {[
                  { icon: <Truck size={13} />, label: "Entrega en 24h" },
                  { icon: <ShieldCheck size={13} />, label: "Mantenimiento incluido" },
                  { icon: <Phone size={13} />, label: "Soporte técnico" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 5,
                      padding: "10px 6px",
                      borderRadius: 8,
                      background: "#F9FAFB",
                      border: "1px solid #F3F4F6",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ color: "#2563EB" }}>{icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", lineHeight: 1.3 }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rental form */}
              <RentalRequestForm maquinaTitulo={maquina.titulo} />
            </div>
          </div>
        </div>
      </div>

      <MaquinasRelacionadas
        maquinas={MAQUINARIA.filter((m) => m.handle !== handle).slice(0, 3)}
        locale={locale}
      />

      <Footer />
    </div>
  )
}
