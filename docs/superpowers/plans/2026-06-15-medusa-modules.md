# Medusa Modules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir los 6 módulos oficiales de Medusa al backend (gruporubio-medusa) para dejar la tienda lista para producción: Redis (caché + eventos), S3 (archivos), Resend (notificaciones), MeiliSearch (búsqueda), PayPal (pago), Google OAuth (auth).

**Architecture:** Cada fase modifica `medusa-config.ts` (gruporubio-medusa) para registrar el módulo, añade variables de entorno a `.env` y verifica el funcionamiento. Las fases 5 y 6 requieren además cambios en el frontend (gruporubio-web). Cada fase es independiente y desplegable por separado.

**Tech Stack:** Medusa 2.13.6, Redis 7, AWS S3 / Cloudflare R2, Resend, MeiliSearch, PayPal REST API, Google OAuth 2.0, Next.js 16 App Router.

**Repos involucrados:**
- Backend: `C:\Users\Ayoub\Proyectos\gruporubio-medusa`
- Frontend: `C:\Users\Ayoub\Proyectos\gruporubio-web`

---

## Mapa de archivos

| Archivo | Qué cambia |
|---|---|
| `gruporubio-medusa/medusa-config.ts` | Se edita en cada fase para registrar el nuevo módulo |
| `gruporubio-medusa/.env` | Variables de entorno nuevas por fase |
| `gruporubio-medusa/src/subscribers/order-placed.ts` | **Nuevo** — envía email de confirmación de pedido (Fase 3) |
| `gruporubio-medusa/src/subscribers/order-shipped.ts` | **Nuevo** — email de envío (Fase 3) |
| `gruporubio-web/components/tienda/CheckoutForm.tsx` | Añade selector de método de pago + PayPal (Fase 5) |
| `gruporubio-web/app/[locale]/cuenta/page.tsx` | **Nuevo** — página de login con Google (Fase 6) |
| `gruporubio-web/components/tienda/CartSidebar.tsx` | Añade botón "Iniciar sesión" si hay cuenta (Fase 6) |

---

## Fase 1: Redis — Caché + Bus de Eventos

> Ambos módulos comparten la misma instancia Redis. Se hacen juntos.

### Task 1: Instalar paquetes Redis

**Files:**
- Modify: `gruporubio-medusa/package.json` (via npm install)

- [ ] **Step 1: Instalar los dos paquetes**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-medusa
npm install @medusajs/event-bus-redis@2.13.6 @medusajs/cache-redis@2.13.6
```

Resultado esperado: ambos paquetes aparecen en `dependencies` de `package.json`.

- [ ] **Step 2: Verificar instalación**

```bash
cat package.json | grep -E "event-bus-redis|cache-redis"
```

Resultado esperado:
```
"@medusajs/cache-redis": "2.13.6",
"@medusajs/event-bus-redis": "2.13.6",
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(medusa): instala event-bus-redis y cache-redis"
```

---

### Task 2: Configurar módulos Redis en medusa-config.ts

**Files:**
- Modify: `gruporubio-medusa/medusa-config.ts`
- Modify: `gruporubio-medusa/.env`

- [ ] **Step 1: Añadir REDIS_URL al .env**

Abrir `gruporubio-medusa/.env` y añadir:

```
REDIS_URL=redis://localhost:6379
```

> Si Redis corre en Docker o en otro host, ajustar la URL.

- [ ] **Step 2: Actualizar medusa-config.ts**

Reemplazar el contenido de `gruporubio-medusa/medusa-config.ts`:

```typescript
import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "./src/modules/solicitud",
    },
    {
      key: Modules.EVENT_BUS,
      resolve: "@medusajs/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      key: Modules.CACHE,
      resolve: "@medusajs/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
  ],
})
```

- [ ] **Step 3: Verificar que el servidor arranca**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-medusa
npm run dev
```

Resultado esperado: el servidor arranca en `:9000` sin errores. En los logs debe aparecer algo como `[EventBus] Redis connection established`.

- [ ] **Step 4: Commit**

