"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { LogOut, ShoppingBag, User, MapPin } from "lucide-react"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

type Customer = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
}

type Order = {
  id: string
  display_id: number
  created_at: string
  status: string
  total: number
  currency_code: string
  items?: { title: string; quantity: number; unit_price: number }[]
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  completed: "Completado",
  cancelled: "Cancelado",
  requires_action: "Acción requerida",
}

export default function CuentaPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [googleMeta, setGoogleMeta] = useState<{ name?: string; picture?: string } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("medusa_customer_token")
    if (!token) {
      setLoading(false)
      return
    }

    // Extraer metadatos de Google del JWT para la foto de perfil
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      if (payload.user_metadata) {
        setGoogleMeta(payload.user_metadata)
      }
    } catch {}

    const headers = {
      "Authorization": `Bearer ${token}`,
      "x-publishable-api-key": PUBLISHABLE_KEY,
    }

    Promise.all([
      fetch(`${MEDUSA_URL}/store/customers/me`, { headers }).then(r => r.json()),
      fetch(`${MEDUSA_URL}/store/orders`, { headers }).then(r => r.json()),
    ]).then(([customerData, ordersData]) => {
      if (customerData.customer) {
        setCustomer(customerData.customer)
      } else {
        // Token con actor_id vacío — mostrar datos del JWT mientras se completa el registro
        try {
          const payload = JSON.parse(atob(token.split(".")[1]))
          const meta = payload.user_metadata || {}
          setCustomer({ id: "", first_name: meta.given_name || meta.name || "", last_name: "", email: meta.email || "" })
        } catch {}
      }
      if (ordersData.orders) setOrders(ordersData.orders)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleGoogleLogin = async () => {
    const redirectUrl = `${window.location.origin}/${locale}/cuenta/callback`
    const res = await fetch(`${MEDUSA_URL}/auth/customer/google?redirectUrl=${encodeURIComponent(redirectUrl)}`)
    const data = await res.json()
    if (data.location) window.location.href = data.location
  }

  const handleLogout = () => {
    localStorage.removeItem("medusa_customer_token")
    setCustomer(null)
    setOrders([])
    setGoogleMeta(null)
  }

  if (loading) return (
    <div style={{ background: "#111827", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15 }}>Cargando tu cuenta...</p>
    </div>
  )

  const isLoggedIn = customer !== null

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#111827", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "120px 24px 80px" }}>
        {!isLoggedIn ? (
          /* ── PANTALLA DE LOGIN ── */
          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#F9FAFB", letterSpacing: "-1.5px", marginBottom: 10 }}>
              Mi cuenta
            </h1>
            <p style={{ fontSize: 15, color: "#9CA3AF", marginBottom: 40, lineHeight: 1.6 }}>
              Accede para consultar tus pedidos y datos de envío.
            </p>
            <button
              onClick={handleGoogleLogin}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 12, padding: "14px 24px", background: "#FFFFFF",
                border: "1px solid #E5E7EB", borderRadius: 8,
                fontSize: 15, fontWeight: 600, color: "#111827",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Entrar con Google
            </button>
            <p style={{ fontSize: 12, color: "#6B7280", textAlign: "center", marginTop: 24, lineHeight: 1.5 }}>
              Al acceder aceptas los términos de uso de Grupo Rubio
            </p>
          </div>
        ) : (
          /* ── PANEL DE CUENTA ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* Cabecera usuario */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {googleMeta?.picture ? (
                  <img src={googleMeta.picture} alt="avatar" style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid #1d4ed8" }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={24} color="#fff" />
                  </div>
                )}
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F9FAFB", margin: 0 }}>
                    {customer.first_name ? `${customer.first_name} ${customer.last_name || ""}`.trim() : customer.email}
                  </h1>
                  <p style={{ fontSize: 14, color: "#9CA3AF", margin: "4px 0 0" }}>{customer.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "transparent", border: "1px solid #374151", borderRadius: 8, color: "#9CA3AF", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
              >
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>

            {/* Información de cuenta */}
            <div style={{ background: "#1F2937", borderRadius: 8, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <User size={18} color="#1d4ed8" />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F9FAFB", margin: 0 }}>Información de cuenta</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Nombre</p>
                  <p style={{ fontSize: 15, color: "#F9FAFB", margin: 0 }}>
                    {customer.first_name ? `${customer.first_name} ${customer.last_name || ""}`.trim() : "—"}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</p>
                  <p style={{ fontSize: 15, color: "#F9FAFB", margin: 0 }}>{customer.email}</p>
                </div>
                {customer.phone && (
                  <div>
                    <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Teléfono</p>
                    <p style={{ fontSize: 15, color: "#F9FAFB", margin: 0 }}>{customer.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mis pedidos */}
            <div style={{ background: "#1F2937", borderRadius: 8, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <ShoppingBag size={18} color="#1d4ed8" />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F9FAFB", margin: 0 }}>Mis pedidos</h2>
              </div>

              {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <ShoppingBag size={40} color="#374151" style={{ margin: "0 auto 12px" }} />
                  <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Todavía no tienes pedidos</p>
                  <button
                    onClick={() => router.push(`/${locale}/tienda`)}
                    style={{ marginTop: 16, padding: "10px 20px", background: "#1d4ed8", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Ir a la tienda
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {orders.map(order => (
                    <div key={order.id} style={{ background: "#111827", borderRadius: 8, padding: 20, border: "1px solid #374151" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#F9FAFB", margin: "0 0 4px" }}>
                            Pedido #{order.display_id}
                          </p>
                          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                            {new Date(order.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{
                            display: "inline-block", padding: "4px 10px",
                            borderRadius: 4, fontSize: 12, fontWeight: 600,
                            background: order.status === "completed" ? "#052e16" : order.status === "cancelled" ? "#450a0a" : "#1e3a5f",
                            color: order.status === "completed" ? "#4ade80" : order.status === "cancelled" ? "#f87171" : "#93c5fd",
                          }}>
                            {STATUS_LABEL[order.status] || order.status}
                          </span>
                          <p style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", margin: "8px 0 0" }}>
                            {order.total} {order.currency_code?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      {order.items && order.items.length > 0 && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1F2937" }}>
                          {order.items.map((item, i) => (
                            <p key={i} style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 4px" }}>
                              {item.quantity}× {item.title} — {item.unit_price} {order.currency_code?.toUpperCase()}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
