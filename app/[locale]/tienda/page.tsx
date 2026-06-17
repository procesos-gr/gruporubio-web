import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { TiendaStorefront, type StoreProduct } from "@/components/tienda/TiendaStorefront"
import { medusa } from "@/lib/medusa"
import Image from "next/image"

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID!

export async function generateMetadata() {
  return {
    title: "Tienda profesional — Grupo Rubio",
    description: "Desengrasantes, desinfectantes, insecticidas y productos de higiene para empresas y comunidades.",
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
              .tienda-hero-overlay {
                background: linear-gradient(
                  to bottom,
                  rgba(255,255,255,0.85) 0%,
                  rgba(255,255,255,0.55) 65%,
                  rgba(255,255,255,0.10) 100%
                ) !important;
              }
            }
          `}</style>

          <section style={{ position: "relative", minHeight: 560 }}>
            <Image
              src="/images/tienda-hero.jpg"
              alt="Productos de limpieza profesional"
              fill
              priority
              quality={85}
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
            />
            {/* Overlay oscuro sutil para legibilidad del texto blanco */}
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.32)",
            }} />

            <div className="tienda-hero-content" style={{
              position: "relative", zIndex: 1,
              padding: "100px 24px 100px",
              display: "flex", flexDirection: "column",
              alignItems: "center", textAlign: "center",
            }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.80)", marginBottom: 14,
              }}>
                Tienda profesional · Grupo Rubio
              </p>
              <h1 style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 800, color: "#FFFFFF",
                letterSpacing: "-2px", lineHeight: 1.06,
              }}>
                Productos de limpieza profesional
              </h1>
            </div>
          </section>
        </div>

      </div>

      {/* ── STOREFRONT: trust bar + filtros + grid ── */}
      <TiendaStorefront products={products} locale={locale} />

      <Footer />
    </div>
  )
}