```bash
git add medusa-config.ts .env
git commit -m "feat(medusa): configura event-bus-redis y cache-redis"
```

---

## Fase 2: Almacenamiento de Archivos — S3 / Cloudflare R2

### Task 3: Instalar y configurar file-s3

**Files:**
- Modify: `gruporubio-medusa/medusa-config.ts`
- Modify: `gruporubio-medusa/.env`

- [ ] **Step 1: Instalar paquete**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-medusa
npm install @medusajs/file-s3@2.13.6
```

- [ ] **Step 2: Añadir variables al .env**

Para **Cloudflare R2** (recomendado, más barato que S3):
```
S3_FILE_URL=https://<account-id>.r2.cloudflarestorage.com/<bucket>
S3_ACCESS_KEY_ID=<r2-access-key>
S3_SECRET_ACCESS_KEY=<r2-secret-key>
S3_REGION=auto
S3_BUCKET=gruporubio-media
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
```

Para **AWS S3**:
```
S3_FILE_URL=https://<bucket>.s3.<region>.amazonaws.com
S3_ACCESS_KEY_ID=<aws-access-key>
S3_SECRET_ACCESS_KEY=<aws-secret-key>
S3_REGION=eu-west-1
S3_BUCKET=gruporubio-media
# S3_ENDPOINT no se pone para AWS nativo
```

- [ ] **Step 3: Actualizar medusa-config.ts** (añadir dentro del array `modules`):

```typescript
    {
      key: Modules.FILE,
      resolve: "@medusajs/file-s3",
      options: {
        file_url: process.env.S3_FILE_URL,
        access_key_id: process.env.S3_ACCESS_KEY_ID,
        secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION,
        bucket: process.env.S3_BUCKET,
        endpoint: process.env.S3_ENDPOINT, // omitir para AWS S3 nativo
      },
    },
```

- [ ] **Step 4: Verificar — subir imagen de prueba desde el admin**

1. Arrancar `npm run dev`
2. Abrir `http://localhost:9000/app`
3. Ir a un producto → editar imagen
4. Subir cualquier imagen
5. Verificar que la URL de la imagen sea del bucket S3/R2 (no `localhost`)

- [ ] **Step 5: Commit**

```bash
git add medusa-config.ts package.json package-lock.json
git commit -m "feat(medusa): configura file-s3 para almacenamiento de imágenes en producción"
```

---

## Fase 3: Notificaciones por Email — Resend

### Task 4: Instalar notification-resend

**Files:**
- Modify: `gruporubio-medusa/medusa-config.ts`
- Modify: `gruporubio-medusa/.env`
- Create: `gruporubio-medusa/src/subscribers/order-placed.ts`
- Create: `gruporubio-medusa/src/subscribers/order-shipped.ts`

- [ ] **Step 1: Instalar paquete**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-medusa
npm install @medusajs/notification-resend@2.13.6
```

- [ ] **Step 2: Crear cuenta Resend y obtener API key**

1. Ir a https://resend.com → crear cuenta gratuita
2. Crear API key con permisos de envío
3. Verificar el dominio `gruporubio.es` (añadir registros DNS que indique Resend)

- [ ] **Step 3: Añadir variables al .env**

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=pedidos@gruporubio.es
```

- [ ] **Step 4: Registrar módulo en medusa-config.ts** (añadir dentro del array `modules`):

```typescript
    {
      key: Modules.NOTIFICATION,
      resolve: "@medusajs/notification-resend",
      options: {
        channels: ["email"],
        api_key: process.env.RESEND_API_KEY,
        from: process.env.RESEND_FROM_EMAIL,
      },
    },
```

- [ ] **Step 5: Crear subscriber para pedido confirmado**

Crear `gruporubio-medusa/src/subscribers/order-placed.ts`:

```typescript
import {
  type SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework"
import { INotificationModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService: INotificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )

  const orderService = container.resolve(Modules.ORDER)
  const order = await orderService.retrieveOrder(data.id, {
    relations: ["items", "shipping_address"],
  })

  await notificationService.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-placed",
    data: {
      order_id: order.id,
      display_id: order.display_id,
      items: order.items?.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: (item.unit_price / 100).toFixed(2),
      })),
      total: (order.total / 100).toFixed(2),
      shipping_address: order.shipping_address,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
```

