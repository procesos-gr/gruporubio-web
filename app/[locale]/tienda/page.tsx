import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { TiendaStorefront, type StoreProduct } from "@/components/tienda/TiendaStorefront"
import { CollectionShowcase } from "@/components/tienda/CollectionShowcase"
import { BrandStory } from "@/components/tienda/BrandStory"
import { AdvisoryBanner } from "@/components/tienda/AdvisoryBanner"
import { TiendaSearch } from "@/components/tienda/TiendaSearch"
import { ProductGrid } from "@/components/tienda/ProductGrid"
import { ReviewsCarousel } from "@/components/sections/reviews-carousel"
import { medusa } from "@/lib/medusa"
import { searchProducts, isSearchConfigured } from "@/lib/search"
import { buildAlternates } from "@/lib/seo"
import Image from "next/image"
import Link from "next/link"
import { ThumbsUp, ShieldCheck, Users, SearchX } from "lucide-react"
const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID!

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: "Tienda profesional — Grupo Rubio",
    description: "Desengrasantes, desinfectantes, insecticidas y productos de higiene para empresas y comunidades.",
    alternates: buildAlternates(locale, "tienda"),
  }
}

const PRODUCT_FIELDS = "+variants.calculated_price,+collection.id,+collection.title,+collection.handle"

// Busca productos para /tienda?q= — Meilisearch (typo-tolerante) con
// fallback al ILIKE básico de Medusa si el buscador no está disponible.
async function searchStoreProducts(q: string): Promise<StoreProduct[]> {
  try {
    if (isSearchConfigured()) {
      const hits = await searchProducts(q, 24)
      if (hits.length === 0) return []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await medusa.store.product.list({
        id: hits.map(h => h.id),
        region_id: REGION_ID,
        fields: PRODUCT_FIELDS,
        limit: 24,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const byId = new Map(((result.products ?? []) as any[]).map(p => [p.id, p]))
      // conserva el orden de relevancia de Meilisearch
      return hits.map(h => byId.get(h.id)).filter(Boolean) as StoreProduct[]
    }
  } catch {
    // cae al fallback de abajo
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await medusa.store.product.list({
      q,
      region_id: REGION_ID,
      fields: PRODUCT_FIELDS,
      limit: 24,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.products ?? []) as any[]
  } catch {
    return []
  }
}

export default async function TiendaPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { locale } = (await params)
  const { q } = (await searchParams)
  const query = q?.trim() || null

  const searchResults = query ? await searchStoreProducts(query) : null

  let products: StoreProduct[] = []
  if (!query) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await medusa.store.product.list({
        region_id: REGION_ID,
        fields: PRODUCT_FIELDS,
        limit: 100,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      products = (result.products ?? []) as any[]
    } catch {
      products = []
    }
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#FFFFFF" }}>
      <Navbar />

      {/* Espacio blanco encima del hero = gap navbar (16px) + altura navbar (68px) */}
      <div style={{ paddingTop: 84 }}>

        {/* ── HERO ── carta con bordes redondeados, empieza justo bajo el navbar */}
        <div className="tienda-hero-wrap">
          <style>{`
            .tienda-hero-wrap {
              margin: 0 16px;
              border-radius: 16px;
              overflow: hidden;
              position: relative;
            }
            @media (max-width: 640px) {
              .tienda-hero-wrap { margin: 0; border-radius: 0; }
            }
          `}</style>

          <section style={{ position: "relative", height: 460 }}>
            <Image
              src="/images/tienda/banner-gpt2-v1-flotantes.jpg"
              alt="Productos de limpieza profesional"
              fill
              priority
              quality={95}
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
            />

            {/* ── TEXTO IZQUIERDA ── */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center",
              paddingLeft: "clamp(32px, 5vw, 72px)",
              width: "60%",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

                {/* Título */}
                <h1 style={{
                  fontSize: "clamp(28px, 3.5vw, 52px)",
                  fontWeight: 800,
                  color: "#1C2B1E",
                  letterSpacing: "-1.5px",
                  lineHeight: 1.08,
                  margin: 0,
                }}>
                  Productos de limpieza<br />profesional
                </h1>

                {/* Social proof */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: "#16A34A",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Users size={16} color="#fff" strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1C2B1E" }}>+2.000 clientes felices</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: "#16A34A",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <ThumbsUp size={16} color="#fff" strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1C2B1E" }}>Satisfacción garantizada</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: "#2563EB",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <ShieldCheck size={16} color="#fff" strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1C2B1E" }}>Calidad certificada</span>
                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>

      </div>

      {/* ── BUSCADOR ── sincronizado con ?q= */}
      <TiendaSearch locale={locale} initialQuery={query ?? ""} />

      {query ? (
        /* ── MODO BÚSQUEDA ── resultados en lugar del contenido de portada */
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "36px 32px 72px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", margin: 0 }}>
              Resultados para &ldquo;{query}&rdquo;
            </h2>
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>
              {searchResults?.length ?? 0} {(searchResults?.length ?? 0) === 1 ? "producto" : "productos"}
            </span>
            <Link href={`/${locale}/tienda`} style={{ fontSize: 13, fontWeight: 600, color: "#1e3a8a", textDecoration: "none", marginLeft: "auto" }}>
              Ver toda la tienda
            </Link>
          </div>

          {searchResults && searchResults.length > 0 ? (
            <ProductGrid products={searchResults} locale={locale} />
          ) : (
            <div style={{ textAlign: "center", padding: "64px 32px", color: "#6B7280" }}>
              <SearchX size={36} color="#D1D5DB" style={{ marginBottom: 14 }} />
              <p style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Sin resultados para &ldquo;{query}&rdquo;
              </p>
              <p style={{ fontSize: 14 }}>
                Prueba con otro término o consulta el catálogo completo de la tienda.
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ── NUESTRA COLECCIÓN ── 8 categorías con simbología profesional ── */}
          <CollectionShowcase locale={locale} />

          {/* ── BRAND STORY ── puzzle de imágenes + texto de confianza ── */}
          <BrandStory />

          {/* ── MÁS VENDIDOS ── */}
          <TiendaStorefront products={products} locale={locale} />

          {/* ── GOOGLE REVIEWS ── */}
          <ReviewsCarousel />
        </>
      )}

      {/* ── BANNER ASESORAMIENTO GUIADO ── */}
      <AdvisoryBanner locale={locale} />

      <Footer />
    </div>
  )
}
