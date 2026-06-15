"use client"
import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale } = useParams<{ locale: string }>()

  useEffect(() => {
    const token = searchParams.get("access_token") || searchParams.get("token")
    if (token) {
      localStorage.setItem("medusa_customer_token", token)
      router.replace(`/${locale}/cuenta`)
    } else {
      router.replace(`/${locale}/cuenta?error=auth_failed`)
    }
  }, [searchParams, router, locale])

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#111827",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <p style={{ color: "#9CA3AF", fontSize: 15 }}>Autenticando...</p>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#111827" }}>
        <p style={{ color: "#9CA3AF" }}>Cargando...</p>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
