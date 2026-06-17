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
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* ── HERO — mismo concepto que el inicio ─────────── */}
      <div style={{ padding: "24px 24px 0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <section style={{ position: "relative", borderRadius: 16, overflow: "hidden", minHeight: 420 }}>
          {/* Imagen de fondo */}
          <Image
            src="/images/tienda-hero.jpg"
            alt="Productos de limpieza profesional"
            fill
            priority
            quality={85}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          {/* Overlay — más imagen visible, texto anclado a la izquierda */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.70) 38%, rgba(255,255,255,0.15) 65%, rgba(255,255,255,0) 100%)",
          }} />

          {/* Contenido */}
          <div style={{
            position: "relative", zIndex: 1,
            padding: "80px 56px 72px",
            maxWidth: 620,
          }}>
            <p style={{
              fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#2563EB", marginBottom: 16,
            }}>
              Tienda profesional · Grupo Rubio
            </p>
            <h1 style={{
              fontSize: "clamp(32px, 4vw, 54px)",
              fontWeight: 800, color: "#111827",
              letterSpacing: "-2px", lineHeight: 1.08,
              marginBottom: 18,
            }}>
              Todo lo que necesitas<br />para una higiene impecable.
            </h1>
            <p style={{
              fontSize: 17, fontWeight: 600, color: "#374151",
              lineHeight: 1.6, maxWidth: 440,
            }}>
              Desengrasantes, desinfectantes, insecticidas y productos de higiene
              para empresas, hostelería y comunidades de vecinos.
            </p>
          </div>
        </section>
      </div>

      {/* ── STOREFRONT (client: trust bar + filtros + grid) ── */}
      <TiendaStorefront products={products} locale={locale} />

      <Footer />
    </div>
  )
}