- [ ] **Step 6: Crear subscriber para pedido enviado**

Crear `gruporubio-medusa/src/subscribers/order-shipped.ts`:

```typescript
import {
  type SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework"
import { INotificationModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function orderShippedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService: INotificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )

  const orderService = container.resolve(Modules.ORDER)
  const order = await orderService.retrieveOrder(data.id, {
    relations: ["shipping_address"],
  })

  await notificationService.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-shipped",
    data: {
      order_id: order.id,
      display_id: order.display_id,
      shipping_address: order.shipping_address,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
}
```

> **Nota:** Los templates `order-placed` y `order-shipped` se crean en el dashboard de Resend (https://resend.com/emails). Para simplificar, Resend también admite HTML inline en el campo `template` si prefieres no usar el dashboard.

- [ ] **Step 7: Build para verificar tipos**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-medusa
npm run build
```

Resultado esperado: build sin errores.

- [ ] **Step 8: Verificar — crear pedido de prueba**

1. Completar un checkout en la tienda con un email real tuyo
2. Revisar que llega email de confirmación
3. Desde el admin (`:9000/app`) → marcar pedido como enviado → verificar que llega email de envío

- [ ] **Step 9: Commit**

```bash
git add medusa-config.ts package.json package-lock.json src/subscribers/order-placed.ts src/subscribers/order-shipped.ts
git commit -m "feat(medusa): notificaciones por email con Resend para pedidos confirmados y enviados"
```

---

## Fase 4: Búsqueda — MeiliSearch

### Task 5: Instalar y configurar search-meilisearch

**Files:**
- Modify: `gruporubio-medusa/medusa-config.ts`
- Modify: `gruporubio-medusa/.env`

- [ ] **Step 1: Instalar MeiliSearch localmente (dev)**

```bash
# Con Docker (recomendado):
docker run -d -p 7700:7700 --name meilisearch getmeili/meilisearch:latest
```

O descargar el binario desde https://github.com/meilisearch/meilisearch/releases

- [ ] **Step 2: Instalar paquete**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-medusa
npm install @medusajs/search-meilisearch@2.13.6
```

- [ ] **Step 3: Añadir variables al .env**

```
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=masterKey
```

- [ ] **Step 4: Registrar módulo en medusa-config.ts** (añadir dentro del array `modules`):

```typescript
    {
      key: Modules.INDEX,
      resolve: "@medusajs/search-meilisearch",
      options: {
        config: {
          host: process.env.MEILISEARCH_HOST!,
          apiKey: process.env.MEILISEARCH_API_KEY,
        },
        settings: {
          products: {
            indexSettings: {
              searchableAttributes: ["title", "description", "handle"],
              displayedAttributes: ["id", "title", "handle", "description", "thumbnail"],
            },
            primaryKey: "id",
          },
        },
      },
    },
```

- [ ] **Step 5: Verificar indexación**

1. Arrancar `npm run dev`
2. Abrir `http://localhost:7700` (interfaz web de MeiliSearch)
3. Verificar que existe el índice `products` con los productos del seed

- [ ] **Step 6: Commit**

```bash
git add medusa-config.ts package.json package-lock.json
git commit -m "feat(medusa): integra MeiliSearch para indexación de productos"
```

---

## Fase 5: Pago — PayPal

### Task 6: Backend — instalar payment-paypal

**Files:**
- Modify: `gruporubio-medusa/medusa-config.ts`
- Modify: `gruporubio-medusa/.env`

- [ ] **Step 1: Crear app en PayPal Developer**

1. Ir a https://developer.paypal.com → crear cuenta sandbox
2. Crear nueva App → obtener `Client ID` y `Secret`
3. Anotar si es sandbox o producción

- [ ] **Step 2: Instalar paquete**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-medusa
npm install @medusajs/payment-paypal@2.13.6
```

- [ ] **Step 3: Añadir variables al .env**

```
PAYPAL_CLIENT_ID=<tu-client-id>
PAYPAL_CLIENT_SECRET=<tu-client-secret>
PAYPAL_SANDBOX=true
# En producción: PAYPAL_SANDBOX=false
```

- [ ] **Step 4: Registrar módulo en medusa-config.ts** (añadir dentro del array `modules`):

```typescript
    {
      key: Modules.PAYMENT,
      resolve: "@medusajs/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_SECRET_KEY,
            },
          },
          {
            resolve: "@medusajs/payment-paypal",
            id: "paypal",
            options: {
              clientId: process.env.PAYPAL_CLIENT_ID,
              clientSecret: process.env.PAYPAL_CLIENT_SECRET,
              sandbox: process.env.PAYPAL_SANDBOX === "true",
            },
          },
        ],
      },
    },
