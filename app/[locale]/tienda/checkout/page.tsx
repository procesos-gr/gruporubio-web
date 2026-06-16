"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useCartStore } from "@/lib/store/cart"
import { CheckoutForm } from "@/components/tienda/CheckoutForm"
import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { useTranslations } from "next-intl"
import Link from "next/link"

function FreeCheckoutForm({ locale }: { locale: string }) {
  const router = useRouter()
  const { clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 500))
    clearCart()
    router.push(`/${locale}/tienda/confirmacion`)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 8,
    border: "1px solid #E5E7EB", fontSize: 14, color: "#111827",
    background: "#FFFFFF", fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
        <input type="email" required style={inputStyle} placeholder="tu@email.com" />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Nombre</label>
        <input required style={inputStyle} placeholder="Nombre Apellidos" />
      </div>
      <div style={{ padding: "14px 18px", borderRadius: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", fontSize: 14, color: "#16a34a", fontWeight: 500 }}>
        Este pedido es gratuito — no se requiere pago.
      </div>
      <button
        type="submit"
        disabled={isProcessing}
        style={{
          padding: "15px 24px", borderRadius: 8, border: "none",
          background: isProcessing ? "#D1D5DB" : "#111827",
          color: "#FFFFFF", fontSize: 15, fontWeight: 700,
          cursor: isProcessing ? "not-allowed" : "pointer", fontFamily: "inherit",
        }}
      >
        {isProcessing ? "Procesando..." : "Confirmar pedido"}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale
  const t = useTranslations("Tienda")
  const router = useRouter()
  const { items, total, cartId } = useCartStore()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      router.push(`/${locale}/tienda`)
      return
    }
    if (!cartId) return

    // Pedido gratuito — sin Stripe
    if (total === 0) {
      setClientSecret("free")
      return
    }

    fetch("/api/stripe/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, currency: "eur", cartId }),
    })
      .then((r) => r.json())
      .then((data: { clientSecret?: string; error?: string }) => {
        if (data.error) setError(data.error)
        else if (data.clientSecret) setClientSecret(data.clientSecret)
      })
      .catch(() => setError("Error de conexión. Inténtalo de nuevo."))
  }, [items.length, total, cartId, locale, router])

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(amount / 100)

  const labels = {
    name: t("checkout_name"),
    email: t("checkout_email"),
    address: t("checkout_address"),
    city: t("checkout_city"),
    postal: t("checkout_postal"),
    pay: t("checkout_pay"),
    processing: t("checkout_processing"),
    testCard: t("checkout_test_card"),
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div style={{ background: "#111827", padding: "80px 32px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href={`/${locale}/tienda`} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
              {t("breadcrumb_shop")}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{t("checkout_title")}</span>
          </nav>
          <h1 style={{
            fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, color: "#F9FAFB",
            letterSpacing: "-1.5px", marginTop: 16, marginBottom: 0,
          }}>
            {t("checkout_title")}
          </h1>
        </div>
      </div>

      <div style={{ background: "#F9FAFB", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
          {error ? (
            <div style={{
              padding: "16px 20px", borderRadius: 8,
              background: "#FEF2F2", border: "1px solid #FCA5A5",
              fontSize: 14, color: "#DC2626",
            }}>
              {error}
            </div>
          ) : !clientSecret ? (
            <div style={{ color: "#9CA3AF", fontSize: 15, padding: "40px 0" }}>
              Preparando el checkout...
            </div>
          ) : (
            <PayPalScriptProvider
              options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
                currency: "EUR",
                intent: "capture",
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
                {/* Form */}
                {clientSecret === "free" ? (
                  <FreeCheckoutForm locale={locale} />
                ) : (
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance: { theme: "stripe" } }}
                  >
                    <CheckoutForm locale={locale} labels={labels} />
                  </Elements>
                )}

                {/* Order summary */}
                <div>
                  <div style={{
                    background: "#FFFFFF",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    padding: "24px",
                    position: "sticky",
                    top: 24,
                  }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 20 }}>
                      Resumen del pedido
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {items.map((item) => (
                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 500, color: "#111827", lineHeight: 1.3 }}>{item.title}</p>
                            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>x{item.quantity}</p>
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", flexShrink: 0 }}>
                            {formatPrice(item.total)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      borderTop: "1px solid #F3F4F6", marginTop: 20, paddingTop: 16,
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Total</span>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.5px" }}>
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </PayPalScriptProvider>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
