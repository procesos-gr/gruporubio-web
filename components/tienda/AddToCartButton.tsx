"use client"

import { useState } from "react"
import * as Select from "@radix-ui/react-select"
import { ChevronDown, Check, ShoppingBag, Minus, Plus } from "lucide-react"
import { useCartStore } from "@/lib/store/cart"
import { toast } from "sonner"

type Variant = { id: string; title: string }

type Props = {
  variants: Variant[]
  productTitle?: string
  labelAdd: string
  labelAdding: string
  labelSelect: string
}

export function AddToCartButton({ variants, productTitle = "", labelAdd, labelAdding, labelSelect }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.length === 1 ? variants[0].id : ""
  )
  const [quantity, setQuantity] = useState(1)
  const { addItem, isLoading } = useCartStore()

  const handleAdd = async () => {
    if (!selectedVariantId) return
    try {
      await addItem(selectedVariantId, quantity)
      const variant = variants.find(v => v.id === selectedVariantId)
      toast.success(
        `${productTitle}${variant?.title && variants.length > 1 ? ` (${variant.title})` : ""} añadido al carrito`,
        { description: "Puedes verlo en el icono del carrito ↑", duration: 3500 }
      )
      setQuantity(1)
    } catch {
      toast.error("No se pudo añadir el producto, inténtalo de nuevo.")
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {variants.length > 1 && (
        <Select.Root value={selectedVariantId} onValueChange={setSelectedVariantId}>
          <Select.Trigger
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 8,
              border: "1.5px solid #E5E7EB", fontSize: 14, fontWeight: 500,
              color: selectedVariantId ? "#111827" : "#9CA3AF",
              background: "#FFFFFF", fontFamily: "inherit", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              outline: "none", transition: "border-color 0.15s",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "#2563EB" }}
            onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB" }}
          >
            <Select.Value placeholder={labelSelect} />
            <Select.Icon><ChevronDown size={16} style={{ color: "#6B7280" }} /></Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              position="popper"
              sideOffset={4}
              style={{
                background: "#FFFFFF", borderRadius: 8,
                border: "1.5px solid #E5E7EB",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                zIndex: 9999, overflow: "hidden",
                minWidth: "var(--radix-select-trigger-width)",
                fontFamily: "inherit",
              }}
            >
              <Select.Viewport style={{ padding: 4 }}>
                {variants.map(v => (
                  <Select.Item
                    key={v.id}
                    value={v.id}
                    style={{
                      padding: "10px 14px", fontSize: 14, fontWeight: 500,
                      color: "#111827", cursor: "pointer", borderRadius: 6,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      outline: "none", userSelect: "none",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#F3F4F6" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                  >
                    <Select.ItemText>{v.title}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check size={14} style={{ color: "#2563EB" }} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        {/* Selector de cantidad */}
        <div style={{
          display: "flex", alignItems: "center",
          border: "1.5px solid #E5E7EB", borderRadius: 8,
          flexShrink: 0,
        }}>
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            style={{
              width: 38, height: 50, display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", background: "transparent", cursor: quantity <= 1 ? "not-allowed" : "pointer",
              color: quantity <= 1 ? "#D1D5DB" : "#374151",
            }}
            aria-label="Disminuir cantidad"
          >
            <Minus size={15} />
          </button>
          <span style={{
            width: 32, textAlign: "center", fontSize: 15, fontWeight: 700, color: "#111827",
          }}>
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(q => q + 1)}
            style={{
              width: 38, height: 50, display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", background: "transparent", cursor: "pointer", color: "#374151",
            }}
            aria-label="Aumentar cantidad"
          >
            <Plus size={15} />
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={isLoading || !selectedVariantId}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            flex: 1, padding: "15px 28px", borderRadius: 8, border: "none",
            background: isLoading || !selectedVariantId ? "#D1D5DB" : "#111827",
            color: "#FFFFFF", fontSize: 15, fontWeight: 700,
            cursor: isLoading || !selectedVariantId ? "not-allowed" : "pointer",
            fontFamily: "inherit", transition: "background 0.15s",
          }}
          onMouseEnter={e => { if (!isLoading && selectedVariantId) e.currentTarget.style.background = "#1F2937" }}
          onMouseLeave={e => { if (!isLoading && selectedVariantId) e.currentTarget.style.background = "#111827" }}
        >
          <ShoppingBag size={17} />
          {isLoading ? labelAdding : labelAdd}
        </button>
      </div>
    </div>
  )
}
