import { create } from "zustand"
import { persist } from "zustand/middleware"
import { medusa } from "@/lib/medusa"

export type LineItem = {
  id: string
  variant_id: string
  title: string
  thumbnail: string | null
  quantity: number
  unit_price: number
  total: number
}

type CartItem = {
  id: string
  variant_id?: string | null
  title?: string | null
  thumbnail?: string | null
  quantity: number
  unit_price?: number | null
  total?: number | null
}

type CartStore = {
  cartId: string | null
  items: LineItem[]
  total: number
  itemCount: number
  isOpen: boolean
  isLoading: boolean
  openCart: () => void
  closeCart: () => void
  initCart: () => Promise<void>
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  clearCart: () => void
}

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID!
const SALES_CHANNEL_ID = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID!

function parseItems(cart: { items?: CartItem[] }): LineItem[] {
  if (!cart.items) return []
  return cart.items.map((item: CartItem) => ({
    id: item.id,
    variant_id: item.variant_id ?? "",
    title: item.title ?? "",
    thumbnail: item.thumbnail ?? null,
    quantity: item.quantity,
    unit_price: item.unit_price ?? 0,
    total: item.total ?? 0,
  }))
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      total: 0,
      itemCount: 0,
      isOpen: false,
      isLoading: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      clearCart: () => set({ cartId: null, items: [], total: 0, itemCount: 0 }),

      initCart: async () => {
        const { cartId } = get()
        try {
          if (cartId) {
            const { cart } = await medusa.store.cart.retrieve(cartId, {
              fields: "+items,+items.variant,+items.thumbnail",
            } as Parameters<typeof medusa.store.cart.retrieve>[1])
            const items = parseItems(cart as { items?: CartItem[] })
            set({
              items,
              total: (cart as { total?: number }).total ?? 0,
              itemCount: items.reduce((s, i) => s + i.quantity, 0),
            })
          } else {
            const { cart } = await medusa.store.cart.create({ region_id: REGION_ID, sales_channel_id: SALES_CHANNEL_ID })
            set({ cartId: cart.id, items: [], total: 0, itemCount: 0 })
          }
        } catch {
          try {
            const { cart } = await medusa.store.cart.create({ region_id: REGION_ID, sales_channel_id: SALES_CHANNEL_ID })
            set({ cartId: cart.id, items: [], total: 0, itemCount: 0 })
          } catch {
            // Medusa unavailable (dev without backend)
          }
        }
      },

      addItem: async (variantId, quantity = 1) => {
        set({ isLoading: true })
        try {
          let { cartId } = get()
          if (!cartId) {
            const { cart: newCart } = await medusa.store.cart.create({ region_id: REGION_ID, sales_channel_id: SALES_CHANNEL_ID })
            cartId = newCart.id
            set({ cartId })
          }
          const { cart } = await medusa.store.cart.createLineItem(cartId!, {
            variant_id: variantId,
            quantity,
          })
          const items = parseItems(cart as { items?: CartItem[] })
          set({
            items,
            total: (cart as { total?: number }).total ?? 0,
            itemCount: items.reduce((s, i) => s + i.quantity, 0),
            isOpen: true,
          })
        } finally {
          set({ isLoading: false })
        }
      },

      updateItem: async (lineItemId, quantity) => {
        const { cartId } = get()
        if (!cartId) return
        set({ isLoading: true })
        try {
          const { cart } = await medusa.store.cart.updateLineItem(cartId, lineItemId, { quantity })
          const items = parseItems(cart as { items?: CartItem[] })
          set({
            items,
            total: (cart as { total?: number }).total ?? 0,
            itemCount: items.reduce((s, i) => s + i.quantity, 0),
          })
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (lineItemId) => {
        const { cartId } = get()
        if (!cartId) return
        set({ isLoading: true })
        try {
          await medusa.store.cart.deleteLineItem(cartId, lineItemId)
          const { cart } = await medusa.store.cart.retrieve(cartId, {
            fields: "+items,+items.variant,+items.thumbnail",
          } as Parameters<typeof medusa.store.cart.retrieve>[1])
          const items = parseItems(cart as { items?: CartItem[] })
          set({
            items,
            total: (cart as { total?: number }).total ?? 0,
            itemCount: items.reduce((s, i) => s + i.quantity, 0),
          })
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: "medusa_cart",
      partialize: (state) => ({ cartId: state.cartId }),
    }
  )
)
