"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/store/cart"
import { useLocale } from "next-intl"

export function CartSidebar() {
  const locale = useLocale()
  const { isOpen, closeCart, items, total, updateItem, removeItem, isLoading } = useCartStore()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [closeCart])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(amount / 100)

  return (
    <>
      <div
        ref={overlayRef}
        onClick={closeCart}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 49,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />
      <div style={{
        position: "fixed", top: 0, right: 0,
        width: "min(420px, 100vw)",
        height: "100vh",
        background: "#FFFFFF",
        zIndex: 50,
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid #F3F4F6",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingBag size={18} color="#111827" />
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Tu carrito</span>
          </div>
          <button
            onClick={closeCart}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: 6,
              border: "none", background: "#F3F4F6", cursor: "pointer",
            }}
          >
            <X size={16} color="#6B7280" />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "100%", gap: 12,
              color: "#9CA3AF", textAlign: "center",
            }}>
              <ShoppingBag size={40} strokeWidth={1.5} />
              <p style={{ fontSize: 15, fontWeight: 500, color: "#6B7280" }}>Tu carrito está vacío</p>
              <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.5 }}>
                Explora nuestros productos y añade artículos.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {items.map((item) => (
                <div key={item.id} style={{
                  display: "flex", gap: 14,
                  paddingBottom: 16,
                  borderBottom: "1px solid #F3F4F6",
                }}>
                  <div style={{
                    width: 72, height: 72, flexShrink: 0,
                    borderRadius: 6, overflow: "hidden",
                    background: "#F3F4F6", position: "relative",
                  }}>
                    {item.thumbnail ? (
                      <Image src={item.thumbnail} alt={item.title} fill style={{ objectFit: "cover" }} sizes="72px" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#E5E7EB" }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.3, marginBottom: 4 }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", marginBottom: 10 }}>
                      {formatPrice(item.unit_price)}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                        disabled={isLoading}
                        style={{
                          width: 28, height: 28, borderRadius: 6,
                          border: "1px solid #E5E7EB", background: "#FFFFFF",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        style={{
                          width: 28, height: 28, borderRadius: 6,
                          border: "1px solid #E5E7EB", background: "#FFFFFF",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }}
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isLoading}
                        style={{
                          marginLeft: "auto", fontSize: 12, color: "#9CA3AF",
                          background: "none", border: "none", cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: "20px 24px",
            borderTop: "1px solid #F3F4F6",
            background: "#FAFAFA",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 15, color: "#6B7280" }}>Subtotal</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                {formatPrice(total)}
              </span>
            </div>
            <Link
              href={`/${locale}/tienda/checkout`}
              onClick={closeCart}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "100%", padding: "14px 24px",
                background: "#111827", color: "#FFFFFF",
                borderRadius: 8, textDecoration: "none",
                fontSize: 15, fontWeight: 700,
              }}
            >
              Ir al checkout
            </Link>
            <button
              onClick={closeCart}
              style={{
                marginTop: 10, width: "100%", padding: "11px",
                background: "none", border: "none", cursor: "pointer",
                fontSize: 14, color: "#6B7280", fontFamily: "inherit",
              }}
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
