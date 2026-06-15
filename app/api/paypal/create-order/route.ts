import { NextRequest, NextResponse } from "next/server"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const MEDUSA_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function POST(req: NextRequest) {
  try {
    const { cartId, amount } = await req.json()

    // Inicia sesión de pago PayPal en Medusa
    const res = await fetch(`${MEDUSA_URL}/store/payment-collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": MEDUSA_KEY,
      },
      body: JSON.stringify({ cart_id: cartId }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Error iniciando pago" }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({
      paymentCollectionId: data.payment_collection?.id,
      amount,
    })
  } catch {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 })
  }
}
