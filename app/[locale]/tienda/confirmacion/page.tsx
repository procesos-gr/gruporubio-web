import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default async function ConfirmacionPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Tienda" })

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div style={{
        background: "#F9FAFB", minHeight: "70vh",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ maxWidth: 560, padding: "80px 32px", textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "#DCFCE7", margin: "0 auto 28px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CheckCircle size={36} color="#16a34a" />
          </div>
          <h1 style={{
            fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#111827",
            letterSpacing: "-1px", marginBottom: 16,
          }}>
            {t("order_confirmed")}
          </h1>
          <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.65, marginBottom: 32 }}>
            {t("order_confirmed_desc")}
          </p>
          <Link
            href={`/${locale}/tienda`}
            style={{
              display: "inline-flex", alignItems: "center",
              padding: "13px 28px", borderRadius: 8,
              background: "#111827", color: "#FFFFFF",
              fontSize: 14, fontWeight: 700, textDecoration: "none",
            }}
          >
            {t("order_continue")}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
