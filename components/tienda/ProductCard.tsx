"use client"

import Link from "next/link"
import Image from "next/image"

type CategoryColor = { bg: string; text: string; dot: string }

type Props = {
  handle: string
  title: string
  description?: string | null
  thumbnail: string | null
  minPrice: number | null
  formats?: string[]
  categoryLabel?: string | null
  categoryColor?: CategoryColor
  currency: string
  locale: string
}

const cardStyles = `
  .card-desc { display: block; }
  @media (max-width: 640px) {
    .card-desc { display: none !important; }
    .card-price { font-size: 17px !important; }
    .card-formats { gap: 4px !important; }
    .card-format-pill { font-size: 10px !important; padding: 2px 6px !important; }
    .card-content { padding: 10px 12px 14px !important; }
    .card-title { font-size: 13px !important; margin-bottom: 8px !important; }
    .card-cta { padding: 6px 10px !important; font-size: 11px !important; }
  }
`

export function ProductCard({
  handle, title, description, thumbnail,
  minPrice, formats = [], categoryLabel, categoryColor,
  currency, locale,
}: Props) {
  const formattedPrice = minPrice != null
    ? new Intl.NumberFormat(locale, { style: "currency", currency }).format(minPrice / 100)
    : null

  const shortDesc = description
    ? description.replace(/<[^>]*>/g, "").slice(0, 72).trim() + (description.length > 72 ? "…" : "")
    : null

  const color = categoryColor ?? { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" }

  return (
    <Link href={`/${locale}/tienda/${handle}`} style={{ textDecoration: "none", display: "block" }}>
      <style>{cardStyles}</style>
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 8,
          border: "1.5px solid #F3F4F6",
          overflow: "hidden",
          transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s",
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
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
        {/* Imagen */}
        <div style={{
          position: "relative",
          aspectRatio: "4 / 3",
          background: "#F8FAFC",
          overflow: "hidden",
        }}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
              sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)" }}
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

          {/* Badge de categoría */}
          {categoryLabel && (
            <div style={{
              position: "absolute", top: 10, left: 10,
              background: color.bg,
              color: color.text,
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              padding: "3px 9px",
              borderRadius: 4,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: color.dot, flexShrink: 0,
              }} />
              {categoryLabel}
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="card-content" style={{
          padding: "16px 18px 20px",
          display: "flex", flexDirection: "column", flex: 1,
        }}>
          <h3 className="card-title" style={{
            fontSize: 15, fontWeight: 700, color: "#111827",
            lineHeight: 1.35, marginBottom: 6,
            letterSpacing: "-0.2px",
          }}>
            {title}
          </h3>

          {shortDesc && (
            <p className="card-desc" style={{
              fontSize: 12.5, color: "#6B7280", lineHeight: 1.55,
              marginBottom: 12, flex: 1,
            }}>
              {shortDesc}
            </p>
          )}

          {/* Formatos disponibles */}
          {formats.length > 0 && (
            <div className="card-formats" style={{
              display: "flex", alignItems: "center", gap: 6,
              marginBottom: 14, flexWrap: "wrap",
            }}>
              {formats.slice(0, 4).map(fmt => (
                <span key={fmt} className="card-format-pill" style={{
                  fontSize: 11, fontWeight: 600, color: "#374151",
                  background: "#F3F4F6",
                  padding: "3px 8px", borderRadius: 4,
                  letterSpacing: "0.02em",
                }}>
                  {fmt}
                </span>
              ))}
              {formats.length > 4 && (
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>+{formats.length - 4}</span>
              )}
            </div>
          )}

          {/* Footer: precio + CTA */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: shortDesc || formats.length > 0 ? 0 : 8,
          }}>
            <div>
              {formattedPrice ? (
                <>
                  <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>Desde</span>
                  <p className="card-price" style={{
                    fontSize: 20, fontWeight: 800, color: "#111827",
                    letterSpacing: "-0.5px", lineHeight: 1,
                  }}>
                    {formattedPrice}
                  </p>
                </>
              ) : (
                <p style={{ fontSize: 13, color: "#9CA3AF" }}>Consultar precio</p>
              )}
            </div>
            <div className="card-cta" style={{
              background: "#111827", color: "#FFFFFF",
              padding: "8px 14px", borderRadius: 6,
              fontSize: 12, fontWeight: 700,
              letterSpacing: "0.02em",
              flexShrink: 0,
            }}>
              Ver →
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
