import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { ProductCard } from "@/components/tienda/ProductCard"
import { AdvisoryBanner } from "@/components/tienda/AdvisoryBanner"
import { medusa } from "@/lib/medusa"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ChevronRight, Package, SprayCan, Droplets, Bug, HandHeart,
  Wrench, HardHat, Scroll, Wind,
} from "lucide-react"

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID!

type CategoryChild = { id: string; name: string; handle: string }
type Category = {
  id: string
  name: string
  handle: string
  description?: string | null
  category_children?: CategoryChild[]
}

type Variant = {
  id: string
  title?: string | null
  calculated_price?: { calculated_amount?: number | null } | null
}
type Collection = { id: string; title: string; handle: string }
type Product = {
  id: string
  handle: string
  title: string
  description?: string | null
  thumbnail: string | null
  variants?: Variant[]
  collection?: Collection | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CATEGORY_ICONS: Record<string, any> = {
  "limpieza-profesional": SprayCan,
  "desinfección": Droplets,
  "control-de-plagas": Bug,
  "higiene-industrial": HandHeart,
  "maquinaria-y-equipos": Wrench,
  "epis-y-proteccion": HardHat,
  "papel-y-celulosa": Scroll,
  "ambientadores": Wind,
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "Limpieza Profesional":   { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  "Desinfección":           { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  "Control de Plagas":      { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  "Higiene Industrial":     { bg: "#F5F3FF", text: "#6D28D9", dot: "#8B5CF6" },
}
const DEFAULT_COLOR = { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" }

function getMinPrice(product: Product): number | null {
  const prices = (product.variants ?? [])
    .map(v => v.calculated_price?.calculated_amount ?? null)
    .filter((p): p is number => p !== null)
  return prices.length > 0 ? Math.min(...prices) : null
}

function getFormats(product: Product): string[] {
  return (product.variants ?? [])
    .map(v => v.title)
    .filter((t): t is string => !!t && t.toLowerCase() !== "default")
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle: rawHandle } = await params
  const handle = decodeURIComponent(rawHandle)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await medusa.store.category.list({ handle: [handle] } as any).catch(() => null)
  const category = result?.product_categories?.[0]
  return {
    title: category ? `${category.name} — Grupo Rubio` : "Categoría — Grupo Rubio",
    description: category?.description || "Productos profesionales de limpieza e higiene Grupo Rubio.",
  }
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { locale, handle: rawHandle } = await params
  const handle = decodeURIComponent(rawHandle)

  let category: Category | null = null
  try {
    const result = await medusa.store.category.list({
      handle: [handle],
      fields: "+category_children,+parent_category",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    category = (result.product_categories?.[0] ?? null) as Category | null
  } catch {
    category = null
  }

  if (!category) notFound()

  let products: Product[] = []
  try {
    const result = await medusa.store.product.list({
      category_id: [category.id],
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

  const Icon = CATEGORY_ICONS[category.handle] ?? Package
  const children = category.category_children ?? []

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#FFFFFF", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ paddingTop: 84 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "24px 32px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280" }}>
            <Link href={`/${locale}`} style={{ color: "#9CA3AF", textDecoration: "none" }}>Inicio</Link>
            <ChevronRight size={12} />
            <Link href={`/${locale}/tienda`} style={{ color: "#9CA3AF", textDecoration: "none" }}>Tienda</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#111827", fontWeight: 600 }}>{category.name}</span>
          </div>
        </div>

        {/* ── HEADER DE CATEGORÍA ── */}
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "28px 32px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: category.description ? 14 : 0 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 8,
              background: "#111827",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon size={24} style={{ color: "#FFFFFF" }} strokeWidth={1.75} />
            </div>
            <div>
              <h1 style={{
                fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800,
                color: "#111827", letterSpacing: "-0.8px", lineHeight: 1.15,
              }}>
                {category.name}
              </h1>
              <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>
                {products.length} producto{products.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {category.description && (
            <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.65, maxWidth: 640 }}>
              {category.description}
            </p>
          )}
        </div>

        {/* ── SUBCATEGORÍAS, si existen ── */}
        {children.length > 0 && (
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px 36px" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {children.map(child => (
                <Link
                  key={child.id}
                  href={`/${locale}/tienda/categoria/${child.handle}`}
                  style={{
                    padding: "9px 18px", borderRadius: 6,
                    border: "1.5px solid #E5E7EB", background: "#FFFFFF",
                    color: "#374151", fontSize: 13.5, fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── GRID DE PRODUCTOS ── */}
      <div style={{ background: "#F8FAFC", borderTop: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 32px 80px" }}>
          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 32px" }}>
              <Package size={48} style={{ color: "#D1D5DB", margin: "0 auto 16px" }} />
              <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 16 }}>
                Todavía no hay productos publicados en esta categoría.
              </p>
              <Link href={`/${locale}/tienda`} style={{
                display: "inline-block", padding: "10px 20px", borderRadius: 6,
                border: "1.5px solid #111827", color: "#111827",
                fontSize: 14, fontWeight: 600, textDecoration: "none",
              }}>
                Ver toda la tienda
              </Link>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}>
              {products.map(product => {
                const minPrice = getMinPrice(product)
                const formats = getFormats(product)
                const catColor = CATEGORY_COLORS[category!.name] ?? DEFAULT_COLOR
                const variants = (product.variants ?? [])
                  .filter(v => v.id && v.title)
                  .map(v => ({ id: v.id, title: v.title! }))

                return (
                  <ProductCard
                    key={product.id}
                    handle={product.handle}
                    title={product.title}
                    description={product.description}
                    thumbnail={product.thumbnail}
                    minPrice={minPrice}
                    formats={formats}
                    categoryLabel={category!.name}
                    categoryColor={catColor}
                    currency="EUR"
                    locale={locale}
                    variants={variants}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      <AdvisoryBanner locale={locale} />

      <Footer />
    </div>
  )
}
