import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { ContactSection } from "@/components/sections/contact/contact-section";

export const metadata: Metadata = {
  title: "Contacto | Grupo Rubio — Limpieza y Plagas Navarra",
  description: "Contacta con Grupo Rubio. Llámanos al 948 82 50 25 o escríbenos a administracion@gruporubio.net. Estamos en Tudela, Navarra.",
  openGraph: {
    title: "Contacto | Grupo Rubio",
    description: "Habla con nuestro equipo. 948 82 50 25 · administracion@gruporubio.net · Tudela, Navarra.",
    url: "https://gruporubio.es/es/contacto",
  },
};

export default function ContactoPage() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* ── Header ── */}
      <div style={{ background: "#111827", padding: "100px 32px 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <Link href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
              Inicio
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>Contacto</span>
          </nav>
          <h1 style={{
            fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800, color: "#F9FAFB",
            letterSpacing: "-2px", lineHeight: 1.06, maxWidth: 560, marginBottom: 16,
          }}>
            ¿En qué podemos ayudarte?
          </h1>
          <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 460, lineHeight: 1.65, margin: 0 }}>
            Selecciona el tipo de consulta y te atendemos en menos de 24 horas.
          </p>
        </div>
      </div>

      <ContactSection />

      <Footer />
    </div>
  );
}
