import { Star, MessageSquare } from "lucide-react"

export type Review = {
  id: string
  author: string
  rating: number
  text: string
  date: string
}

type Props = {
  rating: { average: number; count: number } | null
  reviews: Review[]
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          style={{
            color: i <= Math.round(value) ? "#F59E0B" : "#E5E7EB",
            fill: i <= Math.round(value) ? "#F59E0B" : "#E5E7EB",
          }}
        />
      ))}
    </div>
  )
}

export function ProductReviews({ rating, reviews }: Props) {
  const hasReviews = !!rating && rating.count > 0

  return (
    <div style={{ background: "#FFFFFF", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>
            Opiniones de clientes
          </h2>
          {hasReviews && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Stars value={rating!.average} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                {rating!.average.toFixed(1)}
              </span>
              <span style={{ fontSize: 13, color: "#6B7280" }}>
                ({rating!.count} opinión{rating!.count !== 1 ? "es" : ""})
              </span>
            </div>
          )}
        </div>

        {hasReviews ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {reviews.map(review => (
              <div key={review.id} style={{
                border: "1px solid #F3F4F6", borderRadius: 8, padding: "20px 22px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{review.author}</span>
                    <Stars value={review.rating} size={12} />
                  </div>
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>{review.date}</span>
                </div>
                <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.65 }}>{review.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            background: "#F9FAFB", borderRadius: 8, border: "1px solid #F3F4F6",
          }}>
            <MessageSquare size={28} style={{ color: "#D1D5DB", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
              Todavía no hay opiniones de este producto
            </p>
            <p style={{ fontSize: 13, color: "#9CA3AF" }}>
              Sé el primero en compartir tu experiencia.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
