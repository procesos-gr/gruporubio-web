"use client"
import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale } = useParams<{ locale: string }>()

  useEffect(() => {
    const token = searchParams.get("access_token") || searchParams.get("token")
    if (!token) {
      router.replace(`/${locale}/cuenta?error=auth_failed`)
      return
    }

    const ensureCustomer = async () => {
      try {
        // Extraer datos del JWT de Google
        const payload = JSON.parse(atob(token.split(".")[1]))
        const meta = payload.user_metadata || {}

        // Crear el cliente en Medusa con el email de Google
        const res = await fetch(`${MEDUSA_URL}/store/customers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "x-publishable-api-key": PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            email: meta.email,
            first_name: meta.given_name || meta.name || "",
          }),
        })

        const data = await res.json()

        // Medusa devuelve un nuevo token con actor_id real al crear el cliente
        const finalToken = data.token || token
        localStorage.setItem("medusa_customer_token", finalToken)
      } catch {
        // Si falla (ej: cliente ya existe), guardar el token original
        localStorage.setItem("medusa_customer_token", token)
      }

      router.replace(`/${locale}/cuenta`)
    }

    ensureCustomer()
  }, [searchParams, router, locale])

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#111827",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <p style={{ color: "#9CA3AF", fontSize: 15 }}>Completando inicio de sesión...</p>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#111827" }}>
        <p style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cargando...</p>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
