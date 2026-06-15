"use client"
import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { useParams } from "next/navigation"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

export default function CuentaPage() {
  const { locale } = useParams<{ locale: string }>()

  const handleGoogleLogin = () => {
    window.location.href = `${MEDUSA_URL}/auth/customer/google?redirectUrl=${window.location.origin}/${locale}/cuenta/callback`
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div style={{ background: "#111827", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 32px 80px" }}>
        <div style={{ maxWidth: 400, width: "100%" }}>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#F9FAFB",
            letterSpacing: "-1.5px", marginBottom: 10, lineHeight: 1.1,
          }}>
            Mi cuenta
          </h1>
          <p style={{ fontSize: 15, color: "#9CA3AF", marginBottom: 40, lineHeight: 1.6 }}>
            Accede para consultar tus pedidos y datos de envío.
          </p>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              gap: 12, padding: "14px 24px",
              background: "#FFFFFF", border: "1px solid #E5E7EB",
              borderRadius: 8, fontSize: 15, fontWeight: 600, color: "#111827",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar con Google
          </button>

          <p style={{ fontSize: 12, color: "#6B7280", textAlign: "center", marginTop: 24, lineHeight: 1.5 }}>
            Al acceder aceptas los términos de uso de Grupo Rubio
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
