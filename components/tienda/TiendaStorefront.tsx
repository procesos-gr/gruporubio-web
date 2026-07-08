"use client"

import { useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"

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

function getMinPrice(product: StoreProduct): number | null {
  const prices = (product.variants ?? [])
    .map(v => v.calculated_price?.calculated_amount ?? null)
    .filter((p): p is number => p !== null)
  return prices.length > 0 ? Math.min(...prices) : null
}

export function TiendaStorefront({ products, locale }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start", dragFree: true })
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const carouselBtnStyle: React.CSSProperties = {
    width: 32, height: 32, borderRadius: 6,
    border: "1.5px solid #E5E7EB", background: "#FFFFFF",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "#374151",
    transition: "border-color 0.15s, background 0.15s",
  }

  if (products.length === 0) return null

  return (
    <div style={{ background: "#FFFFFF" }}>
      {/* ── CAROUSEL: MÁS VENDIDOS ────────────────────── */}
      <div style={{ padding: "44px 0 56px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>
              Más vendidos
            </h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={scrollPrev} style={carouselBtnStyle}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={scrollNext} style={carouselBtnStyle}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div ref={emblaRef} style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 14 }}>
              {products.slice(0, 8).map(product => {
                const minPrice = getMinPrice(product)
                const catColor = product.collection?.title
                  ? (CATEGORY_COLORS[product.collection.title] ?? DEFAULT_COLOR)
                  : DEFAULT_COLOR
                return (
                  <div key={product.id} style={{ flex: "0 0 200px" }}>
                    <Link href={`/${locale}/tienda/${product.handle}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        borderRadius: 8, border: "1.5px solid #F3F4F6",
                        overflow: "hidden", background: "#FFFFFF",
                        transition: "border-color 0.15s, box-shadow 0.15s",
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = "#D1D5DB"
                          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = "#F3F4F6"
                          e.currentTarget.style.boxShadow = "none"
                        }}
                      >
                        <div style={{ position: "relative", aspectRatio: "1/1", background: "#F8FAFC" }}>
                          {product.thumbnail ? (
                            <Image src={product.thumbnail} alt={product.title}
                              fill sizes="200px" style={{ objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, opacity: 0.2 }}>🧴</div>
                          )}
                          {product.collection?.title && (
                            <div style={{
                              position: "absolute", top: 8, left: 8,
                              background: catColor.bg, color: catColor.text,
                              fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                              letterSpacing: "0.07em", padding: "2px 7px", borderRadius: 3,
                            }}>
                              {product.collection.title}
                            </div>
                          )}
                        </div>
                        <div style={{ padding: "10px 12px 14px" }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", lineHeight: 1.3, marginBottom: 6 }}>
                            {product.title}
                          </p>
                          {minPrice != null ? (
                            <p style={{ fontSize: 14, fontWeight: 800, color: "#111827", letterSpacing: "-0.3px" }}>
                              {new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(minPrice / 100)}
                            </p>
                          ) : (
                            <p style={{ fontSize: 12, color: "#9CA3AF" }}>Consultar</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
