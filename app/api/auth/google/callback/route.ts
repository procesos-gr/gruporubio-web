import { NextRequest, NextResponse } from "next/server"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(new URL("/es/cuenta?error=auth_failed", request.url))
  }

  try {
    // Pasar el code y state a Medusa para que los intercambie por un token
    const params = new URLSearchParams()
    if (code) params.set("code", code)
    if (state) params.set("state", state)

    const medusaRes = await fetch(
      `${MEDUSA_URL}/auth/customer/google/callback?${params.toString()}`,
      { headers: { "Content-Type": "application/json" } }
    )

    const data = await medusaRes.json()

    if (!data.token) {
      return NextResponse.redirect(new URL("/es/cuenta?error=no_token", request.url))
    }

    // Redirigir al frontend con el token como query param
    return NextResponse.redirect(
      new URL(`/es/cuenta/callback?token=${data.token}`, request.url)
    )
  } catch {
    return NextResponse.redirect(new URL("/es/cuenta?error=server_error", request.url))
  }
}
