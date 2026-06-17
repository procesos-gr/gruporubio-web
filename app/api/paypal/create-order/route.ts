import { NextRequest, NextResponse } from "next/server"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const MEDUSA_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function POST(req: NextRequest) {
  try {
    const { cartId } = await req.json()

    // Iniciar sesión de pago PayPal en Medusa — devuelve el PayPal order ID en session.data.id
    const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/payment-sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": MEDUSA_KEY,
      },
      body: JSON.stringify({ provider_id: "pp_paypal_paypal" }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error("[paypal/create-order] Medusa error:", err)
      return NextResponse.json({ error: "Error iniciando pago PayPal" }, { status: 500 })
    }

    const data = await res.json()
    const paypalOrderId = data.payment_session?.data?.id

    if (!paypalOrderId) {
      console.error("[paypal/create-order] No paypalOrderId in session data:", data)
      return NextResponse.json({ error: "No se recibió ID de PayPal" }, { status: 500 })
    }

    return NextResponse.json({ paypalOrderId })
  } catch (err) {
    console.error("[paypal/create-order] Error:", err)
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 })
  }
}
