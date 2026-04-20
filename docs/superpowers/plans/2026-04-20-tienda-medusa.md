# /tienda Medusa + Stripe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir /tienda al proyecto Next.js gruporubio-web conectada al backend Medusa v2 con carrito persistente y checkout Stripe test.

**Architecture:** Server Components para catálogo y ficha de producto (SEO, sin JS cliente). Zustand + localStorage para carrito persistente. Next.js API route para Stripe PaymentIntent. Design system existente (inline styles, Plus Jakarta Sans, border-radius ≤8px).

**Tech Stack:** Next.js 16 App Router, @medusajs/js-sdk, Zustand, @stripe/stripe-js, @stripe/react-stripe-js, next-intl

---

## Known values (already retrieved)

- `REGION_ID = reg_01KPNPJSB589887PX0F6NTH643` (Europe, EUR)
- `MEDUSA_PUBLISHABLE_KEY = pk_5646fbeb957b092241ade2384e7dcc72f03c6937417bc32cf2677fd20988c26d`
- `MEDUSA_URL = http://localhost:9000`

---

## File Map

**Create:**
- `lib/medusa.ts` — SDK singleton
- `lib/store/cart.ts` — Zustand store con persist
- `lib/stripe.ts` — loadStripe singleton
- `components/tienda/ProductCard.tsx` — Server
- `components/tienda/ProductGrid.tsx` — Server
- `components/tienda/ProductGallery.tsx` — Client
- `components/tienda/AddToCartButton.tsx` — Client
- `components/tienda/CartButton.tsx` — Client (badge)
- `components/tienda/CartSidebar.tsx` — Client (drawer)
- `components/tienda/CheckoutForm.tsx` — Client (Stripe Elements)
- `app/[locale]/tienda/page.tsx` — Catalog (Server)
- `app/[locale]/tienda/[handle]/page.tsx` — Product (Server)
- `app/[locale]/tienda/checkout/page.tsx` — Checkout (Client)
- `app/[locale]/tienda/confirmacion/page.tsx` — Confirmation (Server)
- `app/api/stripe/payment-intent/route.ts` — API route Stripe

**Modify:**
- `package.json` — add dependencies
- `.env.local` — STRIPE keys + MEDUSA env vars
- `next.config.ts` — add localhost:9000 image domain
- `messages/es.json` — namespace Tienda
- `messages/en.json` — namespace Tienda
- `messages/fr.json` — namespace Tienda
- `components/layout/Navbar.tsx` — integrate CartButton
- `components/providers.tsx` — add CartProvider + Elements

---

## Task 1: Install dependencies

**Files:** `package.json`

- [ ] **Install packages**

```bash
cd C:/Users/Ayoub/Proyectos/gruporubio-web
npm install @medusajs/js-sdk zustand @stripe/stripe-js @stripe/react-stripe-js
```

Expected output: `added N packages`

- [ ] **Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add @medusajs/js-sdk, zustand, stripe"
```

---

## Task 2: Environment variables

**Files:** `.env.local` (create if not exists)

- [ ] **Create .env.local** with all required variables:

```env
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_5646fbeb957b092241ade2384e7dcc72f03c6937417bc32cf2677fd20988c26d
NEXT_PUBLIC_MEDUSA_REGION_ID=reg_01KPNPJSB589887PX0F6NTH643

# Get from https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_REPLACE_ME
STRIPE_SECRET_KEY=sk_test_REPLACE_ME
```

- [ ] **Add .env.local to .gitignore** if not already there (verify with `cat .gitignore | grep env.local`)

- [ ] **Add localhost image domain to next.config.ts**

Read `next.config.ts` first, then add to `remotePatterns`:

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 85, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'http', hostname: 'localhost', port: '9000' },
    ],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Commit**

```bash
git add next.config.ts
git commit -m "config: add Medusa localhost image domain + env.local template"
```

---

## Task 3: Medusa SDK singleton + Stripe loader

**Files:** `lib/medusa.ts`, `lib/stripe.ts`

- [ ] **Create `lib/medusa.ts`**

```ts
import Medusa from "@medusajs/js-sdk"

