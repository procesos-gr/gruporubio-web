"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "./ProductCard"
import { SlidersHorizontal, ChevronDown, Package, MessageCircle } from "lucide-react"
import Link from "next/link"

type Variant = {
  id: string
  title?: string | null
  calculated_price?: { calculated_amount?: number | null } | null
}

type Collection = {
  id: string
  title: string
  handle: string
}

export type StoreProduct = {
  id: string
  handle: string
  title: string
  description?: string | null
  thumbnail: string | null
  variants?: Variant[]
  collection?: Collection | null
}

type Props = {
  products: StoreProduct[]
  locale: string
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "Limpieza Industrial":      { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  "Desinfección y Higiene":   { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  "Control de Plagas":        { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  "Higiene Personal":         { bg: "#F5F3FF", text: "#6D28D9", dot: "#8B5CF6" },
}
const DEFAULT_COLOR = { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" }

type SortKey = "default" | "price_asc" | "price_desc" | "name_asc"
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default",    label: "Más populares" },
  { value: "price_asc",  label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "name_asc",   label: "Nombre A–Z" },
]

function getMinPrice(product: StoreProduct): number | null {
  const prices = (product.variants ?? [])
    .map(v => v.calculated_price?.calculated_amount ?? null)
    .filter((p): p is number => p !== null)
  return prices.length > 0 ? Math.min(...prices) : null
}

function getFormats(product: StoreProduct): string[] {
  return (product.variants ?? [])
    .map(v => v.title)
    .filter((t): t is string => !!t && t.toLowerCase() !== "default")
}

export function TiendaStorefront({ products, locale }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [sort, setSort] = useState<SortKey>("default")
  const [sortOpen, setSortOpen] = useState(false)

  // Colecciones únicas
  const categories = useMemo(() => {
    const map = new Map<string, string>()
    products.forEach(p => {
      if (p.collection?.title) map.set(p.collection.title, p.collection.title)
    })
    return Array.from(map.keys())
  }, [products])

  // Filtrado + ordenación
  const filtered = useMemo(() => {
    let list = products
    if (activeCategory !== "all") {
      list = list.filter(p => p.collection?.title === activeCategory)
    }
    switch (sort) {
      case "price_asc":
        list = [...list].sort((a, b) => (getMinPrice(a) ?? 99999) - (getMinPrice(b) ?? 99999))
        break
      case "price_desc":
        list = [...list].sort((a, b) => (getMinPrice(b) ?? 0) - (getMinPrice(a) ?? 0))
        break
      case "name_asc":
        list = [...list].sort((a, b) => a.title.localeCompare(b.title))
        break
    }
    return list
  }, [products, activeCategory, sort])

  const currentSort = SORT_OPTIONS.find(o => o.value === sort)!

  return (
    <div style={{ background: "#F8FAFC" }}>
      <style>{`
        .store-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)) !important; }
        @media (max-width: 640px) {
          .store-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .store-outer-pad { padding: 20px 16px 60px !important; }
          .b2b-banner { flex-direction: column !important; padding: 28px 24px !important; }
          .filterbar-inner { padding: 10px 0 !important; }
        }
        @media (max-width: 480px) {
          .store-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        }
      `}</style>

      {/* ── FILTER BAR ────────────────────────────────── */}
      <div style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        position: "sticky", top: 72, zIndex: 20,
        padding: "0 32px",
      }}>
        <div className="filterbar-inner" style={{
          maxWidth: 1160, margin: "0 auto",
          display: "flex", alignItems: "center", gap: 8,
          padding: "12px 0", overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          <SlidersHorizontal size={16} style={{ color: "#6B7280", flexShrink: 0 }} />

          {/* Pills de categoría */}
          {["all", ...categories].map(cat => {
            const isActive = activeCategory === cat
            const color = cat === "all" ? null : (CATEGORY_COLORS[cat] ?? DEFAULT_COLOR)
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0,
                  padding: "7px 16px",
                  borderRadius: 6,
                  border: isActive
                    ? "1.5px solid #111827"
                    : "1.5px solid #E5E7EB",
                  background: isActive ? "#111827" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#374151",
                  fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "all 0.14s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {color && !isActive && (
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: color.dot, flexShrink: 0,
                  }} />
                )}
                {cat === "all" ? "Todos los productos" : cat}
              </button>
            )
          })}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Sort dropdown */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setSortOpen(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 6,
                border: "1.5px solid #E5E7EB",
                background: "#FFFFFF", cursor: "pointer",
                fontSize: 13, fontWeight: 600, color: "#374151",
                whiteSpace: "nowrap",
              }}
            >
              {currentSort.label}
              <ChevronDown size={14} />
            </button>
            {sortOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0,
                background: "#FFFFFF", border: "1px solid #E5E7EB",
                borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                minWidth: 200, zIndex: 50, overflow: "hidden",
              }}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false) }}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "11px 16px", border: "none", cursor: "pointer",
                      fontSize: 13, fontWeight: sort === opt.value ? 700 : 500,
                      background: sort === opt.value ? "#F8FAFC" : "#FFFFFF",
                      color: sort === opt.value ? "#111827" : "#374151",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── GRID PRINCIPAL ────────────────────────────── */}
      <div className="store-outer-pad" style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Contador de resultados */}
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 28, fontWeight: 500 }}>
          {filtered.length === 0
            ? "Sin resultados"
            : `${filtered.length} producto${filtered.length !== 1 ? "s" : ""}${activeCategory !== "all" ? ` en ${activeCategory}` : ""}`
          }
        </p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 32px" }}>
            <Package size={48} style={{ color: "#D1D5DB", margin: "0 auto 16px" }} />
            <p style={{ fontSize: 16, color: "#6B7280" }}>No hay productos en esta categoría.</p>
            <button
              onClick={() => setActiveCategory("all")}
              style={{
                marginTop: 16, padding: "10px 20px", borderRadius: 6,
                border: "1.5px solid #111827", background: "transparent",
                color: "#111827", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}
            >
              Ver todos
            </button>
          </div>
        ) : (
          <>
            <div className="store-grid" style={{
              display: "grid",
              gap: 20,
            }}>
              {filtered.map((product, idx) => {
                const minPrice = getMinPrice(product)
                const formats = getFormats(product)
                const catColor = product.collection?.title
                  ? (CATEGORY_COLORS[product.collection.title] ?? DEFAULT_COLOR)
                  : DEFAULT_COLOR

                return (
                  <div key={product.id}>
                    <ProductCard
                      handle={product.handle}
                      title={product.title}
                      description={product.description}
                      thumbnail={product.thumbnail}
                      minPrice={minPrice}
                      formats={formats}
                      categoryLabel={product.collection?.title ?? null}
                      categoryColor={catColor}
                      currency="EUR"
                      locale={locale}
                    />
                    {/* Banner B2B después del 5º producto */}
                    {idx === 4 && (
                      <div style={{ display: "none" }} id="b2b-placeholder" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* ── BANNER B2B ─────────────────────────────── */}
            {filtered.length >= 3 && (
              <div className="b2b-banner" style={{
                marginTop: 56,
                background: "#111827",
                borderRadius: 8,
                padding: "40px 48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
                flexWrap: "wrap",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "radial-gradient(ellipse 60% 80% at 90% 50%, rgba(37,99,235,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                    color: "#3B82F6", textTransform: "uppercase", marginBottom: 8,
                  }}>
                    Para empresas
                  </p>
                  <h3 style={{
                    fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 800,
                    color: "#F9FAFB", letterSpacing: "-0.5px", lineHeight: 1.2,
                    marginBottom: 10,
                  }}>
                    ¿Necesitas grandes cantidades<br />o una solución a medida?
                  </h3>
                  <p style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 1.6 }}>
                    Trabajamos con comunidades de vecinos, hoteles, hospitales y empresas industriales.<br />
                    Pídenos presupuesto sin compromiso.
                  </p>
                </div>
                <div style={{
                  position: "relative",
                  display: "flex", flexDirection: "column", gap: 12, flexShrink: 0,
                }}>
                  <Link href={`/${locale}/contacto`} style={{ textDecoration: "none" }}>
                    <div style={{
                      background: "#2563EB", color: "#FFFFFF",
                      padding: "14px 28px", borderRadius: 7,
                      fontSize: 15, fontWeight: 700, textAlign: "center",
                      cursor: "pointer",
                    }}>
                      Solicitar presupuesto
                    </div>
                  </Link>
                  <a href="tel:948825025" style={{ textDecoration: "none" }}>
                    <div style={{
                      border: "1.5px solid rgba(255,255,255,0.15)",
                      color: "#D1D5DB",
                      padding: "12px 28px", borderRadius: 7,
                      fontSize: 14, fontWeight: 600, textAlign: "center",
                      cursor: "pointer",
                    }}>
                      📞 948 82 50 25
                    </div>
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── CTA CHATBOT ───────────────────────────────── */}
      <div style={{
        background: "#FFFFFF",
        borderTop: "1px solid #F3F4F6",
        padding: "32px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <MessageCircle size={28} style={{ color: "#2563EB", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
            ¿No encuentras lo que buscas?
          </p>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
            Ignacio, nuestro asistente virtual, puede ayudarte a encontrar el producto adecuado para tu negocio.
          </p>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>
            Pulsa el botón de chat en la esquina inferior derecha o{" "}
            <Link href={`/${locale}/contacto`} style={{ color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>
              escríbenos directamente
            </Link>
            .
          </p>
        </div>
      </div>

    </div>
  )
}
