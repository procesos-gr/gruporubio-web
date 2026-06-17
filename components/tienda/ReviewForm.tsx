"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { toast } from "sonner"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

type Props = {
  orderId: string
  orderLineItemId: string
  productTitle: string
  onSubmitted: () => void
}

export function ReviewForm({ orderId, orderLineItemId, productTitle, onSubmitted }: Props) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Selecciona una valoración de 1 a 5 estrellas")
      return
    }
    if (content.trim().length < 5) {
      toast.error("Escribe un comentario un poco más largo")
      return
    }
    setSubmitting(true)
    try {
      const token = localStorage.getItem("medusa_customer_token")
      const res = await fetch(`${MEDUSA_URL}/store/product-reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUBLISHABLE_KEY,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          reviews: [{
            order_id: orderId,
            order_line_item_id: orderLineItemId,
            rating,
            content: content.trim(),
            images: [],
          }],
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success("¡Gracias por tu opinión!", {
        description: "Se publicará en cuanto la revisemos.",
      })
      onSubmitted()
    } catch {
      toast.error("No se pudo enviar la opinión. Inténtalo de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      marginTop: 14, padding: "16px 18px", borderRadius: 8,
      background: "#F9FAFB", border: "1px solid #E5E7EB",
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 10 }}>
        Tu opinión sobre {productTitle}
      </p>

      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
            aria-label={`${i} estrellas`}
          >
            <Star
              size={22}
              style={{
                color: i <= (hoverRating || rating) ? "#F59E0B" : "#E5E7EB",
                fill: i <= (hoverRating || rating) ? "#F59E0B" : "#E5E7EB",
              }}
            />
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Cuéntanos qué te ha parecido el producto..."
        rows={3}
        style={{
          width: "100%", padding: "10px 12px", borderRadius: 6,
          border: "1.5px solid #E5E7EB", fontSize: 13.5,
          fontFamily: "inherit", resize: "vertical",
          marginBottom: 12, color: "#111827",
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          padding: "9px 18px", borderRadius: 6, border: "none",
          background: submitting ? "#D1D5DB" : "#111827", color: "#FFFFFF",
          fontSize: 13.5, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
          fontFamily: "inherit",
        }}
      >
        {submitting ? "Enviando..." : "Enviar opinión"}
      </button>
    </div>
  )
}
