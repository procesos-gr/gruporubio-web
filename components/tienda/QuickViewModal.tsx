"use client"

import * as Dialog from "@radix-ui/react-dialog"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { AddToCartButton } from "./AddToCartButton"

type Variant = { id: string; title: string }

type Props = {
  open: boolean
  onClose: () => void
  handle: string
  title: string
  thumbnail: string | null
  description?: string | null
  variants: Variant[]
  minPrice: number | null
  currency: string
  locale: string
}

export function QuickViewModal({
  open, onClose, handle, title, thumbnail,
  description, variants, minPrice, currency, locale,
}: Props) {
  const formattedPrice = minPrice != null
    ? new Intl.NumberFormat(locale, { style: "currency", currency }).format(minPrice / 100)
    : null

  const cleanDesc = description ? description.replace(/<[^>]*>/g, "").slice(0, 200).trim() : null

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.50)",
            zIndex: 200,
            animation: "fadeIn 0.18s ease",
          }}
        />
        <Dialog.Content
          style={{
            position: "fixed",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(92vw, 860px)",
            maxHeight: "90vh",
            background: "#FFFFFF",
            borderRadius: 12,
            overflow: "hidden",
            zIndex: 201,
            display: "flex",
            flexDirection: "row",
            animation: "slideUp 0.22s ease",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
            @media (max-width: 640px) {
              .qv-image { display: none !important; }
              .qv-body { padding: 28px 24px 32px !important; }
            }
          `}</style>

          {/* Imagen */}
          <div className="qv-image" style={{
            position: "relative",
            width: "42%", flexShrink: 0,
            background: "#F8FAFC",
          }}>
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={title}
                fill
                style={{ objectFit: "cover" }}
                sizes="400px"
              />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
                fontSize: 64, opacity: 0.18,
              }}>🧴</div>
            )}
          </div>

          {/* Contenido */}
          <div className="qv-body" style={{
            flex: 1, overflowY: "auto",
            padding: "36px 32px 40px",
            display: "flex", flexDirection: "column", gap: 20,
          }}>
            {/* Cerrar */}
            <Dialog.Close asChild>
              <button
                style={{
                  position: "absolute", top: 14, right: 14,
                  background: "#F3F4F6", border: "none",
                  borderRadius: 6, width: 32, height: 32,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#6B7280",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#E5E7EB" }}
                onMouseLeave={e => { e.currentTarget.style.background = "#F3F4F6" }}
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </Dialog.Close>

            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 8 }}>
                Grupo Rubio · Tienda profesional
              </p>
              <Dialog.Title style={{ fontSize: 22, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", lineHeight: 1.2, margin: 0 }}>
                {title}
              </Dialog.Title>
            </div>

            {formattedPrice && (
              <div>
                <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>Desde</span>
                <p style={{ fontSize: 28, fontWeight: 800, color: "#111827", letterSpacing: "-1px", lineHeight: 1, marginTop: 2 }}>
                  {formattedPrice}
                </p>
              </div>
            )}

            {cleanDesc && (
              <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.65 }}>{cleanDesc}</p>
            )}

            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 20 }}>
              <AddToCartButton
                variants={variants}
                productTitle={title}
                labelAdd="Añadir al carrito"
                labelAdding="Añadiendo..."
                labelSelect="Selecciona formato"
              />
            </div>

            <Link
              href={`/${locale}/tienda/${handle}`}
              onClick={onClose}
              style={{
                display: "block", textAlign: "center",
                fontSize: 13, fontWeight: 600, color: "#6B7280",
                textDecoration: "none",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#111827" }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#6B7280" }}
            >
              Ver página completa del producto →
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
