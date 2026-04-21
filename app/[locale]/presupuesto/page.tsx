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
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.30)",
            borderRadius: 6, padding: "4px 12px", marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60A5FA", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#93C5FD", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Sin compromiso · Respuesta en 24h
            </span>
          </div>
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
