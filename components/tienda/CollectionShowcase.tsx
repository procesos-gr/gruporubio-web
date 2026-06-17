"use client"

import Link from "next/link"
import {
  SprayCan, Droplets, Bug, HandHeart,
  Wrench, HardHat, Scroll, Wind,
} from "lucide-react"

const COLLECTIONS = [
  { icon: SprayCan, label: "Limpieza Industrial", handle: "limpieza-profesional" },
  { icon: Droplets, label: "Desinfección e Higiene", handle: "desinfección" },
  { icon: Bug, label: "Control de Plagas", handle: "control-de-plagas" },
  { icon: HandHeart, label: "Higiene Personal", handle: "higiene-industrial" },
  { icon: Wrench, label: "Maquinaria y Equipos", handle: null },
  { icon: HardHat, label: "EPIs y Protección", handle: null },
  { icon: Scroll, label: "Papel y Celulosa", handle: null },
  { icon: Wind, label: "Ambientadores", handle: null },
]

export function CollectionShowcase({ locale }: { locale: string }) {
  return (
    <section style={{ background: "#FFFFFF", padding: "72px 32px 64px" }}>
      <style>{`
        .collection-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 900px) {
          .collection-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 10px !important; }
          .collection-card { padding: 18px 10px !important; }
          .collection-icon-wrap { width: 44px !important; height: 44px !important; }
          .collection-label { font-size: 11.5px !important; }
        }
        @media (max-width: 480px) {
          .collection-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 800,
          color: "#111827", letterSpacing: "-0.8px",
          marginBottom: 40,
        }}>
          Nuestra colección
        </h2>

        <div className="collection-grid" style={{ display: "grid", gap: 16 }}>
          {COLLECTIONS.map((item, i) => {
            const Icon = item.icon
            return (
              <Link
                key={i}
                href={item.handle ? `/${locale}/tienda/categoria/${item.handle}` : `/${locale}/tienda`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="collection-card"
                  style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", textAlign: "center",
                    gap: 12, padding: "26px 16px",
                    borderRadius: 8, border: "1.5px solid #F3F4F6",
                    background: "#FAFAFA",
                    transition: "border-color 0.18s, background 0.18s, transform 0.18s",
                    cursor: "pointer", height: "100%",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#111827"
                    e.currentTarget.style.background = "#FFFFFF"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#F3F4F6"
                    e.currentTarget.style.background = "#FAFAFA"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  <div className="collection-icon-wrap" style={{
                    width: 52, height: 52, borderRadius: 8,
                    background: "#111827",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={22} style={{ color: "#FFFFFF" }} strokeWidth={1.75} />
                  </div>
                  <span className="collection-label" style={{
                    fontSize: 13, fontWeight: 700, color: "#111827",
                    letterSpacing: "-0.1px", lineHeight: 1.3,
                  }}>
                    {item.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