```

> **Nota:** Si el módulo PAYMENT ya estaba configurado solo con Stripe, reemplazar esa entrada con esta que incluye ambos providers.

- [ ] **Step 5: Activar PayPal en la región desde el admin**

1. Abrir `http://localhost:9000/app`
2. Ir a Settings → Regions → región España
3. En Payment Providers → activar PayPal
4. Guardar

- [ ] **Step 6: Commit**

```bash
git add medusa-config.ts package.json package-lock.json
git commit -m "feat(medusa): añade PayPal como proveedor de pago"
```

---

### Task 7: Frontend — selector de método de pago en checkout

**Files:**
- Modify: `gruporubio-web/components/tienda/CheckoutForm.tsx`
- Modify: `gruporubio-web/app/[locale]/tienda/checkout/page.tsx`

- [ ] **Step 1: Instalar SDK PayPal para React**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-web
npm install @paypal/react-paypal-js
```

- [ ] **Step 2: Añadir NEXT_PUBLIC_PAYPAL_CLIENT_ID al .env.local**

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<mismo-client-id-que-en-medusa>
```

- [ ] **Step 3: Actualizar checkout/page.tsx para pasar el método de pago seleccionado**

En `gruporubio-web/app/[locale]/tienda/checkout/page.tsx`, añadir la importación del Provider de PayPal al layout:

```tsx
import { PayPalScriptProvider } from "@paypal/react-paypal-js"

// Envolver el contenido de la página con el provider:
<PayPalScriptProvider options={{
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  currency: "EUR",
  intent: "capture",
}}>
  {/* contenido actual de la página */}
</PayPalScriptProvider>
```

- [ ] **Step 4: Actualizar CheckoutForm.tsx para mostrar selector de método de pago**

En `gruporubio-web/components/tienda/CheckoutForm.tsx`, añadir estado de método de pago y condicional:

```tsx
"use client"
import { useState } from "react"
import { PayPalButtons } from "@paypal/react-paypal-js"

// Dentro del componente, añadir antes del botón de pago:
const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe")

// Selector de método:
<div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
  {(["stripe", "paypal"] as const).map((method) => (
    <button
      key={method}
      type="button"
      onClick={() => setPaymentMethod(method)}
      style={{
        flex: 1,
        padding: "12px",
        border: paymentMethod === method ? "2px solid #2563EB" : "1px solid #E5E7EB",
        borderRadius: 8,
        background: paymentMethod === method ? "#EFF6FF" : "#FFFFFF",
        fontWeight: 600,
        fontSize: 14,
        color: paymentMethod === method ? "#1D4ED8" : "#374151",
        cursor: "pointer",
      }}
    >
      {method === "stripe" ? "💳 Tarjeta" : "🅿️ PayPal"}
    </button>
  ))}
</div>

{/* Condicional: mostrar Stripe Elements o PayPal Buttons */}
{paymentMethod === "stripe" ? (
  // bloque actual con PaymentElement de Stripe
  <PaymentElement />
) : (
  <PayPalButtons
    style={{ layout: "vertical", color: "blue", shape: "rect" }}
    createOrder={async () => {
      // Llamar a la API de Medusa para crear la sesión de pago PayPal
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId }),
      })
      const data = await res.json()
      return data.orderId
    }}
    onApprove={async (data) => {
      await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderID, cartId }),
      })
      router.push(`/${locale}/tienda/confirmacion`)
    }}
  />
)}
```

