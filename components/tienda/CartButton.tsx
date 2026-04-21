"use client"

import { useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/store/cart"

export function CartButton() {
  const { itemCount, openCart, initCart } = useCartStore()

  useEffect(() => {
    initCart()
  }, [initCart])

  return (
    <button
      onClick={openCart}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: 8,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: "inherit",
        padding: 0,
      }}
      aria-label={`Carrito (${itemCount} artículos)`}
    >
      <ShoppingCart size={20} />
      {itemCount > 0 && (
        <span style={{
          position: "absolute",
          top: 2,
          right: 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#16a34a",
          color: "#FFFFFF",
          fontSize: 9,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
          pointerEvents: "none",
        }}>
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  )
}
