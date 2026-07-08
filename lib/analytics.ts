// Eventos e-commerce estándar (formato GA4) hacia el dataLayer de GTM.
// GTM solo se carga tras el consentimiento de cookies, así que estos pushes
// nunca salen del navegador sin consentimiento (se quedan encolados).
// Si algún día entra Segment/CRM: añadir aquí el segundo destino y los
// componentes no se tocan.

export type AnalyticsItem = {
  item_id: string
  item_name: string
  price?: number // EUR en unidades, no céntimos
  quantity?: number
  item_category?: string
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/** Medusa maneja céntimos; GA4 espera unidades de moneda. */
export function centsToEur(cents: number): number {
  return Math.round(cents) / 100
}

function push(event: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  // GA4 recomienda limpiar el objeto ecommerce antes de cada push
  if ("ecommerce" in payload) {
    window.dataLayer.push({ ecommerce: null })
  }
  window.dataLayer.push({ event, ...payload })
}

export const analytics = {
  viewItem(value: number, items: AnalyticsItem[]) {
    push("view_item", { ecommerce: { currency: "EUR", value, items } })
  },
  addToCart(value: number, items: AnalyticsItem[]) {
    push("add_to_cart", { ecommerce: { currency: "EUR", value, items } })
  },
  removeFromCart(value: number, items: AnalyticsItem[]) {
    push("remove_from_cart", { ecommerce: { currency: "EUR", value, items } })
  },
  beginCheckout(value: number, items: AnalyticsItem[]) {
    push("begin_checkout", { ecommerce: { currency: "EUR", value, items } })
  },
  purchase(transactionId: string, value: number, items: AnalyticsItem[]) {
    push("purchase", {
      ecommerce: { transaction_id: transactionId, currency: "EUR", value, items },
    })
  },
  search(searchTerm: string) {
    push("search", { search_term: searchTerm })
  },
}