export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL!,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
})
```

- [ ] **Create `lib/stripe.ts`**

```ts
import { loadStripe } from "@stripe/stripe-js"

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)
```

- [ ] **Commit**

```bash
git add lib/medusa.ts lib/stripe.ts
git commit -m "feat: Medusa SDK singleton + Stripe loader"
```

---

## Task 4: Zustand cart store

**Files:** `lib/store/cart.ts`

- [ ] **Create `lib/store/cart.ts`**

```ts
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

// Minimal types for Medusa cart items
type CartItem = {
  id: string
  variant_id?: string | null
  title?: string | null
  thumbnail?: string | null
  quantity: number
  unit_price?: number | null
  total?: number | null
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
            })
            const items = parseItems(cart as { items?: CartItem[] })
            set({
              items,
              total: (cart as { total?: number }).total ?? 0,
              itemCount: items.reduce((s, i) => s + i.quantity, 0),
            })
          } else {
            const { cart } = await medusa.store.cart.create({ region_id: REGION_ID })
            set({ cartId: cart.id, items: [], total: 0, itemCount: 0 })
          }
        } catch {
          const { cart } = await medusa.store.cart.create({ region_id: REGION_ID })
          set({ cartId: cart.id, items: [], total: 0, itemCount: 0 })
        }
      },

      addItem: async (variantId, quantity = 1) => {
        set({ isLoading: true })
        try {
          let { cartId } = get()
          if (!cartId) {
            const { cart: newCart } = await medusa.store.cart.create({ region_id: REGION_ID })
            cartId = newCart.id
            set({ cartId })
          }
          const { cart } = await medusa.store.cart.createLineItem(cartId, {
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
          })
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
```

- [ ] **Commit**

```bash
git add lib/store/cart.ts
git commit -m "feat: Zustand cart store with Medusa v2 + localStorage persist"
```

---

## Task 5: i18n messages — namespace Tienda

**Files:** `messages/es.json`, `messages/en.json`, `messages/fr.json`

- [ ] **Add Tienda namespace to `messages/es.json`** (inside the root JSON object, alongside "Index"):

```json
"Tienda": {
  "page_title": "Tienda",
  "page_subtitle": "Productos profesionales de limpieza e higiene para tu negocio.",
  "breadcrumb_home": "Inicio",
  "breadcrumb_shop": "Tienda",
  "loading": "Cargando productos...",
  "no_products": "No hay productos disponibles.",
  "add_to_cart": "Añadir al carrito",
  "adding": "Añadiendo...",
  "view_product": "Ver producto",
  "select_variant": "Selecciona una opción",
  "cart_title": "Tu carrito",
  "cart_empty": "Tu carrito está vacío",
  "cart_empty_desc": "Explora nuestros productos y añade artículos a tu carrito.",
  "cart_subtotal": "Subtotal",
  "cart_checkout": "Ir al checkout",
  "cart_continue": "Seguir comprando",
  "qty": "Cantidad",
  "checkout_title": "Checkout",
  "checkout_contact": "Información de contacto",
  "checkout_email": "Email",
  "checkout_shipping": "Dirección de envío",
  "checkout_name": "Nombre completo",
  "checkout_address": "Dirección",
  "checkout_city": "Ciudad",
  "checkout_postal": "Código postal",
  "checkout_country": "País",
  "checkout_payment": "Pago",
  "checkout_pay": "Confirmar pedido",
  "checkout_processing": "Procesando...",
  "checkout_test_card": "Tarjeta de prueba: 4242 4242 4242 4242",
  "order_confirmed": "Pedido confirmado",
  "order_confirmed_desc": "Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación.",
  "order_continue": "Volver a la tienda",
  "price_label": "Precio",
  "from_price": "Desde",
  "currency": "EUR"
}
```

- [ ] **Add Tienda namespace to `messages/en.json`**:

```json
"Tienda": {
  "page_title": "Shop",
  "page_subtitle": "Professional cleaning and hygiene products for your business.",
  "breadcrumb_home": "Home",
  "breadcrumb_shop": "Shop",
  "loading": "Loading products...",
  "no_products": "No products available.",
  "add_to_cart": "Add to cart",
  "adding": "Adding...",
  "view_product": "View product",
  "select_variant": "Select an option",
  "cart_title": "Your cart",
  "cart_empty": "Your cart is empty",
  "cart_empty_desc": "Browse our products and add items to your cart.",
  "cart_subtotal": "Subtotal",
  "cart_checkout": "Go to checkout",
  "cart_continue": "Continue shopping",
  "qty": "Qty",
  "checkout_title": "Checkout",
  "checkout_contact": "Contact information",
  "checkout_email": "Email",
  "checkout_shipping": "Shipping address",
  "checkout_name": "Full name",
  "checkout_address": "Address",
  "checkout_city": "City",
  "checkout_postal": "Postal code",
  "checkout_country": "Country",
  "checkout_payment": "Payment",
  "checkout_pay": "Confirm order",
  "checkout_processing": "Processing...",
  "checkout_test_card": "Test card: 4242 4242 4242 4242",
  "order_confirmed": "Order confirmed",
  "order_confirmed_desc": "Your order has been successfully processed. You will receive a confirmation email.",
  "order_continue": "Back to shop",
  "price_label": "Price",
  "from_price": "From",
  "currency": "EUR"
}
```

- [ ] **Add Tienda namespace to `messages/fr.json`**:

```json
"Tienda": {
  "page_title": "Boutique",
  "page_subtitle": "Produits professionnels de nettoyage et d'hygiène pour votre entreprise.",
  "breadcrumb_home": "Accueil",
  "breadcrumb_shop": "Boutique",
  "loading": "Chargement des produits...",
  "no_products": "Aucun produit disponible.",
  "add_to_cart": "Ajouter au panier",
  "adding": "Ajout en cours...",
  "view_product": "Voir le produit",
  "select_variant": "Sélectionner une option",
  "cart_title": "Votre panier",
  "cart_empty": "Votre panier est vide",
  "cart_empty_desc": "Parcourez nos produits et ajoutez des articles à votre panier.",
  "cart_subtotal": "Sous-total",
  "cart_checkout": "Aller au checkout",
  "cart_continue": "Continuer les achats",
  "qty": "Qté",
  "checkout_title": "Checkout",
  "checkout_contact": "Coordonnées",
  "checkout_email": "Email",
  "checkout_shipping": "Adresse de livraison",
  "checkout_name": "Nom complet",
  "checkout_address": "Adresse",
  "checkout_city": "Ville",
  "checkout_postal": "Code postal",
  "checkout_country": "Pays",
  "checkout_payment": "Paiement",
  "checkout_pay": "Confirmer la commande",
  "checkout_processing": "Traitement en cours...",
  "checkout_test_card": "Carte de test: 4242 4242 4242 4242",
  "order_confirmed": "Commande confirmée",
  "order_confirmed_desc": "Votre commande a été traitée avec succès. Vous recevrez un email de confirmation.",
  "order_continue": "Retour à la boutique",
  "price_label": "Prix",
  "from_price": "À partir de",
  "currency": "EUR"
}
```

- [ ] **Commit**

```bash
git add messages/
git commit -m "feat: i18n Tienda namespace (es/en/fr)"
```

---

## Task 6: ProductCard + ProductGrid (Server Components)

**Files:** `components/tienda/ProductCard.tsx`, `components/tienda/ProductGrid.tsx`

- [ ] **Create `components/tienda/ProductCard.tsx`**

```tsx
import Link from "next/link"
import Image from "next/image"

type Props = {
  handle: string
  title: string
  thumbnail: string | null
  minPrice: number | null
  currency: string
  locale: string
}

export function ProductCard({ handle, title, thumbnail, minPrice, currency, locale }: Props) {
  const formattedPrice = minPrice
    ? new Intl.NumberFormat(locale, { style: "currency", currency }).format(minPrice / 100)
    : null

  return (
    <Link
      href={`/${locale}/tienda/${handle}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.transform = "translateY(-3px)"
          el.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)"
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.transform = "translateY(0)"
          el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)"
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "1 / 1", background: "#F3F4F6" }}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
            }}>
              <span style={{ fontSize: 40, opacity: 0.3 }}>■</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "16px 18px 20px" }}>
          <p style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 6,
          }}>
            Grupo Rubio
          </p>
          <h3 style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.3,
            marginBottom: 12,
            letterSpacing: "-0.2px",
          }}>
            {title}
          </h3>
          {formattedPrice && (
            <p style={{ fontSize: 18, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.5px" }}>
              {formattedPrice}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Create `components/tienda/ProductGrid.tsx`**

```tsx
import { ProductCard } from "./ProductCard"

type Product = {
  id: string
  handle: string
  title: string
  thumbnail: string | null
  variants?: Array<{ calculated_price?: { calculated_amount?: number } }>
}

type Props = {
  products: Product[]
  locale: string
}

export function ProductGrid({ products, locale }: Props) {
  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 32px", color: "#9CA3AF" }}>
        <p style={{ fontSize: 16 }}>No hay productos disponibles.</p>
      </div>
    )
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 24,
    }}>
      {products.map((product) => {
        const prices = product.variants
          ?.map((v) => v.calculated_price?.calculated_amount ?? null)
          .filter((p): p is number => p !== null) ?? []
        const minPrice = prices.length > 0 ? Math.min(...prices) : null

        return (
          <ProductCard
            key={product.id}
            handle={product.handle}
            title={product.title}
            thumbnail={product.thumbnail}
            minPrice={minPrice}
            currency="EUR"
            locale={locale}
          />
        )
      })}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add components/tienda/
git commit -m "feat: ProductCard + ProductGrid server components"
```

---

## Task 7: Catalog page /tienda

**Files:** `app/[locale]/tienda/page.tsx`

- [ ] **Create `app/[locale]/tienda/page.tsx`**

```tsx
import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { ProductGrid } from "@/components/tienda/ProductGrid"
import { medusa } from "@/lib/medusa"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID!

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Tienda" })
  return {
    title: `${t("page_title")} — Grupo Rubio`,
    description: t("page_subtitle"),
  }
}

export default async function TiendaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Tienda" })

  let products: Parameters<typeof ProductGrid>[0]["products"] = []
  try {
    const result = await medusa.store.product.list({
      region_id: REGION_ID,
      fields: "+variants.calculated_price",
      limit: 100,
    } as Parameters<typeof medusa.store.product.list>[0])
    products = (result.products ?? []) as typeof products
  } catch {
    products = []
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: "#111827", padding: "100px 32px 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
              {t("breadcrumb_home")}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{t("breadcrumb_shop")}</span>
          </nav>
          <h1 style={{
            fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800, color: "#F9FAFB",
            letterSpacing: "-2px", lineHeight: 1.06, maxWidth: 620, marginBottom: 16,
          }}>
            {t("page_title")}
          </h1>
          <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 480, lineHeight: 1.65 }}>
            {t("page_subtitle")}
          </p>
        </div>
      </div>

      {/* Products */}
      <div style={{ background: "#F9FAFB", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px" }}>
          <ProductGrid products={products} locale={locale} />
        </div>
      </div>

      <Footer />
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/
git commit -m "feat: /tienda catalog page — Server Component"
```

---

## Task 8: ProductGallery + AddToCartButton (Client Components)

**Files:** `components/tienda/ProductGallery.tsx`, `components/tienda/AddToCartButton.tsx`

- [ ] **Create `components/tienda/ProductGallery.tsx`**

```tsx
"use client"

import { useState } from "react"
import Image from "next/image"

type ProductImage = {
  id: string
  url: string
  alt: string | null
}

type Props = {
  images: ProductImage[]
  title: string
}

export function ProductGallery({ images, title }: Props) {
  const [selected, setSelected] = useState(0)

  if (images.length === 0) {
    return (
      <div style={{
        aspectRatio: "1 / 1",
        background: "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
        borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 64, opacity: 0.2 }}>■</span>
      </div>
    )
  }

  return (
    <div>
      {/* Main image */}
      <div style={{
        position: "relative",
        aspectRatio: "1 / 1",
        borderRadius: 8,
        overflow: "hidden",
        background: "#F3F4F6",
        marginBottom: 12,
      }}>
        <Image
          src={images[selected].url}
          alt={images[selected].alt ?? title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelected(i)}
              style={{
                width: 72, height: 72,
                borderRadius: 6,
                overflow: "hidden",
                border: i === selected ? "2px solid #111827" : "2px solid transparent",
                cursor: "pointer",
                padding: 0,
                background: "#F3F4F6",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Image
                src={img.url}
                alt={img.alt ?? title}
                fill
                style={{ objectFit: "cover" }}
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Create `components/tienda/AddToCartButton.tsx`**

```tsx
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
      {/* Variant selector — only show when multiple */}
      {variants.length > 1 && (
        <select
          value={selectedVariantId}
          onChange={(e) => setSelectedVariantId(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            fontSize: 14,
            fontWeight: 500,
            color: "#111827",
            background: "#FFFFFF",
            fontFamily: "inherit",
            cursor: "pointer",
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          width: "100%",
          padding: "15px 28px",
          borderRadius: 8,
          border: "none",
          background: isLoading || !selectedVariantId ? "#D1D5DB" : "#111827",
          color: "#FFFFFF",
          fontSize: 15,
          fontWeight: 700,
          cursor: isLoading || !selectedVariantId ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          transition: "background 0.15s",
        }}
      >
        <ShoppingBag size={17} />
        {isLoading ? labelAdding : labelAdd}
      </button>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add components/tienda/ProductGallery.tsx components/tienda/AddToCartButton.tsx
git commit -m "feat: ProductGallery + AddToCartButton client components"
```

---

## Task 9: Product page /tienda/[handle]

**Files:** `app/[locale]/tienda/[handle]/page.tsx`

- [ ] **Create `app/[locale]/tienda/[handle]/page.tsx`**

```tsx
import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { ProductGallery } from "@/components/tienda/ProductGallery"
import { AddToCartButton } from "@/components/tienda/AddToCartButton"
import { medusa } from "@/lib/medusa"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { notFound } from "next/navigation"

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID!

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { locale, handle } = await params
  const t = await getTranslations({ locale, namespace: "Tienda" })

  let product: MedusaProduct | null = null
  try {
    const result = await medusa.store.product.list({
      handle,
      region_id: REGION_ID,
      fields: "+variants.calculated_price,+images",
    } as Parameters<typeof medusa.store.product.list>[0])
    product = (result.products?.[0] ?? null) as MedusaProduct | null
  } catch {
    product = null
  }

  if (!product) notFound()

  const images = (product.images ?? []).map((img: MedusaImage) => ({
    id: img.id,
    url: img.url,
    alt: product!.title ?? null,
  }))

  const variants = (product.variants ?? []).map((v: MedusaVariant) => ({
    id: v.id,
    title: v.title ?? v.id,
  }))

  const prices = (product.variants ?? [])
    .map((v: MedusaVariant) => v.calculated_price?.calculated_amount ?? null)
    .filter((p): p is number => p !== null)
  const minPrice = prices.length > 0 ? Math.min(...prices) : null
  const formattedPrice = minPrice
    ? new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(minPrice / 100)
    : null

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: "#111827", padding: "80px 32px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href={`/${locale}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
              {t("breadcrumb_home")}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>/</span>
            <Link href={`/${locale}/tienda`} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
              {t("breadcrumb_shop")}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product */}
      <div style={{ background: "#F9FAFB" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <ProductGallery images={images} title={product.title ?? ""} />

            {/* Info */}
            <div style={{ paddingTop: 4 }}>
              <p style={{
                fontSize: 12, fontWeight: 600, color: "#6B7280",
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10,
              }}>
                Grupo Rubio
              </p>
              <h1 style={{
                fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#111827",
                letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 16,
              }}>
                {product.title}
              </h1>

              {formattedPrice && (
                <p style={{ fontSize: 28, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.5px", marginBottom: 24 }}>
                  {formattedPrice}
                </p>
              )}

              {product.description && (
                <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.7, marginBottom: 32 }}>
                  {product.description}
                </p>
              )}

              <AddToCartButton
                variants={variants}
                labelAdd={t("add_to_cart")}
                labelAdding={t("adding")}
                labelSelect={t("select_variant")}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// Local types for Medusa product shape
type MedusaImage = { id: string; url: string }
type MedusaVariant = {
  id: string
  title?: string | null
  calculated_price?: { calculated_amount?: number }
}
type MedusaProduct = {
  id: string
  title?: string | null
  handle: string
  description?: string | null
  thumbnail?: string | null
  images?: MedusaImage[]
  variants?: MedusaVariant[]
}
```

- [ ] **Commit**

```bash
git add app/
git commit -m "feat: product page /tienda/[handle] — Server Component"
```

---

## Task 10: CartButton + CartSidebar

**Files:** `components/tienda/CartButton.tsx`, `components/tienda/CartSidebar.tsx`

- [ ] **Create `components/tienda/CartButton.tsx`**

```tsx
"use client"

import { useEffect } from "react"
import { ShoppingBag } from "lucide-react"
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
      aria-label={`Carrito (${itemCount} items)`}
    >
      <ShoppingBag size={20} />
      {itemCount > 0 && (
        <span style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#16a34a",
          color: "#FFFFFF",
          fontSize: 10,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}>
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  )
}
```

- [ ] **Create `components/tienda/CartSidebar.tsx`**

```tsx
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

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [closeCart])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(amount / 100)

  return (
    <>
      {/* Overlay */}
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

      {/* Drawer */}
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
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
              Tu carrito
            </span>
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
              <p style={{ fontSize: 15, fontWeight: 500 }}>Tu carrito está vacío</p>
              <p style={{ fontSize: 13, lineHeight: 1.5 }}>Explora nuestros productos y añade artículos.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {items.map((item) => (
                <div key={item.id} style={{
                  display: "flex", gap: 14,
                  paddingBottom: 16,
                  borderBottom: "1px solid #F3F4F6",
                }}>
                  {/* Thumbnail */}
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

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.3, marginBottom: 4 }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", marginBottom: 10 }}>
                      {formatPrice(item.unit_price)}
                    </p>

                    {/* Qty controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                        disabled={isLoading}
                        style={{
                          width: 28, height: 28, borderRadius: 6,
                          border: "1px solid #E5E7EB", background: "#FFFFFF",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer",
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
                          cursor: "pointer",
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
```

- [ ] **Commit**

```bash
git add components/tienda/CartButton.tsx components/tienda/CartSidebar.tsx
git commit -m "feat: CartButton + CartSidebar client components"
```

---

## Task 11: Update Navbar + Providers with Cart

**Files:** `components/layout/Navbar.tsx`, `components/providers.tsx`

- [ ] **Update `components/providers.tsx`** to include CartSidebar:

```tsx
'use client';

import { SessionProvider } from "next-auth/react";
import { CartSidebar } from "@/components/tienda/CartSidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <CartSidebar />
    </SessionProvider>
  );
}
```

- [ ] **Update `components/layout/Navbar.tsx`**: Find the existing `ShoppingBag` + "Tienda" link and replace it with `CartButton`. 

  First read the full Navbar file to find the exact block. Then replace the block that renders `ShoppingBag` + "Tienda" text link with the `CartButton` component. Add import at top:

```tsx
import { CartButton } from "@/components/tienda/CartButton"
```

  Find the existing Tienda link in Navbar (it looks like):
```tsx
<Link ... >
  <ShoppingBag size={14} />
  Tienda
</Link>
```

  Replace it with:
```tsx
<Link
  href={`/${locale}/tienda`}
  style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 13, fontWeight: 500,
    color: !showDark && isOnDarkPage ? 'rgba(255,255,255,0.8)' : '#374151',
    textDecoration: 'none',
  }}
>
  <ShoppingBag size={14} />
  Tienda
</Link>
<CartButton />
```

  Note: Read the full Navbar first to get exact surrounding context before editing.

- [ ] **Commit**

```bash
git add components/layout/Navbar.tsx components/providers.tsx
git commit -m "feat: integrate CartButton + CartSidebar into Navbar and Providers"
```

---

## Task 12: Stripe API route

**Files:** `app/api/stripe/payment-intent/route.ts`

- [ ] **Create `app/api/stripe/payment-intent/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
})

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "eur", cartId } = await req.json() as {
      amount: number
      currency?: string
      cartId: string
    }

    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      metadata: { cart_id: cartId },
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
```

- [ ] **Install stripe server package**

```bash
npm install stripe
```

- [ ] **Commit**

```bash
git add app/api/ package.json package-lock.json
git commit -m "feat: Stripe payment intent API route"
```

---

## Task 13: CheckoutForm component

**Files:** `components/tienda/CheckoutForm.tsx`

- [ ] **Create `components/tienda/CheckoutForm.tsx`**

```tsx
"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useCartStore } from "@/lib/store/cart"

type Props = {
  clientSecret: string
  locale: string
  labels: {
    name: string
    email: string
    address: string
    city: string
    postal: string
    country: string
    pay: string
    processing: string
    testCard: string
  }
}

export function CheckoutForm({ labels, locale }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { clearCart } = useCartStore()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postal, setPostal] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    fontSize: 14,
    color: "#111827",
    background: "#FFFFFF",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setIsProcessing(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/tienda/confirmacion`,
        payment_method_data: {
          billing_details: { name, email, address: { line1: address, city, postal_code: postal, country: "ES" } },
        },
      },
    })

    if (error) {
      setErrorMessage(error.message ?? "Error al procesar el pago")
      setIsProcessing(false)
    } else {
      clearCart()
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Contact */}
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
          {labels.email}
        </h2>
        <div>
          <label style={labelStyle}>{labels.email}</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </div>
      </div>

      {/* Shipping */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Dirección de envío</h2>
        <div>
          <label style={labelStyle}>{labels.name}</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{labels.address}</label>
          <input required value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>{labels.city}</label>
            <input required value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{labels.postal}</label>
            <input required value={postal} onChange={(e) => setPostal(e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Pago</h2>
        <div style={{
          padding: 16, border: "1px solid #E5E7EB", borderRadius: 8, background: "#FAFAFA",
        }}>
          <PaymentElement />
        </div>
        <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>{labels.testCard}</p>
      </div>

      {errorMessage && (
        <div style={{
          padding: "12px 16px", borderRadius: 8,
          background: "#FEF2F2", border: "1px solid #FCA5A5",
          fontSize: 14, color: "#DC2626",
        }}>
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        style={{
          padding: "15px 24px",
          borderRadius: 8, border: "none",
          background: isProcessing ? "#D1D5DB" : "#111827",
          color: "#FFFFFF",
          fontSize: 15, fontWeight: 700,
          cursor: isProcessing ? "not-allowed" : "pointer",
          fontFamily: "inherit",
        }}
      >
        {isProcessing ? labels.processing : labels.pay}
      </button>
    </form>
  )
}
```

- [ ] **Commit**

```bash
git add components/tienda/CheckoutForm.tsx
git commit -m "feat: CheckoutForm with Stripe Elements"
```

---

## Task 14: Checkout page

**Files:** `app/[locale]/tienda/checkout/page.tsx`

- [ ] **Create `app/[locale]/tienda/checkout/page.tsx`**

```tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe"
import { useCartStore } from "@/lib/store/cart"
import { CheckoutForm } from "@/components/tienda/CheckoutForm"
import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function CheckoutPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale
  const t = useTranslations("Tienda")
  const router = useRouter()
  const { items, total, cartId } = useCartStore()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      router.push(`/${locale}/tienda`)
      return
    }
    fetch("/api/stripe/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, currency: "eur", cartId }),
    })
      .then((r) => r.json())
      .then((data: { clientSecret?: string; error?: string }) => {
        if (data.error) setError(data.error)
        else if (data.clientSecret) setClientSecret(data.clientSecret)
      })
      .catch(() => setError("Error de conexión"))
  }, [items.length, total, cartId, locale, router])

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(amount / 100)

  const labels = {
    name: t("checkout_name"),
    email: t("checkout_email"),
    address: t("checkout_address"),
    city: t("checkout_city"),
    postal: t("checkout_postal"),
    country: t("checkout_country"),
    pay: t("checkout_pay"),
    processing: t("checkout_processing"),
    testCard: t("checkout_test_card"),
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div style={{ background: "#111827", padding: "80px 32px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href={`/${locale}/tienda`} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
              {t("breadcrumb_shop")}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{t("checkout_title")}</span>
          </nav>
          <h1 style={{
            fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, color: "#F9FAFB",
            letterSpacing: "-1.5px", marginTop: 16,
          }}>
            {t("checkout_title")}
          </h1>
        </div>
      </div>

      <div style={{ background: "#F9FAFB", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
          {error ? (
            <div style={{ color: "#DC2626", fontSize: 15 }}>{error}</div>
          ) : !clientSecret ? (
            <div style={{ color: "#6B7280", fontSize: 15 }}>Preparando el checkout...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
              {/* Form */}
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
                <CheckoutForm clientSecret={clientSecret} locale={locale} labels={labels} />
              </Elements>

              {/* Order summary */}
              <div>
                <div style={{
                  background: "#FFFFFF",
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  padding: "24px",
                  position: "sticky", top: 24,
                }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 20 }}>
                    Resumen del pedido
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {items.map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{item.title}</p>
                          <p style={{ fontSize: 12, color: "#9CA3AF" }}>x{item.quantity}</p>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", flexShrink: 0 }}>
                          {formatPrice(item.total)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: "1px solid #F3F4F6", marginTop: 20, paddingTop: 16, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "#16a34a" }}>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/[locale]/tienda/checkout/
git commit -m "feat: checkout page with Stripe Elements + order summary"
```

---

## Task 15: Confirmation page

**Files:** `app/[locale]/tienda/confirmacion/page.tsx`

- [ ] **Create `app/[locale]/tienda/confirmacion/page.tsx`**

```tsx
import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default async function ConfirmacionPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Tienda" })

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div style={{ background: "#F9FAFB", minHeight: "70vh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "#DCFCE7", margin: "0 auto 24px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CheckCircle size={36} color="#16a34a" />
          </div>
          <h1 style={{
            fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#111827",
            letterSpacing: "-1px", marginBottom: 16,
          }}>
            {t("order_confirmed")}
          </h1>
          <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.65, marginBottom: 32 }}>
            {t("order_confirmed_desc")}
          </p>
          <Link
            href={`/${locale}/tienda`}
            style={{
              display: "inline-flex", alignItems: "center",
              padding: "13px 28px", borderRadius: 8,
              background: "#111827", color: "#FFFFFF",
              fontSize: 14, fontWeight: 700, textDecoration: "none",
            }}
          >
            {t("order_continue")}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/[locale]/tienda/confirmacion/
git commit -m "feat: order confirmation page"
```

---

## Task 16: Verify + smoke test

- [ ] **Start the dev server** (if not already running):

```bash
cd C:/Users/Ayoub/Proyectos/gruporubio-web
npm run dev
```

- [ ] **Verify Medusa is running** on port 9000:

```bash
curl http://localhost:9000/health
```

Expected: `OK`

- [ ] **Open http://localhost:3000/es/tienda** — should show product grid with 4 products from Medusa seed

- [ ] **Click a product** — should navigate to `/es/tienda/t-shirt` with gallery and Add to Cart button

- [ ] **Add to cart** — CartSidebar should open, item should appear, badge on Navbar icon should show "1"

- [ ] **Close and reopen browser tab** — cart should still have the item (localStorage persist)

- [ ] **Navigate to checkout** — should show form + Stripe Elements (only if STRIPE keys are filled in .env.local)

- [ ] **Final commit**

```bash
git add -A
git commit -m "feat: /tienda complete — catalog, product, cart, checkout + Stripe test mode"
```

---

## Notes

- **Stripe keys**: Must be filled in `.env.local` before checkout works. Get from https://dashboard.stripe.com/test/apikeys
- **Medusa must be running**: On port 9000 via `node node_modules/@medusajs/cli/cli.js develop` in `gruporubio-medusa`
- **Image optimization**: Medusa seed products use Unsplash URLs. Real product images will be served from `localhost:9000/uploads/` — already added to `remotePatterns`
- **TypeScript**: The Medusa SDK types are loose in v2 — casts to `as` are intentional to avoid excessive generics
