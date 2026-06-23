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
import { ShieldCheck, MapPin, BadgeCheck, Users, Truck, Award, ThumbsUp } from "lucide-react"

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Productos de uso profesional" },
  { icon: MapPin, label: "Servicio en Navarra, La Rioja y Aragón" },
  { icon: BadgeCheck, label: "Cumplimiento de normativa vigente" },
  { icon: Users, label: "Atención personalizada y experta" },
  { icon: Truck, label: "Distribución directa a empresas" },
  { icon: Award, label: "Larga trayectoria en el sector" },
]

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
              .tienda-hero-content { padding: 48px 24px 56px !important; }
              .hero-social-proof { flex-direction: column !important; gap: 16px !important; }
            }
          `}</style>

          <section style={{ position: "relative", minHeight: 560 }}>
            <Image
              src="/images/tienda/hero.jpg"
              alt="Productos de limpieza profesional"
              fill
              priority
              quality={85}
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
            />
            {/* Refuerzo de legibilidad detrás del texto */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse 75% 65% at 50% 38%, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.15) 60%, transparent 80%)",
            }} />

            <div className="tienda-hero-content" style={{
              position: "relative", zIndex: 1,
              padding: "128px 24px 100px",
              display: "flex", flexDirection: "column",
              alignItems: "center", textAlign: "center",
            }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.85)", marginBottom: 14,
              }}>
                Tienda profesional · Grupo Rubio
              </p>
              <h1 style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 800, color: "#FFFFFF",
                letterSpacing: "-2px", lineHeight: 1.06,
                marginBottom: 124,
              }}>
                Productos de limpieza profesional
              </h1>

              {/* ── PRUEBA SOCIAL: 3 apartados ── */}
              <div className="hero-social-proof" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 40, flexWrap: "wrap",
              }}>
                {/* 1. Avatares apilados + clientes felices */}
                <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                  <div style={{ display: "flex" }}>
                    {[
                      { img: "https://i.pravatar.cc/100?img=32", ring: "#2563EB" },
                      { img: "https://i.pravatar.cc/100?img=47", ring: "#F97316" },
                    ].map((item, i) => (
                      <div key={i} style={{
                        width: 36, height: 36, borderRadius: "50%",
                        border: `2.5px solid ${item.ring}`,
                        marginLeft: i === 0 ? 0 : -12,
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.30)",
                        flexShrink: 0,
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                  <span style={{
                    fontSize: 14, fontWeight: 700, color: "#FFFFFF",
                    textShadow: "0 1px 6px rgba(0,0,0,0.45)", whiteSpace: "nowrap",
                  }}>
                    +2.000 clientes felices
                  </span>
                </div>

                {/* 2. Satisfacción */}
                <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%",
                    background: "#16A34A",
                    border: "2px solid rgba(255,255,255,0.85)",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <ThumbsUp size={17} style={{ color: "#FFFFFF" }} strokeWidth={2} />
                  </div>
                  <span style={{
                    fontSize: 14, fontWeight: 700, color: "#FFFFFF",
                    textShadow: "0 1px 6px rgba(0,0,0,0.45)", whiteSpace: "nowrap",
                  }}>
                    Satisfacción garantizada
                  </span>
                </div>

                {/* 3. Calidad certificada */}
                <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%",
                    background: "#2563EB",
                    border: "2px solid rgba(255,255,255,0.85)",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <ShieldCheck size={17} style={{ color: "#FFFFFF" }} strokeWidth={2} />
                  </div>
                  <span style={{
                    fontSize: 14, fontWeight: 700, color: "#FFFFFF",
                    textShadow: "0 1px 6px rgba(0,0,0,0.45)", whiteSpace: "nowrap",
                  }}>
                    Calidad profesional certificada
                  </span>
                </div>
              </div>
            </div>

            {/* ── TRUST STRIP deslizante, fondo negro, encima del borde inferior del hero ── */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "#0B0F14",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
              zIndex: 2,
            }}>
              <style>{`
                @keyframes trustMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                .trust-marquee-track { animation: trustMarquee 32s linear infinite; }
              `}</style>
              <div className="trust-marquee-track" style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}>
                {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 9,
                      padding: "13px 32px",
                    }}>
                      <Icon size={14} style={{ color: "rgba(255,255,255,0.50)", flexShrink: 0 }} />
                      <span style={{
                        fontSize: 12.5, fontWeight: 600,
                        color: "rgba(255,255,255,0.85)", letterSpacing: "0.01em",
                      }}>
                        {item.label}
                      </span>
                    </div>
                  )
                })}
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
