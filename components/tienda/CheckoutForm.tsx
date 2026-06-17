"use client"

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { medusa } from "@/lib/medusa"
import { ArrowLeft } from "lucide-react"

type Props = {
  locale: string
  cartId: string
  onBack: () => void
  onSuccess: (orderId: string) => void
}

export function CheckoutForm({ locale, cartId, onBack, onSuccess }: Props) {
  const stripe = useStripe()
  const elements = useElements()

  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setIsProcessing(true)
    setErrorMessage(null)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/tienda/confirmacion`,
      },
    })

    if (error) {
      setErrorMessage(error.message ?? "Error al procesar el pago")
      setIsProcessing(false)
      return
    }

    if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "requires_capture") {
      try {
        const result = await medusa.store.cart.complete(cartId)
        if (result.type === "order" && result.order) {
          onSuccess(result.order.id)
        } else {
          setErrorMessage("El pago se realizó pero no se pudo crear el pedido. Contacta con nosotros.")
        }
      } catch {
        setErrorMessage("El pago se realizó pero no se pudo crear el pedido. Contacta con nosotros.")
      } finally {
        setIsProcessing(false)
      }
    } else {
      // Stripe ha redirigido fuera (3D Secure) — se completará en /confirmacion
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer",
          color: "#6B7280", fontSize: 13, fontWeight: 600, padding: 0,
          fontFamily: "inherit", alignSelf: "flex-start",
        }}
      >
        <ArrowLeft size={14} /> Volver a dirección de envío
      </button>

      <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Pago</p>

      <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8, background: "#FAFAFA" }}>
        <PaymentElement />
      </div>
      <p style={{ fontSize: 12, color: "#9CA3AF" }}>
        Modo de prueba — usa la tarjeta 4242 4242 4242 4242, cualquier fecha futura y CVC.
      </p>

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
          fontFamily: "inherit", transition: "background 0.15s",
        }}
      >
        {isProcessing ? "Procesando..." : "Pagar"}
      </button>
    </form>
  )
}
