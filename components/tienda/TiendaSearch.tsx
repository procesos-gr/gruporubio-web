"use client"

import { useState, FormEvent } from "react"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"

type Props = {
  locale: string
  initialQuery?: string
}

// Barra de búsqueda de la tienda — sincroniza con /tienda?q=
export function TiendaSearch({ locale, initialQuery = "" }: Props) {
  const [value, setValue] = useState(initialQuery)
  const router = useRouter()

  function submit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim()
    router.push(q ? `/${locale}/tienda?q=${encodeURIComponent(q)}` : `/${locale}/tienda`)
  }

  function clear() {
    setValue("")
    if (initialQuery) router.push(`/${locale}/tienda`)
  }

  return (
    <form
      onSubmit={submit}
      style={{
        maxWidth: 640, margin: "0 auto", padding: "28px 32px 0",
        display: "flex", alignItems: "center", gap: 10,
      }}
    >
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        background: "#FFFFFF", border: "1.5px solid #E5E7EB", borderRadius: 8,
        padding: "0 12px", transition: "border-color 0.15s",
      }}>
        <Search size={16} color="#9CA3AF" style={{ flexShrink: 0, marginRight: 10 }} />
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Buscar productos... p. ej. desengrasante, gel, insecticida"
          autoComplete="off"
          style={{
            flex: 1, minWidth: 0, border: "none", outline: "none",
            background: "transparent", fontSize: 14, color: "#111827",
            padding: "12px 0", fontFamily: "inherit",
          }}
        />
        {value && (
          <button
            type="button"
            onClick={clear}
            aria-label="Limpiar búsqueda"
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}
          >
            <X size={15} color="#9CA3AF" />
          </button>
        )}
      </div>
      <button
        type="submit"
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#111827", color: "#FFFFFF", border: "none",
          borderRadius: 8, padding: "12px 20px", fontSize: 13, fontWeight: 600,
          cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
        }}
      >
        <Search size={13} />
        Buscar
      </button>
    </form>
  )
}