- [ ] **Step 5: Crear rutas API para PayPal en el frontend**

Crear `gruporubio-web/app/api/paypal/create-order/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server"
import { medusa } from "@/lib/medusa"

export async function POST(req: NextRequest) {
  try {
    const { cartId } = await req.json()
    const { payment_collection } = await medusa.store.payment.initiatePaymentSession(
      cartId,
      { provider_id: "pp_paypal_paypal" }
    )
    return NextResponse.json({
      orderId: (payment_collection as { data?: { id?: string } }).data?.id ?? "",
    })
  } catch (error) {
    return NextResponse.json({ error: "Error creando orden PayPal" }, { status: 500 })
  }
}
```

Crear `gruporubio-web/app/api/paypal/capture-order/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server"
import { medusa } from "@/lib/medusa"

export async function POST(req: NextRequest) {
  try {
    const { cartId } = await req.json()
    await medusa.store.cart.complete(cartId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error capturando pago" }, { status: 500 })
  }
}
```

- [ ] **Step 6: Build y verificar tipos**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-web
npm run build
```

- [ ] **Step 7: Probar checkout con PayPal sandbox**

1. Arrancar `npm run dev`
2. Añadir producto al carrito → ir al checkout
3. Seleccionar PayPal → completar con cuenta sandbox de PayPal
4. Verificar redirección a `/tienda/confirmacion`

- [ ] **Step 8: Commit**

```bash
# En gruporubio-web:
git add components/tienda/CheckoutForm.tsx app/[locale]/tienda/checkout/page.tsx app/api/paypal package.json package-lock.json .env.local
git commit -m "feat(tienda): integra PayPal como método de pago alternativo a Stripe"
```

---

## Fase 6: Autenticación Social — Google OAuth

### Task 8: Backend — auth-google

**Files:**
- Modify: `gruporubio-medusa/medusa-config.ts`
- Modify: `gruporubio-medusa/.env`

- [ ] **Step 1: Crear credenciales OAuth en Google Cloud Console**

1. Ir a https://console.cloud.google.com → crear proyecto o usar uno existente
2. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URIs: `http://localhost:9000/auth/google/callback` (dev) y `https://tu-dominio.com/auth/google/callback` (prod)
5. Copiar Client ID y Client Secret

- [ ] **Step 2: Instalar paquete**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-medusa
npm install @medusajs/auth-google@2.13.6
```

- [ ] **Step 3: Añadir variables al .env**

```
GOOGLE_CLIENT_ID=<tu-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<tu-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:9000/auth/google/callback
```

- [ ] **Step 4: Registrar provider en medusa-config.ts** (añadir dentro del array `modules`):

```typescript
    {
      key: Modules.AUTH,
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
          },
          {
            resolve: "@medusajs/auth-google",
            id: "google",
            options: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              callbackUrl: process.env.GOOGLE_CALLBACK_URL,
            },
          },
        ],
      },
    },
```

- [ ] **Step 5: Verificar que el endpoint OAuth responde**

```bash
# Con el servidor arrancado:
curl http://localhost:9000/auth/customer/google
```

Resultado esperado: redirección a accounts.google.com (302) o URL de Google OAuth en la respuesta.

- [ ] **Step 6: Commit**

```bash
git add medusa-config.ts package.json package-lock.json
git commit -m "feat(medusa): añade Google OAuth como proveedor de autenticación"
```

---

### Task 9: Frontend — botón "Entrar con Google"

**Files:**
- Create: `gruporubio-web/app/[locale]/cuenta/page.tsx`
- Modify: `gruporubio-web/components/layout/Navbar.tsx`

- [ ] **Step 1: Crear página de cuenta**

Crear `gruporubio-web/app/[locale]/cuenta/page.tsx`:

```tsx
"use client"
import { Navbar } from "@/components/layout/Navbar"
import Footer from "@/components/sections/Footer"
import { useParams } from "next/navigation"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

