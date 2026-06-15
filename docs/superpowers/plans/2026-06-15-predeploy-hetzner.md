# Pre-Deploy Hetzner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar ambos repos listos para desplegar en un VPS Hetzner con un solo `docker compose up -d`.

**Architecture:** Docker Compose con 5 servicios (Postgres, Redis, Medusa, Next.js, Nginx). Nginx actúa de reverse proxy: `gruporubio.es` → Next.js :3000, `api.gruporubio.es` → Medusa :9000. Cada repo tiene su propio Dockerfile multistage. Las variables de entorno se pasan por archivos `.env` en el servidor.

**Tech Stack:** Docker 25+, Docker Compose v2, Nginx, Node.js 20 Alpine, Postgres 16, Redis 7.

**Repos involucrados:**
- Frontend: `C:\Users\Ayoub\Proyectos\gruporubio-web`
- Backend: `C:\Users\Ayoub\Proyectos\gruporubio-medusa`

---

## Mapa de archivos

| Archivo | Qué hace |
|---|---|
| `gruporubio-web/.dockerignore` | **Nuevo** — excluye node_modules, .env, .next del contexto de build |
| `gruporubio-web/Dockerfile` | **Nuevo** — build multistage de Next.js |
| `gruporubio-medusa/.dockerignore` | **Nuevo** — excluye node_modules, .env del contexto de build |
| `gruporubio-medusa/Dockerfile` | **Nuevo** — build de Medusa backend |
| `gruporubio-medusa/src/scripts/seed.ts` | **Modificar** — reemplazar productos demo por catálogo de Grupo Rubio |
| `deploy/docker-compose.yml` | **Nuevo** — orquestación de los 5 servicios (en gruporubio-web) |
| `deploy/nginx/gruporubio.conf` | **Nuevo** — config Nginx para web + api |
| `deploy/.env.web.template` | **Nuevo** — plantilla de variables para Next.js en producción |
| `deploy/.env.medusa.template` | **Nuevo** — plantilla de variables para Medusa en producción |

---

## Task 1: Limpiar el repo web

**Files:**
- Delete: `gruporubio-web/.ai-variants/` (carpeta completa — 50+ archivos sin trackear)

