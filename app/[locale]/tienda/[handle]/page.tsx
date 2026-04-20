import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { ProductGallery } from "@/components/tienda/ProductGallery"
import { AddToCartButton } from "@/components/tienda/AddToCartButton"
import { medusa } from "@/lib/medusa"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { notFound } from "next/navigation"

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
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div style={{ background: "#111827", padding: "80px 32px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href={`/${locale}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
              {t("breadcrumb_home")}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>/</span>
            <Link href={`/${locale}/tienda`} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
              {t("breadcrumb_shop")}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{product.title}</span>
          </nav>
        </div>
      </div>

      <div style={{ background: "#F9FAFB" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <ProductGallery images={images} title={product.title ?? ""} />
            <div style={{ paddingTop: 4 }}>
              <p style={{
                fontSize: 12, fontWeight: 600, color: "#6B7280",
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10,
              }}>
                Grupo Rubio
              </p>
              <h1 style={{
                fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#111827",
                letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 16,
              }}>
                {product.title}
              </h1>
              {formattedPrice && (
                <p style={{ fontSize: 28, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.5px", marginBottom: 24 }}>
                  {formattedPrice}
                </p>
              )}
              {product.description && (
                <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.7, marginBottom: 32 }}>
                  {product.description}
                </p>
              )}
              <AddToCartButton
                variants={variants}
                labelAdd={t("add_to_cart")}
                labelAdding={t("adding")}
                labelSelect={t("select_variant")}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
