"use client"

import { useState } from "react"
import Image from "next/image"
import * as Dialog from "@radix-ui/react-dialog"
import { X, ZoomIn } from "lucide-react"

type ProductImage = {
  id: string
  url: string
  alt: string | null
}

type Props = {
  images: ProductImage[]
  title: string
}

export function ProductGallery({ images, title }: Props) {
  const [selected, setSelected] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  if (images.length === 0) {
    return (
      <div style={{
        aspectRatio: "1 / 1",
        background: "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
        borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: 80, height: 80, background: "#D1D5DB", borderRadius: 8, opacity: 0.4 }} />
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setZoomOpen(true)}
        style={{
          position: "relative", aspectRatio: "1 / 1",
          borderRadius: 8, overflow: "hidden",
          background: "#F3F4F6", marginBottom: 12,
          border: "none", padding: 0, width: "100%", cursor: "zoom-in",
          display: "block",
        }}
      >
        <Image
          src={images[selected].url}
          alt={images[selected].alt ?? title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <span style={{
          position: "absolute", bottom: 10, right: 10,
          background: "rgba(17,24,39,0.75)", color: "#FFFFFF",
          borderRadius: 6, padding: "6px 10px",
          fontSize: 12, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <ZoomIn size={14} />
          Ampliar
        </span>
      </button>

      {images.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelected(i)}
              style={{
                width: 72, height: 72, borderRadius: 6, overflow: "hidden",
                border: i === selected ? "2px solid #111827" : "2px solid transparent",
                cursor: "pointer", padding: 0, background: "#F3F4F6",
                position: "relative", flexShrink: 0,
              }}
            >
              <Image src={img.url} alt={img.alt ?? title} fill style={{ objectFit: "cover" }} sizes="72px" />
            </button>
          ))}
        </div>
      )}

      {/* Modal de zoom */}
      <Dialog.Root open={zoomOpen} onOpenChange={setZoomOpen}>
        <Dialog.Portal>
          <Dialog.Overlay style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.85)", zIndex: 300,
          }} />
          <Dialog.Content style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(92vw, 900px)", height: "min(92vh, 900px)",
            zIndex: 301, outline: "none",
          }}>
            <Dialog.Title style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
              {title}
            </Dialog.Title>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src={images[selected].url}
                alt={images[selected].alt ?? title}
                fill
                style={{ objectFit: "contain" }}
                sizes="900px"
              />
            </div>
            <Dialog.Close asChild>
              <button
                style={{
                  position: "absolute", top: -44, right: 0,
                  background: "rgba(255,255,255,0.12)", border: "none",
                  borderRadius: 6, width: 36, height: 36,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#FFFFFF",
                }}
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
