"use client"

import Link from "next/link"
import Image from "next/image"

type Props = {
  handle: string
  title: string
  thumbnail: string | null
  minPrice: number | null
  currency: string
  locale: string
}

export function ProductCard({ handle, title, thumbnail, minPrice, currency, locale }: Props) {
  const formattedPrice = minPrice
    ? new Intl.NumberFormat(locale, { style: "currency", currency }).format(minPrice / 100)
    : null

  return (
    <Link href={`/${locale}/tienda/${handle}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.transform = "translateY(-3px)"
          el.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)"
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.transform = "translateY(0)"
          el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)"
        }}
      >
        <div style={{ position: "relative", aspectRatio: "1 / 1", background: "#F3F4F6" }}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
            }}>
              <div style={{ width: 64, height: 64, background: "#D1D5DB", borderRadius: 8, opacity: 0.5 }} />
            </div>
          )}
        </div>
        <div style={{ padding: "16px 18px 20px" }}>
          <p style={{
            fontSize: 12, fontWeight: 600, color: "#9CA3AF",
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6,
          }}>
            Grupo Rubio
          </p>
          <h3 style={{
            fontSize: 16, fontWeight: 700, color: "#111827",
            lineHeight: 1.3, marginBottom: 12, letterSpacing: "-0.2px",
          }}>
            {title}
          </h3>
          {formattedPrice && (
            <p style={{ fontSize: 18, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.5px" }}>
              {formattedPrice}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
