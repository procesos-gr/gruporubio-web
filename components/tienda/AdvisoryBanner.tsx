"use client"

import Link from "next/link"
import { MessageCircle, ArrowRight } from "lucide-react"

export function AdvisoryBanner({ locale }: { locale: string }) {
  return (
    <section style={{ background: "#F8FAFC", padding: "0 32px 72px" }}>
      <div style={{
        maxWidth: 1160, margin: "0 auto",
        background: "#FFFFFF",
        border: "1.5px solid #E5E7EB",
        borderRadius: 8,
        padding: "28px 32px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 20,
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 8,
            background: "#111827",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <MessageCircle size={20} style={{ color: "#FFFFFF" }} strokeWidth={1.75} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
              ¿No sabes qué producto necesitas?
            </p>
            <p style={{ fontSize: 13, color: "#6B7280" }}>
              Nuestro asistente te ayuda a encontrar la solución adecuada para tu caso.
            </p>
          </div>
        </div>
        <Link
          href={`/${locale}/contacto`}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#111827", color: "#FFFFFF",
            padding: "11px 22px", borderRadius: 7,
            fontSize: 13.5, fontWeight: 700,
            textDecoration: "none", flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          Pedir asesoramiento
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  )
}