- [ ] **Step 1: Borrar carpeta .ai-variants/**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-web
rm -rf .ai-variants/
```

- [ ] **Step 2: Verificar que git ya no la lista como untracked**

```bash
git status --short | grep ai-variants
```

Resultado esperado: sin output (carpeta eliminada).

- [ ] **Step 3: Añadir .ai-variants al .gitignore**

Leer `.gitignore` y añadir al final:

```
# Carpetas temporales de trabajo con IA
.ai-variants/
preview-variantes/
_variants/
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: elimina carpeta .ai-variants y la añade al .gitignore"
```

---

## Task 2: Verificar build de producción en ambos repos

- [ ] **Step 1: Build del frontend**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-web
npm run build
```

Resultado esperado: build completado sin errores. Si hay errores de tipos, corrígelos antes de continuar.

- [ ] **Step 2: Build del backend**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-medusa
npm run build
```

Resultado esperado: build completado sin errores.

- [ ] **Step 3: Commit si hubo fixes**

Si el build reveló errores y los corregiste:

```bash
# En el repo correspondiente:
git add -u
git commit -m "fix: corrige errores de build de producción"
```

Si el build fue limpio a la primera, no hay nada que commitear.

---

## Task 3: Plantillas de variables de entorno para producción

**Files:**
- Create: `gruporubio-web/deploy/.env.web.template`
- Create: `gruporubio-web/deploy/.env.medusa.template`

- [ ] **Step 1: Crear carpeta deploy**

```bash
mkdir -p C:\Users\Ayoub\Proyectos\gruporubio-web\deploy\nginx
```

- [ ] **Step 2: Crear .env.web.template**

Crear `gruporubio-web/deploy/.env.web.template`:

```bash
# ============================================================
# gruporubio-web — Variables de producción
# Copiar a .env.web en el VPS y rellenar los valores
# ============================================================

# Medusa backend (en el mismo VPS)
NEXT_PUBLIC_MEDUSA_URL=https://api.gruporubio.es
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=        # Obtener desde admin Medusa → Settings → API Keys
NEXT_PUBLIC_MEDUSA_REGION_ID=              # Obtener desde admin Medusa → Settings → Regions

# Stripe (usar claves de PRODUCCIÓN, no test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=              # Client ID de producción en developer.paypal.com

# Chatbot Ignacio
ANTHROPIC_API_KEY=

# Email (formularios de contacto y presupuesto)
SMTP_HOST=smtp.gruporubio.net
SMTP_PORT=587
SMTP_USER=administracion@gruporubio.net
SMTP_PASS=
CONTACT_EMAIL=administracion@gruporubio.net

# URL base de la web
NEXT_PUBLIC_SITE_URL=https://gruporubio.es
```

- [ ] **Step 3: Crear .env.medusa.template**

Crear `gruporubio-web/deploy/.env.medusa.template`:

```bash
# ============================================================
# gruporubio-medusa — Variables de producción
# Copiar a .env.medusa en el VPS y rellenar los valores
# ============================================================

# Base de datos (Postgres en el mismo compose)
DATABASE_URL=postgres://medusa:CAMBIA_ESTA_CONTRASEÑA@postgres:5432/gruporubio_medusa

# Redis (en el mismo compose)
REDIS_URL=redis://redis:6379

# URLs permitidas (ajustar al dominio real)
STORE_CORS=https://gruporubio.es
ADMIN_CORS=https://api.gruporubio.es
AUTH_CORS=https://gruporubio.es,https://api.gruporubio.es

# Secretos JWT (generar con: openssl rand -hex 32)
JWT_SECRET=GENERAR_CON_OPENSSL
COOKIE_SECRET=GENERAR_CON_OPENSSL

# Stripe
STRIPE_SECRET_KEY=sk_live_...

# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_SANDBOX=false

# Resend (email de pedidos)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=pedidos@gruporubio.es

# S3 / Cloudflare R2 (imágenes de productos)
S3_FILE_URL=https://TU_ACCOUNT_ID.r2.cloudflarestorage.com/gruporubio-media
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=auto
S3_BUCKET=gruporubio-media
S3_ENDPOINT=https://TU_ACCOUNT_ID.r2.cloudflarestorage.com

# MeiliSearch
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_API_KEY=GENERAR_CON_OPENSSL

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://api.gruporubio.es/auth/google/callback

# Admin Medusa
MEDUSA_ADMIN_FIRST_NAME=Ayoub
MEDUSA_ADMIN_LAST_NAME=Admin
MEDUSA_ADMIN_EMAIL=administracion@gruporubio.net
MEDUSA_ADMIN_PASSWORD=CAMBIAR_ESTO
```

- [ ] **Step 4: Commit**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-web
git add deploy/
git commit -m "chore: plantillas de variables de entorno para producción en Hetzner"
```

---

## Task 4: Dockerfiles para ambos repos

**Files:**
- Create: `gruporubio-web/Dockerfile`
- Create: `gruporubio-web/.dockerignore`
- Create: `gruporubio-medusa/Dockerfile`
- Create: `gruporubio-medusa/.dockerignore`

- [ ] **Step 1: Crear .dockerignore para el frontend**

Crear `gruporubio-web/.dockerignore`:

```
node_modules
.next
.env*
.git
.ai-variants
deploy
docs
*.md
```

- [ ] **Step 2: Crear Dockerfile para el frontend (Next.js)**

Crear `gruporubio-web/Dockerfile`:

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

- [ ] **Step 3: Habilitar output standalone en next.config**

Leer `gruporubio-web/next.config.ts` (o `next.config.js`) y añadir `output: 'standalone'` dentro de la config:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... resto de la config existente
}
```

- [ ] **Step 4: Crear .dockerignore para el backend**

Crear `gruporubio-medusa/.dockerignore`:

```
node_modules
.medusa
.env*
.git
*.md
```

- [ ] **Step 5: Crear Dockerfile para el backend (Medusa)**

Crear `gruporubio-medusa/Dockerfile`:

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.medusa/server ./.medusa/server
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 9000
CMD ["node", ".medusa/server/main.js"]
```

- [ ] **Step 6: Commit en ambos repos**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-web
git add Dockerfile .dockerignore next.config.ts
git commit -m "feat(deploy): Dockerfile multistage para Next.js con output standalone"

cd C:\Users\Ayoub\Proyectos\gruporubio-medusa
git add Dockerfile .dockerignore
git commit -m "feat(deploy): Dockerfile para Medusa backend"
```

---

## Task 5: Docker Compose + Nginx

**Files:**
- Create: `gruporubio-web/deploy/docker-compose.yml`
- Create: `gruporubio-web/deploy/nginx/gruporubio.conf`

- [ ] **Step 1: Crear docker-compose.yml**

Crear `gruporubio-web/deploy/docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: medusa
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: gruporubio_medusa
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U medusa"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  medusa:
    build:
      context: ../../gruporubio-medusa
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file: .env.medusa
    environment:
      DATABASE_URL: postgres://medusa:${POSTGRES_PASSWORD}@postgres:5432/gruporubio_medusa
      REDIS_URL: redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "9000:9000"

  web:
    build:
      context: ..
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file: .env.web
    ports:
      - "3000:3000"
    depends_on:
      - medusa

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/gruporubio.conf:/etc/nginx/conf.d/default.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /var/www/certbot:/var/www/certbot:ro
    depends_on:
      - web
      - medusa

volumes:
  postgres_data:
  redis_data:
```

> **Nota:** `POSTGRES_PASSWORD` se define en un archivo `.env` junto al `docker-compose.yml`. Esto mantiene la contraseña fuera de los archivos de config.

- [ ] **Step 2: Crear .env para Docker Compose**

Crear `gruporubio-web/deploy/.env.compose.template`:

```bash
# Variables para docker-compose.yml
# Copiar a .env en el VPS dentro de la carpeta deploy/
POSTGRES_PASSWORD=GENERAR_CONTRASEÑA_SEGURA
```

- [ ] **Step 3: Crear configuración Nginx**

Crear `gruporubio-web/deploy/nginx/gruporubio.conf`:

```nginx
# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name gruporubio.es www.gruporubio.es api.gruporubio.es;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# Web principal — gruporubio.es
server {
    listen 443 ssl;
    server_name gruporubio.es www.gruporubio.es;

    ssl_certificate /etc/letsencrypt/live/gruporubio.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gruporubio.es/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    location / {
        proxy_pass http://web:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# API Medusa — api.gruporubio.es
server {
    listen 443 ssl;
    server_name api.gruporubio.es;

    ssl_certificate /etc/letsencrypt/live/api.gruporubio.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.gruporubio.es/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    client_max_body_size 50M;

    location / {
        proxy_pass http://medusa:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- [ ] **Step 4: Crear README de deploy**

Crear `gruporubio-web/deploy/README.md`:

```markdown
# Deploy en Hetzner VPS

## Requisitos en el VPS
- Ubuntu 24.04 LTS
- Docker + Docker Compose v2
- Certbot para SSL

## Pasos de despliegue

### 1. Clonar ambos repos en el VPS
```bash
git clone git@github.com:TU_ORG/gruporubio-web.git
git clone git@github.com:TU_ORG/gruporubio-medusa.git
```
Los dos repos deben estar en el mismo directorio padre.

### 2. Configurar variables de entorno
```bash
cd gruporubio-web/deploy
cp .env.web.template .env.web        # Rellenar valores reales
cp .env.medusa.template .env.medusa  # Rellenar valores reales
cp .env.compose.template .env        # Rellenar contraseña Postgres
```

### 3. Obtener certificados SSL (primera vez)
```bash
# Instalar certbot
apt install certbot

# Obtener certificados (el VPS debe tener los dominios apuntando ya)
certbot certonly --standalone -d gruporubio.es -d www.gruporubio.es
certbot certonly --standalone -d api.gruporubio.es
```

### 4. Arrancar servicios
```bash
cd gruporubio-web/deploy
docker compose up -d --build
```

### 5. Ejecutar migraciones y seed (primera vez)
```bash
docker compose exec medusa npx medusa db:migrate
docker compose exec medusa npx medusa exec src/scripts/seed.ts
```

### Actualizar tras nuevos commits
```bash
git pull
cd gruporubio-web/deploy
docker compose up -d --build web      # Solo frontend
docker compose up -d --build medusa   # Solo backend
```
```

- [ ] **Step 5: Commit**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-web
git add deploy/
git commit -m "feat(deploy): Docker Compose + Nginx config para Hetzner"
```

---

## Task 6: Actualizar seed de Medusa con datos de Grupo Rubio

**Files:**
- Modify: `gruporubio-medusa/src/scripts/seed.ts`

El seed actual tiene productos de Medusa (camisetas, sudaderas...) y una ubicación en Copenhagen. Hay que actualizarlo con datos reales de Grupo Rubio.

- [ ] **Step 1: Reemplazar el seed completo**

Reemplazar el contenido de `gruporubio-medusa/src/scripts/seed.ts` con:

```typescript
import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import { ApiKey } from "../../.medusa/types/query-entry-points"

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[]
    store_id: string
  }) => {
    const normalizedInput = transform({ input }, (data) => ({
      selector: { id: data.input.store_id },
      update: {
        supported_currencies: data.input.supported_currencies.map((c) => ({
          currency_code: c.currency_code,
          is_default: c.is_default ?? false,
        })),
      },
    }))
    const stores = require("@medusajs/medusa/core-flows").updateStoresStep(normalizedInput)
    return new WorkflowResponse(stores)
  }
)

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const storeModuleService = container.resolve(Modules.STORE)

  const countries = ["es"]

  logger.info("Seeding store data — Grupo Rubio...")
  const [store] = await storeModuleService.listStores()
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Tienda Online Grupo Rubio",
  })

  if (!defaultSalesChannel.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [{ name: "Tienda Online Grupo Rubio" }],
      },
    })
    defaultSalesChannel = result
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [{ currency_code: "eur", is_default: true }],
    },
  })

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_sales_channel_id: defaultSalesChannel[0].id },
    },
  })

  logger.info("Seeding region España...")
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "España",
          currency_code: "eur",
          countries,
          payment_providers: ["pp_stripe_stripe", "pp_system_default"],
        },
      ],
    },
  })
  const region = regionResult[0]

  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  })

  logger.info("Seeding almacén Tudela, Navarra...")
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Almacén Grupo Rubio — Tudela",
          address: {
            city: "Tudela",
            country_code: "ES",
            address_1: "Polígono Industrial",
            province: "Navarra",
          },
        },
      ],
    },
  })
  const stockLocation = stockLocationResult[0]

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_location_id: stockLocation.id },
    },
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  logger.info("Seeding fulfillment data...")
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({ type: "default" })
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null

  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Envío estándar", type: "default" }] },
    })
    shippingProfile = result[0]
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Envío nacional — Grupo Rubio",
    type: "shipping",
    service_zones: [
      {
        name: "España peninsular",
        geo_zones: [{ country_code: "es", type: "country" }],
      },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  })

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Envío estándar (3-5 días)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Estándar", description: "Entrega en 3-5 días hábiles.", code: "standard" },
        prices: [
          { currency_code: "eur", amount: 6.99 },
          { region_id: region.id, amount: 6.99 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Envío express (24-48h)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Express", description: "Entrega en 24-48 horas.", code: "express" },
        prices: [
          { currency_code: "eur", amount: 12.99 },
          { region_id: region.id, amount: 12.99 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Recogida en almacén (Tudela)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Recogida", description: "Recoge en nuestro almacén en Tudela.", code: "pickup" },
        prices: [
          { currency_code: "eur", amount: 0 },
          { region_id: region.id, amount: 0 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [defaultSalesChannel[0].id] },
  })

  logger.info("Seeding publishable API key...")
  let publishableApiKey: ApiKey | null = null
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: { type: "publishable" },
  })
  publishableApiKey = data?.[0]

  if (!publishableApiKey) {
    const { result: [key] } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{ title: "Tienda Online Grupo Rubio", type: "publishable", created_by: "" }],
      },
    })
    publishableApiKey = key as ApiKey
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [defaultSalesChannel[0].id] },
  })

  logger.info("Seeding categorías de productos...")
  const { result: categoryResult } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        { name: "Limpieza Profesional", is_active: true },
        { name: "Control de Plagas", is_active: true },
        { name: "Higiene Industrial", is_active: true },
        { name: "Desinfección", is_active: true },
      ],
    },
  })

  logger.info("Seeding productos demo Grupo Rubio...")
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Desengrasante Industrial GR-500",
          category_ids: [categoryResult.find((c) => c.name === "Limpieza Profesional")!.id],
          description: "Desengrasante de alta eficacia para superficies industriales. Elimina grasas, aceites y residuos orgánicos sin dañar los materiales. Apto para uso alimentario. Certificado para uso profesional.",
          handle: "desengrasante-industrial-gr500",
          weight: 5000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Formato", values: ["1L", "5L", "20L"] }],
          variants: [
            { title: "1L", sku: "GR-DESENG-1L", options: { Formato: "1L" }, prices: [{ amount: 8.95, currency_code: "eur" }] },
            { title: "5L", sku: "GR-DESENG-5L", options: { Formato: "5L" }, prices: [{ amount: 34.95, currency_code: "eur" }] },
            { title: "20L", sku: "GR-DESENG-20L", options: { Formato: "20L" }, prices: [{ amount: 119.95, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Desinfectante Multiusos GR-Clean",
          category_ids: [categoryResult.find((c) => c.name === "Desinfección")!.id],
          description: "Desinfectante bactericida y virucida de amplio espectro. Activo frente a bacterias gram+, gram- y virus. Apto para superficies de contacto alimentario. No requiere aclarado.",
          handle: "desinfectante-multiusos-gr-clean",
          weight: 1000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Formato", values: ["750ml", "5L"] }],
          variants: [
            { title: "750ml", sku: "GR-DESINF-750ML", options: { Formato: "750ml" }, prices: [{ amount: 7.50, currency_code: "eur" }] },
            { title: "5L", sku: "GR-DESINF-5L", options: { Formato: "5L" }, prices: [{ amount: 39.95, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Insecticida Profesional GR-Pest",
          category_ids: [categoryResult.find((c) => c.name === "Control de Plagas")!.id],
          description: "Insecticida de uso profesional con efecto residual prolongado. Activo frente a cucarachas, hormigas, mosquitos y otros insectos rastradores y voladores. Baja toxicidad, alta eficacia.",
          handle: "insecticida-profesional-gr-pest",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Formato", values: ["500ml", "1L"] }],
          variants: [
            { title: "500ml", sku: "GR-PEST-500ML", options: { Formato: "500ml" }, prices: [{ amount: 14.95, currency_code: "eur" }] },
            { title: "1L", sku: "GR-PEST-1L", options: { Formato: "1L" }, prices: [{ amount: 24.95, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Gel Hidroalcohólico Profesional 70%",
          category_ids: [categoryResult.find((c) => c.name === "Higiene Industrial")!.id],
          description: "Gel hidroalcohólico al 70% de alcohol isopropílico para higiene de manos. De acción rápida, no requiere aclarado. Formato garrafa para recarga de dispensadores.",
          handle: "gel-hidroalcoholico-profesional",
          weight: 5000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Formato", values: ["500ml", "5L"] }],
          variants: [
            { title: "500ml", sku: "GR-GEL-500ML", options: { Formato: "500ml" }, prices: [{ amount: 4.95, currency_code: "eur" }] },
            { title: "5L", sku: "GR-GEL-5L", options: { Formato: "5L" }, prices: [{ amount: 19.95, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
      ],
    },
  })

  logger.info("Seeding inventario...")
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  const inventoryLevels: CreateInventoryLevelInput[] = inventoryItems.map((item) => ({
    location_id: stockLocation.id,
    stocked_quantity: 500,
    inventory_item_id: item.id,
  }))

  await createInventoryLevelsWorkflow(container).run({
    input: { inventory_levels: inventoryLevels },
  })

  logger.info("✅ Seed completado — Grupo Rubio")
  logger.info(`   Region: ${region.id}`)
  logger.info(`   Publishable API Key: ${publishableApiKey.id}`)
  logger.info("   Copia la API Key al .env del frontend como NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY")
}
```

- [ ] **Step 2: Build para verificar tipos**

```bash
cd C:\Users\Ayoub\Proyectos\gruporubio-medusa
npm run build
```

Resultado esperado: sin errores. Si falla por el `updateStoreCurrencies` inline (que importa desde dentro), usa la versión del archivo original que ya compila y adapta solo los datos.

- [ ] **Step 3: Commit**

```bash
git add src/scripts/seed.ts
git commit -m "feat(medusa): seed con datos reales de Grupo Rubio — España, Tudela, productos limpieza"
```

---

## Checklist de verificación final

- [ ] `.ai-variants/` eliminada del repo y en `.gitignore`
- [ ] `npm run build` limpio en `gruporubio-web`
- [ ] `npm run build` limpio en `gruporubio-medusa`
- [ ] Archivos `.env.*.template` creados con todas las variables necesarias
- [ ] `Dockerfile` en ambos repos
- [ ] `output: 'standalone'` en `next.config.ts`
- [ ] `docker-compose.yml` con los 5 servicios
- [ ] Nginx config con los 2 virtual hosts
- [ ] Seed actualizado con productos y ubicación de Grupo Rubio

## Notas para el deploy real

- **SSL**: antes de arrancar Nginx con HTTPS, obtener los certificados con Certbot (`certbot certonly --standalone`)
- **Primer arranque**: correr `docker compose exec medusa npx medusa db:migrate` antes del seed
- **API Key**: el seed imprime la `publishable API key` — copiarla al `.env.web` como `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- **Region ID**: visible en el admin de Medusa → Settings → Regions — copiar al `.env.web` como `NEXT_PUBLIC_MEDUSA_REGION_ID`
