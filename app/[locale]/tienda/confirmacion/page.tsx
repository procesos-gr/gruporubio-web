"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { ReviewForm } from "@/components/tienda/ReviewForm"
import { medusa } from "@/lib/medusa"
import { useCartStore } from "@/lib/store/cart"
import { analytics, centsToEur } from "@/lib/analytics"
import { CheckCircle, Star } from "lucide-react"
import Link from "next/link"

type OrderItem = { id: string; title: string; quantity: number; unit_price: number }
type Order = {
  id: string
  display_id: number
  email: string
  total: number
  currency_code: string
  items?: OrderItem[]
}

export default function ConfirmacionPage() {
  const { locale } = useParams<{ locale: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { cartId, clearCart } = useCartStore()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // purchase una sola vez por pedido (sessionStorage evita duplicados al recargar)
  useEffect(() => {
    if (!order) return
    const key = `ga4_purchase_${order.id}`
    if (sessionStorage.getItem(key)) return
    analytics.purchase(order.id, centsToEur(order.total), (order.items ?? []).map(i => ({
      item_id: i.id,
      item_name: i.title,
      price: centsToEur(i.unit_price),
      quantity: i.quantity,
    })))
    sessionStorage.setItem(key, "1")
  }, [order])
  const [openReviewFor, setOpenReviewFor] = useState<string | null>(null)
  const [reviewedItems, setReviewedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    const orderId = searchParams.get("order_id")
    const redirectStatus = searchParams.get("redirect_status")

    async function load() {
      try {
        if (orderId) {
          // Caso normal: pago confirmado sin redirect, ya tenemos el order_id
          const { order } = await medusa.store.order.retrieve(orderId)
          setOrder(order as unknown as Order)
          clearCart()
        } else if (redirectStatus === "succeeded" && cartId) {
          // Caso 3D Secure: Stripe redirigió de vuelta, completamos el carrito aquí
          const result = await medusa.store.cart.complete(cartId)
          if (result.type === "order" && result.order) {
            clearCart()
            setOrder(result.order as unknown as Order)
          } else {
            setError("No se pudo confirmar el pedido. Contacta con nosotros si se te ha realizado el cargo.")
          }
        } else if (redirectStatus && redirectStatus !== "succeeded") {
          setError("El pago no se ha completado.")
        } else {
          setError("not_found")
        }
      } catch {
        setError("No se pudo cargar el pedido.")
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatPrice = (amount: number, currency = "EUR") =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount / 100)

  if (loading) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <div style={{ background: "#F9FAFB", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#9CA3AF", fontSize: 15 }}>Confirmando tu pedido...</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Sin order_id ni redirect_status válido — página genérica (acceso directo a la URL)
  if (error === "not_found" || (!order && !error)) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <div style={{ background: "#F9FAFB", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: 560, padding: "80px 32px", textAlign: "center" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", background: "#DCFCE7", margin: "0 auto 28px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <CheckCircle size={36} color="#16a34a" />
            </div>
            <h1 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#111827", letterSpacing: "-1px", marginBottom: 16 }}>
              ¡Gracias por tu compra!
            </h1>
            <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.65, marginBottom: 32 }}>
              Hemos recibido tu pedido y te enviaremos la confirmación por email.
            </p>
            <Link href={`/${locale}/tienda`} style={{
              display: "inline-flex", alignItems: "center", padding: "13px 28px", borderRadius: 8,
              background: "#111827", color: "#FFFFFF", fontSize: 14, fontWeight: 700, textDecoration: "none",
            }}>
              Seguir comprando
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error && !order) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <div style={{ background: "#F9FAFB", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: 480, padding: "80px 32px", textAlign: "center" }}>
            <p style={{ fontSize: 16, color: "#DC2626", marginBottom: 24 }}>{error}</p>
            <button
              onClick={() => router.push(`/${locale}/tienda`)}
              style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: "#111827", color: "#FFF", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              Volver a la tienda
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div style={{ background: "#F9FAFB", minHeight: "70vh", padding: "120px 24px 80px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", background: "#DCFCE7", margin: "0 auto 24px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <CheckCircle size={36} color="#16a34a" />
            </div>
            <h1 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800, color: "#111827", letterSpacing: "-1px", marginBottom: 10 }}>
              ¡Gracias por tu compra!
            </h1>
            <p style={{ fontSize: 15, color: "#6B7280" }}>
              Pedido #{order!.display_id} — confirmación enviada a {order!.email}
            </p>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 8, border: "1px solid #E5E7EB", padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Tu pedido</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {(order!.items ?? []).map(item => (
                <div key={item.id} style={{ paddingBottom: 16, borderBottom: "1px solid #F3F4F6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                      {item.quantity}× {item.title}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                      {formatPrice(item.unit_price * item.quantity, order!.currency_code)}
                    </p>
                  </div>
                  {reviewedItems.has(item.id) ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#16A34A", fontWeight: 600 }}>
                      <Star size={13} style={{ fill: "#16A34A" }} /> Gracias por tu opinión
                    </span>
                  ) : (
                    <button
                      onClick={() => setOpenReviewFor(openReviewFor === item.id ? null : item.id)}
                      style={{
                        fontSize: 12.5, fontWeight: 600, color: "#2563EB",
                        background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit",
                      }}
                    >
                      {openReviewFor === item.id ? "Cancelar" : "Escribir opinión sobre este producto"}
                    </button>
                  )}
                  {openReviewFor === item.id && (
                    <ReviewForm
                      orderId={order!.id}
                      orderLineItemId={item.id}
                      productTitle={item.title}
                      onSubmitted={() => {
                        setReviewedItems(prev => new Set(prev).add(item.id))
                        setOpenReviewFor(null)
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#16a34a" }}>
                {formatPrice(order!.total, order!.currency_code)}
              </span>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href={`/${locale}/tienda`} style={{
              display: "inline-flex", alignItems: "center", padding: "13px 28px", borderRadius: 8,
              background: "#111827", color: "#FFFFFF", fontSize: 14, fontWeight: 700, textDecoration: "none",
            }}>
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
