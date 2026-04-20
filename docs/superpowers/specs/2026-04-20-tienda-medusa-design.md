# Spec: /tienda — Tienda Medusa + Stripe

**Fecha:** 2026-04-20  
**Estado:** Aprobado  

---

## Objetivo

Añadir una sección `/tienda` al proyecto Next.js `gruporubio-web` conectada al backend Medusa v2 en `http://localhost:9000`. Catálogo de productos de limpieza e higiene, ficha de producto, carrito persistente y checkout con Stripe en modo test.

---

## Stack

- **Frontend**: Next.js 16 App Router, React 19, TypeScript
- **SDK**: `@medusajs/js-sdk` — instancia única en `lib/medusa.ts`
- **Estado carrito**: Zustand + `persist` middleware (localStorage key: `medusa_cart_id`)
- **Pagos**: Stripe test mode — `@stripe/stripe-js` + `@stripe/react-stripe-js`
- **i18n**: next-intl — namespace `Tienda` en es/en/fr
- **Design system**: Plus Jakarta Sans, `#111827` header, cards blancas, border-radius max 8px

---

## Rutas

```
app/[locale]/tienda/
├── page.tsx              # Catálogo (Server Component)
├── [handle]/
│   └── page.tsx          # Ficha de producto (Server Component)
└── checkout/
    └── page.tsx          # Checkout (Client Component)
```

---

## Componentes

```
components/tienda/
├── ProductGrid.tsx         # Server — grid de tarjetas
├── ProductCard.tsx         # Server — tarjeta individual
├── ProductGallery.tsx      # Client — switcher de imágenes
├── AddToCartButton.tsx     # Client — añade al carrito Zustand
├── CartSidebar.tsx         # Client — drawer derecha
├── CartButton.tsx          # Client — icono + badge en Navbar
└── CheckoutForm.tsx        # Client — Stripe Elements

lib/
├── medusa.ts               # MedusaClient singleton
└── store/cart.ts           # Zustand store con persist
```

---

## Flujo de datos

### Catálogo
1. `page.tsx` llama `medusa.store.product.list()` en servidor
2. Pasa productos a `ProductGrid` → `ProductCard`
3. Sin estado cliente, HTML estático con SEO

### Producto individual
1. `page.tsx` llama `medusa.store.product.retrieve(handle)` en servidor
2. `ProductGallery` es `use client` solo para el switcher de imagen
3. `AddToCartButton` es `use client` — llama al store Zustand

### Carrito
1. Al montar `CartSidebar`, Zustand hydrata desde localStorage
2. Si hay `cart_id`: GET Medusa para estado actual
3. Si no: POST `/store/carts` → guardar ID en localStorage
4. Añadir/quitar items: POST/DELETE `/store/carts/{id}/line-items`

### Checkout
1. `CheckoutForm` obtiene `cart_id` desde Zustand
2. POST `/store/carts/{id}/payment-sessions` → Medusa crea Payment Intent
3. Stripe Elements renderiza con `clientSecret`
4. `stripe.confirmPayment()` → confirmación
5. POST `/store/carts/{id}/complete` → pedido creado en Medusa

---

## Variables de entorno

```env
# .env.local (gruporubio-web)
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## i18n

Namespace `Tienda` añadido a `messages/es.json`, `en.json`, `fr.json`:
- Títulos de página, breadcrumbs
- Labels del carrito (vacío, subtotal, checkout)
- Labels del checkout (formulario, confirmación)
- Estados (añadiendo, procesando pago...)

---

## UI / Design

- Header oscuro `#111827` con breadcrumb — igual que `/servicios`
- Grid productos: 3 col desktop / 2 tablet / 1 mobile
- Cards: fondo blanco, sombra `0 1px 3px rgba(0,0,0,0.08)`, hover `translateY(-2px)` + sombra más intensa
- Precio en verde `#16a34a`
- CartSidebar: drawer 400px desde derecha, overlay `rgba(0,0,0,0.4)`
- Checkout: 2 columnas — resumen izquierda, Stripe Elements derecha
- Tarjeta test Stripe: `4242 4242 4242 4242`

---

## Nuevas dependencias

```
@medusajs/js-sdk
zustand
@stripe/stripe-js
@stripe/react-stripe-js
```

---

## Fuera de scope (v1)

- Autenticación de cliente / cuenta de usuario
- Filtros y búsqueda en catálogo
- Gestión de devoluciones
- Emails transaccionales
- Pagos en producción (Stripe live keys)