export default function CuentaPage() {
  const { locale } = useParams<{ locale: string }>()

  const handleGoogleLogin = () => {
    window.location.href = `${MEDUSA_URL}/auth/customer/google?redirectUrl=${window.location.origin}/${locale}/cuenta/callback`
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div style={{ background: "#111827", padding: "120px 32px 80px" }}>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#F9FAFB",
            letterSpacing: "-1.5px", marginBottom: 12,
          }}>
            Mi cuenta
          </h1>
          <p style={{ fontSize: 15, color: "#9CA3AF", marginBottom: 40 }}>
            Accede para ver tus pedidos y datos de envío.
          </p>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              gap: 12, padding: "14px 24px",
              background: "#FFFFFF", border: "1px solid #E5E7EB",
              borderRadius: 8, fontSize: 15, fontWeight: 600, color: "#111827",
              cursor: "pointer",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar con Google
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Crear página de callback**

Crear `gruporubio-web/app/[locale]/cuenta/callback/page.tsx`:

```tsx
"use client"
import { useEffect } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"

export default function OAuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale } = useParams<{ locale: string }>()

  useEffect(() => {
    const token = searchParams.get("access_token")
    if (token) {
      localStorage.setItem("medusa_customer_token", token)
      router.replace(`/${locale}/cuenta`)
    } else {
      router.replace(`/${locale}/cuenta?error=auth_failed`)
    }
  }, [searchParams, router, locale])

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <p style={{ color: "#6B7280" }}>Autenticando...</p>
    </div>
  )
}
```

- [ ] **Step 3: Añadir enlace "Mi cuenta" en la Navbar**

En `gruporubio-web/components/layout/Navbar.tsx`, añadir junto al `CartButton`:

```tsx
import Link from "next/link"
import { User } from "lucide-react"

// Junto al CartButton:
<Link
  href={`/${locale}/cuenta`}
  style={{
    display: "flex", alignItems: "center", gap: 6,
    color: "#9CA3AF", fontSize: 13, fontWeight: 500,
    textDecoration: "none",
  }}
>
  <User size={16} />
  Mi cuenta
</Link>
```

- [ ] **Step 4: Build y verificar**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-web
npm run build
```

- [ ] **Step 5: Probar flujo completo**

1. `npm run dev`
2. Ir a `/cuenta` → verificar que aparece el botón de Google
3. Hacer clic → verificar que redirige a Google OAuth
4. Completar login → verificar que vuelve a `/cuenta` con token guardado

- [ ] **Step 6: Commit**

```bash
git add app/[locale]/cuenta components/layout/Navbar.tsx
git commit -m "feat(tienda): página de cuenta con login via Google OAuth"
```

---

## Resumen de variables de entorno por fase

```bash
# Fase 1 — Redis
REDIS_URL=redis://localhost:6379

# Fase 2 — S3 (Cloudflare R2)
S3_FILE_URL=https://<account-id>.r2.cloudflarestorage.com/<bucket>
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=auto
S3_BUCKET=gruporubio-media
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

# Fase 3 — Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=pedidos@gruporubio.es

# Fase 4 — MeiliSearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=masterKey

# Fase 5 — PayPal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_SANDBOX=true
NEXT_PUBLIC_PAYPAL_CLIENT_ID=  # (en gruporubio-web/.env.local)

# Fase 6 — Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:9000/auth/google/callback
```

---

## Checklist de verificación final

- [ ] Redis arranca y los logs de Medusa muestran conexión establecida
- [ ] Imágenes subidas desde el admin tienen URL de S3/R2 (no localhost)
- [ ] Email de confirmación llega al hacer un pedido de prueba
- [ ] El índice `products` aparece en MeiliSearch con los productos del catálogo
- [ ] PayPal aparece como opción en el checkout y procesa pagos sandbox
- [ ] El botón "Entrar con Google" redirige correctamente al OAuth de Google
