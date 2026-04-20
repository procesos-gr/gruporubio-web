import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { ProductGrid } from "@/components/tienda/ProductGrid"
import { medusa } from "@/lib/medusa"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID!

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Tienda" })
  return {
    title: `${t("page_title")} — Grupo Rubio`,
    description: t("page_subtitle"),
  }
}

export default async function TiendaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Tienda" })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products: any[] = []
  try {
    const result = await medusa.store.product.list({
      region_id: REGION_ID,
      fields: "+variants.calculated_price",
      limit: 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    products = result.products ?? []
  } catch {
    products = []
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div style={{ background: "#111827", padding: "100px 32px 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
              {t("breadcrumb_home")}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{t("breadcrumb_shop")}</span>
          </nav>
          <h1 style={{
            fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800, color: "#F9FAFB",
            letterSpacing: "-2px", lineHeight: 1.06, maxWidth: 620, marginBottom: 16,
          }}>
            {t("page_title")}
          </h1>
          <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 480, lineHeight: 1.65 }}>
            {t("page_subtitle")}
          </p>
        </div>
      </div>

      <div style={{ background: "#F9FAFB", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px" }}>
          <ProductGrid products={products} locale={locale} />
        </div>
      </div>

      <Footer />
    </div>
  )
}
