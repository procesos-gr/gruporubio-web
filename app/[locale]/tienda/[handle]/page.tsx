import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { ProductGallery } from "@/components/tienda/ProductGallery"
import { AddToCartButton } from "@/components/tienda/AddToCartButton"
import { medusa } from "@/lib/medusa"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ShieldCheck, Truck, Award, Package, ChevronRight } from "lucide-react"

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID!

type MedusaImage = { id: string; url: string }
type MedusaVariant = {
  id: string
  title?: string | null
  calculated_price?: { calculated_amount?: number | null } | null
}
type MedusaProduct = {
  id: string
  title?: string | null
  handle: string
  description?: string | null
  thumbnail?: string | null
  images?: MedusaImage[]
  variants?: MedusaVariant[]
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { locale, handle } = await params
  const t = await getTranslations({ locale, namespace: "Tienda" })

  let product: MedusaProduct | null = null
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await medusa.store.product.list({
      handle,
      region_id: REGION_ID,
      fields: "+variants.calculated_price,+images",
    } as any)
    product = (result.products?.[0] ?? null) as MedusaProduct | null
  } catch {
    product = null
  }

  if (!product) notFound()

  const images = (product.images ?? []).map((img) => ({
    id: img.id,
    url: img.url,
    alt: product!.title ?? null,
  }))

  const variants = (product.variants ?? []).map((v) => ({
    id: v.id,
    title: v.title ?? v.id,
  }))

  const prices = (product.variants ?? [])
    .map((v) => v.calculated_price?.calculated_amount ?? null)
    .filter((p): p is number => p !== null)
  const minPrice = prices.length > 0 ? Math.min(...prices) : null
  const formattedPrice = minPrice
    ? new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(minPrice / 100)
    : null

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#F9FAFB", minHeight: "100vh" }}>
      <Navbar />

      {/* Thin dark back-strip */}
      <div style={{ background: "#111827" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 32px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
            <Link href={`/${locale}`} style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Inicio</Link>
            <ChevronRight size={12} />
            <Link href={`/${locale}/tienda`} style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
              <ArrowLeft size={12} />
              {t("breadcrumb_shop")}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Hero product block ── */}
      <div style={{ background: "#FFFFFF", borderTop: "1px solid #1F2937" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 32px 64px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Gallery — will show all product images from Medusa */}
            <ProductGallery images={images} title={product.title ?? ""} />

            {/* Info panel */}
            <div style={{ display: "flex", flexDirection: "column" }}>

              {/* Badges */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "#EFF6FF", border: "1px solid #BFDBFE",
                  borderRadius: 6, padding: "3px 10px",
                  fontSize: 11, fontWeight: 700, color: "#1D4ED8",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  <Award size={10} />
                  Grupo Rubio
                </span>
                <span style={{
                  background: "#F0FDF4", border: "1px solid #BBF7D0",
                  borderRadius: 6, padding: "3px 10px",
                  fontSize: 11, fontWeight: 600, color: "#15803D",
                }}>
                  Uso profesional
                </span>
                {variants.length > 1 && (
                  <span style={{
                    background: "#FFF7ED", border: "1px solid #FED7AA",
                    borderRadius: 6, padding: "3px 10px",
                    fontSize: 11, fontWeight: 600, color: "#C2410C",
                  }}>
                    {variants.length} variantes
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800, color: "#111827",
                letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 20,
              }}>
                {product.title}
              </h1>

              {/* Price */}
              {formattedPrice && (
                <div style={{
                  display: "flex", alignItems: "baseline", gap: 10,
                  marginBottom: 28, paddingBottom: 28,
                  borderBottom: "1px solid #F3F4F6",
                }}>
                  <span style={{ fontSize: 38, fontWeight: 800, color: "#111827", letterSpacing: "-1.5px" }}>
                    {formattedPrice}
                  </span>
                  <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>IVA incl.</span>
                </div>
              )}

              {/* Short description — from Medusa product description */}
              {product.description && (
                <p style={{
                  fontSize: 15, color: "#4B5563", lineHeight: 1.75,
                  marginBottom: 28,
                }}>
                  {product.description}
                </p>
              )}

              {/* Add to cart */}
              <AddToCartButton
                variants={variants}
                productTitle={product.title ?? ""}
                labelAdd={t("add_to_cart")}
                labelAdding={t("adding")}
                labelSelect={t("select_variant")}
              />

              {/* Trust row */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10,
                marginTop: 28, paddingTop: 24, borderTop: "1px solid #F3F4F6",
              }}>
                {[
                  { icon: <Truck size={15} />, label: "Envío rápido" },
                  { icon: <ShieldCheck size={15} />, label: "Calidad garantizada" },
                  { icon: <Package size={15} />, label: "Stock disponible" },
                ].map(({ icon, label }) => (
                  <div key={label} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    padding: "12px 6px", borderRadius: 8,
                    background: "#F9FAFB", border: "1px solid #F3F4F6", textAlign: "center",
                  }}>
                    <span style={{ color: "#2563EB" }}>{icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", lineHeight: 1.3 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Description section — populated from Medusa ── */}
      {product.description && (
        <div style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px" }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div style={{ gridColumn: "span 2" }}>
                <h2 style={{
                  fontSize: 22, fontWeight: 800, color: "#111827",
                  letterSpacing: "-0.5px", marginBottom: 20,
                }}>
                  Descripción del producto
                </h2>
                <div style={{
                  fontSize: 15, color: "#374151", lineHeight: 1.8,
                  whiteSpace: "pre-line",
                }}>
                  {product.description}
                </div>
              </div>

              {/* Sidebar specs placeholder — future: add custom Medusa metadata fields */}
              <div style={{
                background: "#FFFFFF", borderRadius: 8,
                border: "1px solid #E5E7EB", padding: "24px",
                alignSelf: "start",
              }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Detalles
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Referencia", value: product.handle },
                    { label: "Variantes disponibles", value: variants.length > 0 ? `${variants.length}` : "—" },
                    { label: "Uso", value: "Profesional" },
                    { label: "Categoría", value: "Higiene industrial" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 8, paddingBottom: 12, borderBottom: "1px solid #F3F4F6" }}>
                      <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{label}</span>
                      <span style={{ fontSize: 12, color: "#111827", fontWeight: 600, textAlign: "right" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
