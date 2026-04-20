"use client"

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useCartStore } from "@/lib/store/cart"

type Props = {
  locale: string
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

export function CheckoutForm({ labels, locale }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const { clearCart } = useCartStore()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postal, setPostal] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Contact */}
      <div>
        <p style={sectionTitle}>Información de contacto</p>
        <div>
          <label style={labelStyle}>{labels.email}</label>
          <input
            type="email" required value={email}
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
          <input required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Nombre Apellidos" />
        </div>
        <div>
          <label style={labelStyle}>{labels.address}</label>
          <input required value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} placeholder="Calle, número, piso" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>{labels.city}</label>
            <input required value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} placeholder="Ciudad" />
          </div>
          <div>
            <label style={labelStyle}>{labels.postal}</label>
            <input required value={postal} onChange={(e) => setPostal(e.target.value)} style={inputStyle} placeholder="31001" />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div>
        <p style={sectionTitle}>Pago</p>
        <div style={{
          padding: 16, border: "1px solid #E5E7EB",
          borderRadius: 8, background: "#FAFAFA",
        }}>
          <PaymentElement />
        </div>
        <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>{labels.testCard}</p>
      </div>

      {errorMessage && (
        <div style={{
          padding: "12px 16px", borderRadius: 8,
          background: "#FEF2F2", border: "1px solid #FCA5A5",
          fontSize: 14, color: "#DC2626",
        }}>
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        style={{
          padding: "15px 24px", borderRadius: 8, border: "none",
          background: !stripe || isProcessing ? "#D1D5DB" : "#111827",
          color: "#FFFFFF", fontSize: 15, fontWeight: 700,
          cursor: !stripe || isProcessing ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          transition: "background 0.15s",
        }}
      >
        {isProcessing ? labels.processing : labels.pay}
      </button>
    </form>
  )
}
