import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { TiendaStorefront, type StoreProduct } from "@/components/tienda/TiendaStorefront"
import { medusa } from "@/lib/medusa"
import { getTranslations } from "next-intl/server"
import { ShoppingBag } from "lucide-react"

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

  let products: StoreProduct[] = []
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await medusa.store.product.list({
      region_id: REGION_ID,
      fields: "+variants.calculated_price,+collection.id,+collection.title,+collection.handle",
      limit: 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products = (result.products ?? []) as any[]
  } catch {
    products = []
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* ── HERO COMPACTO ─────────────────────────────── */}
      <style>{`
        @media (max-width: 640px) {
          .hero-stats { display: none !important; }
          .tienda-hero { padding: 80px 20px 40px !important; }
        }
      `}</style>
      <div className="tienda-hero" style={{
        background: "#111827",
        padding: "100px 32px 52px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Fondo radial sutil */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 80% at 70% 40%, rgba(37,99,235,0.14) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
            <div>
              {/* Eyebrow */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(37,99,235,0.15)",
                border: "1px solid rgba(37,99,235,0.3)",
                borderRadius: 6, padding: "5px 12px", marginBottom: 18,
              }}>
                <ShoppingBag size={13} style={{ color: "#60A5FA" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#60A5FA", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Tienda profesional
                </span>
              </div>

              <h1 style={{
                fontSize: "clamp(26px, 3.5vw, 48px)",
                fontWeight: 800, color: "#F9FAFB",
                letterSpacing: "-1.5px", lineHeight: 1.08,
                marginBottom: 12,
              }}>
                Productos de limpieza<br />
                <span style={{ color: "#60A5FA" }}>para profesionales</span>
              </h1>
              <p style={{ fontSize: 16, color: "#9CA3AF", lineHeight: 1.65, maxWidth: 480 }}>
                Desengrasantes, desinfectantes, insecticidas y productos de higiene
                para empresas, hostelería y comunidades.
              </p>
            </div>

            {/* Stats rápidos */}
            <div className="hero-stats" style={{
              display: "flex", gap: 32, flexShrink: 0,
            }}>
              {[
                { value: `${products.length}`, label: "productos" },
                { value: "4", label: "categorías" },
                { value: "24h", label: "entrega" },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <p style={{
                    fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 800,
                    color: "#FFFFFF", letterSpacing: "-1px", lineHeight: 1,
                  }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── STOREFRONT (client: trust bar + filtros + grid) ── */}
      <TiendaStorefront products={products} locale={locale} />

      <Footer />
    </div>
  )
}
