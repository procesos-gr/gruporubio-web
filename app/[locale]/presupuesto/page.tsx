import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { PresupuestoForm } from "@/components/sections/PresupuestoForm";

export const metadata = {
  title: "Solicitar Presupuesto — Grupo Rubio",
  description: "Solicita un presupuesto gratuito y sin compromiso para limpieza, control de plagas, seguridad alimentaria o formación profesional.",
};

export default function PresupuestoPage() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: "#111827", padding: "120px 32px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(37,99,235,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <Link href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
              Inicio
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>Solicitar presupuesto</span>
          </nav>

          <h1 style={{
            fontSize: "clamp(30px, 4vw, 54px)", fontWeight: 800, color: "#F9FAFB",
            letterSpacing: "-2px", lineHeight: 1.06, maxWidth: 640, marginBottom: 16,
          }}>
            Solicita tu presupuesto a medida
          </h1>
          <p style={{ fontSize: 17, color: "#9CA3AF", maxWidth: 520, lineHeight: 1.65 }}>
            Cuéntanos qué necesitas y nuestro equipo técnico te enviará una propuesta detallada y personalizada, sin costes ni compromisos.
          </p>
        </div>
      </div>

      <PresupuestoForm />

      <Footer />
    </div>
  );
}
