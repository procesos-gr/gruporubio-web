"use client"

import { useState } from "react"
import Image from "next/image"

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
      <div style={{
        position: "relative", aspectRatio: "1 / 1",
        borderRadius: 8, overflow: "hidden",
        background: "#F3F4F6", marginBottom: 12,
      }}>
        <Image
          src={images[selected].url}
          alt={images[selected].alt ?? title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
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
    </div>
  )
}
