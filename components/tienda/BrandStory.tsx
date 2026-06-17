"use client"

import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

const POINTS = [
  "Probado antes en nuestros propios servicios de limpieza y control de plagas",
  "Apto para uso intensivo y profesional, no solo doméstico",
  "Asesoramiento basado en experiencia real sobre el terreno",
]

export function BrandStory() {
  return (
    <section style={{ background: "#FFFFFF", padding: "72px 32px" }}>
      <style>{`
        .brand-story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }
        .puzzle-grid {
          position: relative;
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 10px;
          height: 420px;
          margin-bottom: 28px;
        }
        .puzzle-cell img { transition: transform 0.4s ease; }
        .puzzle-cell:hover img { transform: scale(1.08); }
        @media (max-width: 900px) {
          .brand-story-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .puzzle-grid { height: 320px !important; margin-bottom: 20px !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="brand-story-grid">

          {/* ── PUZZLE DE IMÁGENES ── */}
          <div className="puzzle-grid">
            <div className="puzzle-cell" style={{ gridRow: "1 / 3", position: "relative", borderRadius: 8, overflow: "hidden" }}>
              <Image
                src="/images/brand-story-large.png"
                alt="Productos de limpieza profesional Grupo Rubio"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 900px) 60vw, 360px"
              />
            </div>
            <div className="puzzle-cell" style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
              <Image
                src="/images/brand-story-small-2.jpg"
                alt="Bayetas y esponjas de limpieza"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 900px) 40vw, 220px"
              />
            </div>
            <div style={{ position: "relative", borderRadius: 8, overflow: "hidden" }} />

            {/* Imagen pequeña ampliada, sobrepuesta sobre las demás (incluida la de arriba) */}
            <div className="puzzle-cell" style={{
              position: "absolute",
              width: "56%", height: "62%",
              bottom: -32, right: "4%",
              borderRadius: 8, overflow: "hidden",
              border: "5px solid #FFFFFF",
              boxShadow: "0 16px 36px rgba(0,0,0,0.22)",
              zIndex: 2,
            }}>
              <Image
                src="/images/brand-story-small-1.jpg"
                alt="Producto de limpieza en uso"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 900px) 36vw, 220px"
              />
            </div>
          </div>

          {/* ── TEXTO ── */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#2563EB", marginBottom: 12,
            }}>
              Por qué confiar en nuestra selección
            </p>
            <h2 style={{
              fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 800,
              color: "#111827", letterSpacing: "-0.8px", lineHeight: 1.18,
              marginBottom: 18,
            }}>
              Vendemos lo que usamos en nuestro propio trabajo
            </h2>
            <p style={{ fontSize: 15.5, color: "#4B5563", lineHeight: 1.7, marginBottom: 28 }}>
              Cada producto de esta tienda pasa antes por nuestros propios equipos de limpieza
              y control de plagas. No vendemos nada que no usemos nosotros mismos en instalaciones
              reales, lo que nos permite garantizar resultados profesionales en cualquier sector.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {POINTS.map((point, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <CheckCircle2 size={18} style={{ color: "#16A34A", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.5 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
