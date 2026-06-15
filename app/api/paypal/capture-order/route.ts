import { NextRequest, NextResponse } from "next/server"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const MEDUSA_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function POST(req: NextRequest) {
  try {
    const { cartId } = await req.json()

    const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": MEDUSA_KEY,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Error completando pedido" }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, orderId: data.order?.id })
  } catch {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 })
  }
}
