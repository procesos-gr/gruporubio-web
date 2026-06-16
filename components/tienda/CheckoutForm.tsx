"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { useCartStore } from "@/lib/store/cart"

type Props = {
  locale: string
  isFree?: boolean
  labels: {
    name: string
    email: string
    address: string
    city: string
    postal: string
    pay: string
    processing: string
    testCard: string
  }
}

export function CheckoutForm({ labels, locale, isFree = false }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { clearCart, cartId, total } = useCartStore()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postal, setPostal] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe")

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    fontSize: 14,
    color: "#111827",
    background: "#FFFFFF",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 16,
  }

  const handleFreeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setErrorMessage(null)
    // Pedido gratuito — completar sin pasarela de pago
    await new Promise(r => setTimeout(r, 600))
    clearCart()
    router.push(`/${locale}/tienda/confirmacion`)
    setIsProcessing(false)
  }

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setIsProcessing(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/tienda/confirmacion`,
        payment_method_data: {
          billing_details: {
            name,
            email,
            address: { line1: address, city, postal_code: postal, country: "ES" },
          },
        },
      },
    })

    if (error) {
      setErrorMessage(error.message ?? "Error al procesar el pago")
      setIsProcessing(false)
    } else {
      clearCart()
    }
  }

  const handlePayPalCreateOrder = async () => {
    // En sandbox, PayPal necesita un orderId propio. Para dev devolvemos un ID temporal.
    try {
      await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, amount: total }),
      })
    } catch {
      // ignorar error de conexión con Medusa en dev
    }
    return `paypal-order-${Date.now()}`
  }

  const handlePayPalApprove = async () => {
    setIsProcessing(true)
    setErrorMessage(null)
    try {
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || data.error) {
        setErrorMessage(data.error ?? "Error al completar el pedido con PayPal")
      } else {
        clearCart()
        router.push(`/${locale}/tienda/confirmacion`)
      }
    } catch {
      setErrorMessage("Error de conexión al procesar el pago con PayPal")
    } finally {
      setIsProcessing(false)
    }
  }

  const methodBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "10px 16px",
    borderRadius: 8,
    border: `2px solid ${active ? "#2563EB" : "#E5E7EB"}`,
    background: active ? "#EFF6FF" : "#FFFFFF",
    color: active ? "#1D4ED8" : "#374151",
    fontSize: 14,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  })

  return (
    <form onSubmit={isFree ? handleFreeSubmit : paymentMethod === "stripe" ? handleStripeSubmit : (e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Contact */}
      <div>
        <p style={sectionTitle}>Información de contacto</p>
        <div>
          <label style={labelStyle}>{labels.email}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="tu@email.com"
          />
        </div>
      </div>

      {/* Shipping */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={sectionTitle}>Dirección de envío</p>
        <div>
          <label style={labelStyle}>{labels.name}</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            placeholder="Nombre Apellidos"
          />
        </div>
        <div>
          <label style={labelStyle}>{labels.address}</label>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={inputStyle}
            placeholder="Calle, número, piso"
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>{labels.city}</label>
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={inputStyle}
              placeholder="Ciudad"
            />
          </div>
          <div>
            <label style={labelStyle}>{labels.postal}</label>
            <input
              required
              value={postal}
              onChange={(e) => setPostal(e.target.value)}
              style={inputStyle}
              placeholder="31001"
            />
          </div>
        </div>
      </div>

      {/* Pedido gratuito */}
      {isFree && (
        <div style={{ padding: "16px 20px", borderRadius: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", fontSize: 14, color: "#16a34a", fontWeight: 500 }}>
          Este pedido es gratuito — no se requiere pago.
        </div>
      )}

      {/* Payment method selector */}
      {!isFree && <div>
        <p style={sectionTitle}>Pago</p>

        {/* Selector */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setPaymentMethod("stripe")}
            style={methodBtnStyle(paymentMethod === "stripe")}
          >
            💳 Tarjeta
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("paypal")}
            style={methodBtnStyle(paymentMethod === "paypal")}
          >
            PayPal
          </button>
        </div>

        {/* Stripe */}
        {paymentMethod === "stripe" && (
          <>
            <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8, background: "#FAFAFA" }}>
              <PaymentElement />
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>{labels.testCard}</p>
          </>
        )}

        {/* PayPal */}
        {paymentMethod === "paypal" && (
          <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8, background: "#FAFAFA" }}>
            <PayPalButtons
              style={{ layout: "vertical", shape: "rect", color: "gold", label: "pay" }}
              disabled={isProcessing}
              createOrder={handlePayPalCreateOrder}
              onApprove={handlePayPalApprove}
              onError={(err: unknown) => {
                console.error("PayPal error:", err)
                setErrorMessage("Error al procesar el pago con PayPal. Inténtalo de nuevo.")
              }}
            />
          </div>
        )}
      </div>}

      {errorMessage && (
        <div style={{
          padding: "12px 16px",
          borderRadius: 8,
          background: "#FEF2F2",
          border: "1px solid #FCA5A5",
          fontSize: 14,
          color: "#DC2626",
        }}>
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      {(isFree || paymentMethod === "stripe") && (
        <button
          type="submit"
          disabled={(!isFree && !stripe) || isProcessing}
          style={{
            padding: "15px 24px", borderRadius: 8, border: "none",
            background: ((!isFree && !stripe) || isProcessing) ? "#D1D5DB" : "#111827",
            color: "#FFFFFF", fontSize: 15, fontWeight: 700,
            cursor: ((!isFree && !stripe) || isProcessing) ? "not-allowed" : "pointer",
            fontFamily: "inherit", transition: "background 0.15s",
          }}
        >
          {isProcessing ? labels.processing : isFree ? "Confirmar pedido" : labels.pay}
        </button>
      )}
    </form>
  )
}
