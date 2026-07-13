"use client"

import Link from "next/link"
import {
  SprayCan, FlaskConical, Bug, HandHeart, Wrench, HardHat,
  Scroll, Trash2, UtensilsCrossed, Package,
  type LucideIcon,
} from "lucide-react"

export type Collection = { name: string; handle: string; count: number }

// Icono por handle de categoría raíz (las de Medusa, migradas del ERP).
// Si aparece una categoría nueva sin icono asignado, cae en Package.
const ICONS: Record<string, LucideIcon> = {
  "productos-quimicos": FlaskConical,
  "utiles-de-limpieza": SprayCan,
  "celulosa": Scroll,
  "control-de-plagas": Bug,
  "epis-y-equipos-de-proteccion": HardHat,
  "guantes-y-productos-desechables": HandHeart,
  "bolsas-de-basura-contenedores-y-papeleras": Trash2,
  "industria-alimentaria-y-detectable": UtensilsCrossed,
  "maquinaria": Wrench,
}

const CONECTORES = new Set(["de", "del", "y", "e", "la", "el", "los", "las", "para", "con", "en", "a"])

// Las categorías raíz vienen EN MAYÚSCULAS del ERP ("BOLSAS DE BASURA").
// Solo entonces las suavizamos; las que ya traen minúsculas se dejan tal cual.
function nombreBonito(nombre: string): string {
  const esTodoMayus = nombre === nombre.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(nombre)
  if (!esTodoMayus) return nombre

  // Sentence case: solo la primera palabra en mayúscula inicial; el resto en
  // minúscula, salvo acrónimos cortos (EPIS, DDD), que se conservan tal cual.
  return nombre
    .split(/\s+/)
    .map((palabra, i) => {
      const min = palabra.toLowerCase()
      if (palabra.length <= 4 && !CONECTORES.has(min)) return palabra
      if (i === 0) return min.charAt(0).toUpperCase() + min.slice(1)
      return min
    })
    .join(" ")
}

export function CollectionShowcase({
  locale,
  collections,
}: {
  locale: string
  collections: Collection[]
}) {
  if (!collections.length) return null

  return (
    <section style={{ background: "#FFFFFF", padding: "32px 32px 64px" }}>
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
          {collections.map((item) => {
            const Icon = ICONS[item.handle] ?? Package
            return (
              <Link
                key={item.handle}
                href={`/${locale}/tienda/categoria/${item.handle}`}
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
                    {nombreBonito(item.name)}
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
