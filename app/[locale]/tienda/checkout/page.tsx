"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe"
import { useCartStore } from "@/lib/store/cart"
import { medusa } from "@/lib/medusa"
import { CheckoutForm } from "@/components/tienda/CheckoutForm"
import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Truck, MapPin, Loader2 } from "lucide-react"

type ShippingOption = {
  id: string
  name: string
  amount: number
}

export default function CheckoutPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale
  const t = useTranslations("Tienda")
  const router = useRouter()
  const { items, total, cartId, initCart } = useCartStore()

  const [cartReady, setCartReady] = useState(false)
  const [step, setStep] = useState<"address" | "payment">("address")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Dirección
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postal, setPostal] = useState("")

  // Envío
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [shippingOptionId, setShippingOptionId] = useState<string>("")
  const [loadingOptions, setLoadingOptions] = useState(true)

  // Espera a que Zustand rehidrate desde localStorage antes de decidir si hay carrito o no.
  // Sin esto, en una carga directa de /checkout (recarga o link externo) cartId todavia es
  // null en el primer render y la pagina redirige a /tienda antes de que llegue el cartId real.
  useEffect(() => {
    const afterHydration = () => {
      const { cartId: hydratedCartId, items: hydratedItems } = useCartStore.getState()
      if (hydratedCartId && hydratedItems.length === 0) {
        initCart().finally(() => setCartReady(true))
      } else {
        setCartReady(true)
      }
    }

    if (useCartStore.persist.hasHydrated()) {
      afterHydration()
    } else {
      const unsub = useCartStore.persist.onFinishHydration(afterHydration)
      return unsub
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!cartReady) return
    if (items.length === 0) {
      router.push(`/${locale}/tienda`)
      return
    }
    if (!cartId) return

    medusa.store.fulfillment.listCartOptions({ cart_id: cartId })
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const opts = (res.shipping_options ?? []).map((o: any) => ({
          id: o.id,
          name: o.name,
          amount: o.calculated_price?.calculated_amount ?? o.amount ?? 0,
        }))
        setShippingOptions(opts)
        if (opts.length > 0) setShippingOptionId(opts[0].id)
      })
      .catch(() => setError("No se pudieron cargar las opciones de envío."))
      .finally(() => setLoadingOptions(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartReady, items.length, cartId, locale, router])

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(amount)

  const formatCents = (amount: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(amount / 100)

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cartId || !shippingOptionId) return
    setSubmitting(true)
    setError(null)
    try {
      // 1. Guardar email + dirección en el carrito
      await medusa.store.cart.update(cartId, {
        email,
        shipping_address: {
          first_name: name.split(" ")[0] || name,
          last_name: name.split(" ").slice(1).join(" ") || "",
          address_1: address,
          city,
          postal_code: postal,
          country_code: "es",
        },
        billing_address: {
          first_name: name.split(" ")[0] || name,
          last_name: name.split(" ").slice(1).join(" ") || "",
          address_1: address,
          city,
          postal_code: postal,
          country_code: "es",
        },
      })

      // 2. Asignar método de envío
      await medusa.store.cart.addShippingMethod(cartId, { option_id: shippingOptionId })

      // 3. Recuperar carrito actualizado (con el total ya incluyendo envío)
      const { cart: updatedCart } = await medusa.store.cart.retrieve(cartId)

      // 4. Iniciar sesión de pago con Stripe a través de Medusa
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await medusa.store.payment.initiatePaymentSession(updatedCart as any, {
        provider_id: "pp_stripe_stripe",
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = result.payment_collection?.payment_sessions?.find(
        (s: any) => s.provider_id === "pp_stripe_stripe"
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const secret = (session?.data as any)?.client_secret as string | undefined
      if (!secret) throw new Error("No se pudo iniciar el pago")

      setClientSecret(secret)
      setStep("payment")
    } catch (err) {
      console.error(err)
      setError("No se pudo continuar al pago. Revisa los datos e inténtalo de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 8,
    border: "1px solid #E5E7EB", fontSize: 14, color: "#111827",
    background: "#FFFFFF", fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  }
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6,
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
          {error && (
            <div style={{
              padding: "16px 20px", borderRadius: 8, marginBottom: 24,
              background: "#FEF2F2", border: "1px solid #FCA5A5",
              fontSize: 14, color: "#DC2626",
            }}>
              {error}
            </div>
          )}

          {!cartReady || loadingOptions ? (
            <div style={{ color: "#9CA3AF", fontSize: 15, padding: "40px 0", display: "flex", alignItems: "center", gap: 10 }}>
              <Loader2 size={18} className="animate-spin" /> Preparando el checkout...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">

              {/* ── Columna principal: paso 1 (dirección+envío) o paso 2 (pago) ── */}
              {step === "address" ? (
                <form onSubmit={handleContinueToPayment} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Información de contacto</p>
                    <label style={labelStyle}>Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="tu@email.com" />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Dirección de envío</p>
                    <div>
                      <label style={labelStyle}>Nombre completo</label>
                      <input required value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="Nombre Apellidos" />
                    </div>
                    <div>
                      <label style={labelStyle}>Dirección</label>
                      <input required value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} placeholder="Calle, número, piso" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Ciudad</label>
                        <input required value={city} onChange={e => setCity(e.target.value)} style={inputStyle} placeholder="Ciudad" />
                      </div>
                      <div>
                        <label style={labelStyle}>Código postal</label>
                        <input required value={postal} onChange={e => setPostal(e.target.value)} style={inputStyle} placeholder="31001" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Método de envío</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {shippingOptions.map(opt => (
                        <label
                          key={opt.id}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "14px 16px", borderRadius: 8,
                            border: `2px solid ${shippingOptionId === opt.id ? "#2563EB" : "#E5E7EB"}`,
                            background: shippingOptionId === opt.id ? "#EFF6FF" : "#FFFFFF",
                            cursor: "pointer",
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <input
                              type="radio"
                              name="shipping"
                              checked={shippingOptionId === opt.id}
                              onChange={() => setShippingOptionId(opt.id)}
                            />
                            {opt.amount === 0
                              ? <MapPin size={16} style={{ color: "#374151" }} />
                              : <Truck size={16} style={{ color: "#374151" }} />}
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{opt.name}</span>
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: opt.amount === 0 ? "#16a34a" : "#111827" }}>
                            {opt.amount === 0 ? "Gratis" : formatPrice(opt.amount)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !shippingOptionId}
                    style={{
                      padding: "15px 24px", borderRadius: 8, border: "none",
                      background: submitting || !shippingOptionId ? "#D1D5DB" : "#111827",
                      color: "#FFFFFF", fontSize: 15, fontWeight: 700,
                      cursor: submitting || !shippingOptionId ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {submitting ? "Procesando..." : "Continuar al pago"}
                  </button>
                </form>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
                  <CheckoutForm
                    locale={locale}
                    cartId={cartId!}
                    onBack={() => setStep("address")}
                    onSuccess={(orderId) => {
                      // El carrito se limpia en /confirmacion (no aqui), para que el
                      // efecto de "carrito vacio -> redirigir a /tienda" de esta pagina
                      // no gane la carrera contra esta navegacion.
                      router.push(`/${locale}/tienda/confirmacion?order_id=${orderId}`)
                    }}
                  />
                </Elements>
              ) : null}

              {/* ── Resumen del pedido ── */}
              <div>
                <div style={{
                  background: "#FFFFFF", borderRadius: 8, border: "1px solid #E5E7EB",
                  padding: "24px", position: "sticky", top: 24,
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
                          {formatCents(item.total)}
                        </p>
                      </div>
                    ))}
                  </div>
                  {step === "address" && shippingOptionId && (
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid #F3F4F6" }}>
                      <p style={{ fontSize: 13, color: "#6B7280" }}>Envío</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                        {formatPrice(shippingOptions.find(o => o.id === shippingOptionId)?.amount ?? 0)}
                      </p>
                    </div>
                  )}
                  <div style={{
                    borderTop: "1px solid #F3F4F6", marginTop: 20, paddingTop: 16,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Total</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.5px" }}>
                      {formatCents(total)}
                      {step === "address" && shippingOptionId && (
                        <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}> + envío</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
