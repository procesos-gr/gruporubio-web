"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, Star } from "lucide-react"
import { QuickViewModal } from "./QuickViewModal"

type CategoryColor = { bg: string; text: string; dot: string }
type Variant = { id: string; title: string }
type Rating = { average: number; count: number }

type Props = {
  handle: string
  title: string
  description?: string | null
  thumbnail: string | null
  secondImage?: string | null
  minPrice: number | null
  formats?: string[]
  categoryLabel?: string | null
  categoryColor?: CategoryColor
  currency: string
  locale: string
  variants?: Variant[]
  rating?: Rating | null
}

const cardStyles = `
  .card-qv-btn { opacity: 0; transform: translateX(-50%) translateY(6px); }
  .card-wrap:hover .card-qv-btn { opacity: 1; transform: translateX(-50%) translateY(0); }
  .card-img-main { transition: opacity 0.35s ease; }
  .card-img-secondary { opacity: 0; transition: opacity 0.35s ease; }
  .card-wrap:hover .card-img-main { opacity: 0; }
  .card-wrap:hover .card-img-secondary { opacity: 1; }
  @media (max-width: 640px) {
    .card-qv-btn { display: none !important; }
  }
`

export function ProductCard({
  handle, title, thumbnail, secondImage,
  locale, variants = [], rating,
  description, minPrice, currency,
}: Props) {
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const formattedPrice = minPrice != null
    ? new Intl.NumberFormat(locale, { style: "currency", currency }).format(minPrice / 100)
    : null

  return (
    <>
      <style>{cardStyles}</style>

      <div className="card-wrap" style={{ position: "relative", height: "100%" }}>
        <Link href={`/${locale}/tienda/${handle}`} style={{ textDecoration: "none", display: "block" }}>
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 8,
              border: "1.5px solid #F3F4F6",
              overflow: "hidden",
              transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.borderColor = "#D1D5DB"
              el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)"
              el.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.borderColor = "#F3F4F6"
              el.style.boxShadow = "none"
              el.style.transform = "translateY(0)"
            }}
          >
            {/* Imagen, con swap a segunda imagen al hacer hover */}
            <div style={{ position: "relative", aspectRatio: "1 / 1", background: "#F8FAFC", overflow: "hidden" }}>
              {thumbnail ? (
                <Image
                  className="card-img-main"
                  src={thumbnail}
                  alt={title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
                }}>
                  <div style={{ fontSize: 40, opacity: 0.25 }}>🧴</div>
                </div>
              )}

              {secondImage && (
                <Image
                  className="card-img-secondary"
                  src={secondImage}
                  alt={title}
                  fill
                  style={{ objectFit: "cover", position: "absolute", inset: 0 }}
                  sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              )}

              {/* Rating, solo si el producto tiene reviews */}
              {rating && rating.count > 0 && (
                <div style={{
                  position: "absolute", top: 10, left: 10,
                  background: "#FFFFFF", borderRadius: 6,
                  padding: "3px 8px", display: "flex", alignItems: "center", gap: 4,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                }}>
                  <Star size={11} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#111827" }}>
                    {rating.average.toFixed(1)}
                  </span>
                </div>
              )}

              {/* Botón Vista rápida */}
              {variants.length > 0 && (
                <button
                  className="card-qv-btn"
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setQuickViewOpen(true) }}
                  style={{
                    position: "absolute", bottom: 10, left: "50%",
                    background: "rgba(17,24,39,0.88)",
                    backdropFilter: "blur(6px)",
                    color: "#FFFFFF",
                    border: "none", borderRadius: 6,
                    padding: "7px 14px", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", whiteSpace: "nowrap",
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "opacity 0.18s, transform 0.18s",
                    fontFamily: "inherit",
                  }}
                >
                  <Eye size={13} />
                  Vista rápida
                </button>
              )}
            </div>

            {/* Título + precio, para comparar de un vistazo en el grid */}
            <div style={{ padding: "10px 12px 12px" }}>
              <p style={{
                fontSize: 13, fontWeight: 600, color: "#111827",
                lineHeight: 1.35, letterSpacing: "-0.1px",
                overflow: "hidden", textOverflow: "ellipsis",
                display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical",
                marginBottom: 4,
              }}>
                {title}
              </p>
              {formattedPrice ? (
                <p style={{ fontSize: 14, fontWeight: 800, color: "#111827", letterSpacing: "-0.2px" }}>
                  {formattedPrice}
                </p>
              ) : (
                <p style={{ fontSize: 12, color: "#9CA3AF" }}>Consultar</p>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Quick View Modal — aquí se ve toda la info: precio, descripción, variantes */}
      <QuickViewModal
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        handle={handle}
        title={title}
        thumbnail={thumbnail}
        description={description}
        variants={variants}
        minPrice={minPrice}
        currency={currency}
        locale={locale}
      />
    </>
  )
}
