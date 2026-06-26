import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { TiendaStorefront, type StoreProduct } from "@/components/tienda/TiendaStorefront"
import { CollectionShowcase } from "@/components/tienda/CollectionShowcase"
import { BrandStory } from "@/components/tienda/BrandStory"
import { AdvisoryBanner } from "@/components/tienda/AdvisoryBanner"
import { ReviewsCarousel } from "@/components/sections/reviews-carousel"
import { medusa } from "@/lib/medusa"
import { buildAlternates } from "@/lib/seo"
import Image from "next/image"
import { ThumbsUp, ShieldCheck, Users } from "lucide-react"
const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID!

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: "Tienda profesional — Grupo Rubio",
    description: "Desengrasantes, desinfectantes, insecticidas y productos de higiene para empresas y comunidades.",
    alternates: buildAlternates(locale, "tienda"),
  }
}

export default async function TiendaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params)

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

      {/* ── NUESTRA COLECCIÓN ── 8 categorías con simbología profesional ── */}
      <CollectionShowcase locale={locale} />

      {/* ── BRAND STORY ── puzzle de imágenes + texto de confianza ── */}
      <BrandStory />

      {/* ── MÁS VENDIDOS ── */}
      <TiendaStorefront products={products} locale={locale} />

      {/* ── GOOGLE REVIEWS ── */}
      <ReviewsCarousel />

      {/* ── BANNER ASESORAMIENTO GUIADO ── */}
      <AdvisoryBanner locale={locale} />

      <Footer />
    </div>
  )
}
