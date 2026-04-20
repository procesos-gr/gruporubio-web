"use client"

import { useState } from "react"
import { useCartStore } from "@/lib/store/cart"
import { ShoppingBag } from "lucide-react"

type Variant = {
  id: string
  title: string
}

type Props = {
  variants: Variant[]
  labelAdd: string
  labelAdding: string
  labelSelect: string
}

export function AddToCartButton({ variants, labelAdd, labelAdding, labelSelect }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.length === 1 ? variants[0].id : ""
  )
  const { addItem, isLoading } = useCartStore()

  const handleAdd = async () => {
    if (!selectedVariantId) return
    await addItem(selectedVariantId, 1)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {variants.length > 1 && (
        <select
          value={selectedVariantId}
          onChange={(e) => setSelectedVariantId(e.target.value)}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 8,
            border: "1px solid #E5E7EB", fontSize: 14, fontWeight: 500,
            color: "#111827", background: "#FFFFFF", fontFamily: "inherit", cursor: "pointer",
          }}
        >
          <option value="">{labelSelect}</option>
          {variants.map((v) => (
            <option key={v.id} value={v.id}>{v.title}</option>
          ))}
        </select>
      )}
      <button
        onClick={handleAdd}
        disabled={isLoading || !selectedVariantId}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          width: "100%", padding: "15px 28px", borderRadius: 8, border: "none",
          background: isLoading || !selectedVariantId ? "#D1D5DB" : "#111827",
          color: "#FFFFFF", fontSize: 15, fontWeight: 700,
          cursor: isLoading || !selectedVariantId ? "not-allowed" : "pointer",
          fontFamily: "inherit", transition: "background 0.15s",
        }}
      >
        <ShoppingBag size={17} />
        {isLoading ? labelAdding : labelAdd}
      </button>
    </div>
  )
}
