import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  })

  try {
    const { amount, currency = "eur", cartId } = await req.json() as {
      amount: number
      currency?: string
      cartId: string
    }

    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      metadata: { cart_id: cartId },
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
