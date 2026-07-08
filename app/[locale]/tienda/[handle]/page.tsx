import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { ProductGallery } from "@/components/tienda/ProductGallery"
import { AddToCartButton } from "@/components/tienda/AddToCartButton"
import { TrackViewItem } from "@/components/analytics/TrackViewItem"
import { ProductReviews } from "@/components/tienda/ProductReviews"
import { ProductCard } from "@/components/tienda/ProductCard"
import { AdvisoryBanner } from "@/components/tienda/AdvisoryBanner"
import { medusa } from "@/lib/medusa"
import { buildAlternates } from "@/lib/seo"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ShieldCheck, Truck, Award, Package, ChevronRight } from "lucide-react"

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID!

type MedusaImage = { id: string; url: string }
type MedusaVariant = {
  id: string
  title?: string | null
  calculated_price?: { calculated_amount?: number | null } | null
}
type MedusaCategory = { id: string; name: string; handle: string }
type MedusaProduct = {
  id: string
  title?: string | null
  handle: string
  description?: string | null
  thumbnail?: string | null
  images?: MedusaImage[]
  variants?: MedusaVariant[]
  categories?: MedusaCategory[]
}

type RelatedProduct = {
  id: string
  handle: string
  title: string
  thumbnail: string | null
  variants?: MedusaVariant[]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; handle: string }> }) {
  const { locale, handle: rawHandle } = await params
  const handle = decodeURIComponent(rawHandle)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await medusa.store.product.list({ handle, fields: "title,description,thumbnail" } as any).catch(() => null)
  const product = result?.products?.[0]

  if (!product) {
    return { title: "Producto no encontrado — Grupo Rubio" }
  }

  const description = product.description
    ? product.description.slice(0, 160)
    : "Producto profesional de limpieza e higiene Grupo Rubio."

  return {
    title: `${product.title} — Grupo Rubio`,
    description,
    alternates: buildAlternates(locale, `tienda/${handle}`),
    openGraph: {
      title: `${product.title} — Grupo Rubio`,
      description,
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
      type: "website",
    },
  }
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
    const result = await medusa.store.product.list({
      handle,
      region_id: REGION_ID,
      fields: "+variants.calculated_price,+images,*categories",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const category = product.categories?.[0] ?? null

  let related: RelatedProduct[] = []
  if (category) {
    try {
      const result = await medusa.store.product.list({
        category_id: [category.id],
        region_id: REGION_ID,
        fields: "+variants.calculated_price",
        limit: 5,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      related = ((result.products ?? []) as any[]).filter(p => p.id !== product!.id).slice(0, 4)
    } catch {
      related = []
    }
  }

  // ── Reviews (plugin @lambdacurry/medusa-product-reviews) ──
  type RawReview = {
    id: string
    name?: string | null
    rating: number
    content?: string | null
    created_at: string
  }
  type StatsResponse = { product_review_stats: { average_rating?: number; review_count?: number }[] }
  type ReviewsResponse = { product_reviews: RawReview[] }

  let reviewRating: { average: number; count: number } | null = null
  let reviewList: { id: string; author: string; rating: number; text: string; date: string }[] = []
  try {
    const [statsRes, reviewsRes] = await Promise.all([
      medusa.client.fetch<StatsResponse>("/store/product-review-stats", {
        query: { product_id: product.id },
      }),
      medusa.client.fetch<ReviewsResponse>("/store/product-reviews", {
        query: { product_id: product.id, status: "approved", limit: 20 },
      }),
    ])
    const stats = statsRes.product_review_stats?.[0]
    if (stats && (stats.review_count ?? 0) > 0) {
      reviewRating = { average: stats.average_rating ?? 0, count: stats.review_count ?? 0 }
    }
    reviewList = (reviewsRes.product_reviews ?? []).map(r => ({
      id: r.id,
      author: r.name || "Cliente",
      rating: r.rating,
      text: r.content ?? "",
      date: new Date(r.created_at).toLocaleDateString(locale, { year: "numeric", month: "long" }),
    }))
  } catch {
    reviewRating = null
    reviewList = []
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? undefined,
    image: images.map(img => img.url),
    sku: product.handle,
    category: category?.name,
    url: `https://gruporubio.es/${locale}/tienda/${product.handle}`,
    offers: minPrice != null ? {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: (minPrice / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: `https://gruporubio.es/${locale}/tienda/${product.handle}`,
    } : undefined,
    aggregateRating: reviewRating ? {
      "@type": "AggregateRating",
      ratingValue: reviewRating.average.toFixed(1),
      reviewCount: reviewRating.count,
    } : undefined,
    review: reviewList.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: { "@type": "Rating", ratingValue: r.rating },
      reviewBody: r.text || undefined,
      datePublished: r.date,
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `https://gruporubio.es/${locale}` },
      { "@type": "ListItem", position: 2, name: t("breadcrumb_shop"), item: `https://gruporubio.es/${locale}/tienda` },
      ...(category ? [{ "@type": "ListItem", position: 3, name: category.name, item: `https://gruporubio.es/${locale}/tienda/categoria/${category.handle}` }] : []),
      { "@type": "ListItem", position: category ? 4 : 3, name: product.title, item: `https://gruporubio.es/${locale}/tienda/${product.handle}` },
    ],
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#FFFFFF", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TrackViewItem
        value={minPrice != null ? minPrice / 100 : 0}
        item={{
          item_id: product.id,
          item_name: product.title ?? "",
          price: minPrice != null ? minPrice / 100 : undefined,
          item_category: category?.name,
        }}
      />
      <Navbar />

      <div style={{ paddingTop: 84 }}>
        {/* ── BREADCRUMB ── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280", flexWrap: "wrap" }}>
            <Link href={`/${locale}`} style={{ color: "#9CA3AF", textDecoration: "none" }}>Inicio</Link>
            <ChevronRight size={12} />
            <Link href={`/${locale}/tienda`} style={{ color: "#9CA3AF", textDecoration: "none" }}>{t("breadcrumb_shop")}</Link>
            {category && (
              <>
                <ChevronRight size={12} />
                <Link href={`/${locale}/tienda/categoria/${category.handle}`} style={{ color: "#9CA3AF", textDecoration: "none" }}>
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight size={12} />
            <span style={{ color: "#111827", fontWeight: 600 }}>{product.title}</span>
          </div>
        </div>

        {/* ── Hero product block ── */}
        <div style={{ padding: "32px 32px 64px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

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

                {/* Short description */}
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
      </div>

      {/* ── Description section ── */}
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
                    { label: "Categoría", value: category?.name ?? "—" },
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

      {/* ── Reviews — preparado para cuando exista sistema de opiniones ── */}
      <ProductReviews rating={reviewRating} reviews={reviewList} />

      {/* ── Productos relacionados de la misma categoría ── */}
      {related.length > 0 && (
        <div style={{ background: "#F8FAFC", borderTop: "1px solid #E5E7EB" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", marginBottom: 24 }}>
              También te puede interesar
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 20,
            }}>
              {related.map(p => {
                const relPrices = (p.variants ?? [])
                  .map(v => v.calculated_price?.calculated_amount ?? null)
                  .filter((x): x is number => x !== null)
                const relMinPrice = relPrices.length > 0 ? Math.min(...relPrices) : null
                const relVariants = (p.variants ?? [])
                  .filter(v => v.id && v.title)
                  .map(v => ({ id: v.id, title: v.title! }))

                return (
                  <ProductCard
                    key={p.id}
                    handle={p.handle}
                    title={p.title}
                    thumbnail={p.thumbnail}
                    minPrice={relMinPrice}
                    currency="EUR"
                    locale={locale}
                    variants={relVariants}
                    rating={null}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}

      <AdvisoryBanner locale={locale} />

      <Footer />
    </div>
  )
}
