# Deploy en Hetzner VPS (116.202.27.5)

## Requisitos en el VPS
- Ubuntu 24.04 LTS
- Docker + Docker Compose v2
- Certbot para SSL

## Arquitectura
```
gruporubio.es       → nginx → web:3000    (Next.js)
api.gruporubio.es   → nginx → medusa:9000 (Medusa backend)
```
Ambos repos deben estar al mismo nivel en el VPS:
```
/srv/
  gruporubio-web/
  gruporubio-medusa/
```

---

## Pasos de despliegue (primera vez)

### 1. Clonar ambos repos en el VPS
```bash
mkdir -p /srv && cd /srv
git clone git@github.com:TU_ORG/gruporubio-web.git
git clone git@github.com:TU_ORG/gruporubio-medusa.git
```

### 2. Configurar variables de entorno
```bash
cd /srv/gruporubio-web/deploy
cp .env.web.template .env.web        # Rellenar todos los campos
cp .env.medusa.template .env.medusa  # Rellenar todos los campos
cp .env.compose.template .env        # Solo POSTGRES_PASSWORD
```

Generar secretos seguros:
```bash
openssl rand -hex 32   # Copiar resultado en JWT_SECRET y COOKIE_SECRET de .env.medusa
openssl rand -hex 24   # Para POSTGRES_PASSWORD en .env
```

### 3. Obtener certificados SSL ⚠️ ANTES de levantar nginx

Certbot --standalone necesita puerto 80 libre. Ejecutar **sin** Docker levantado:

```bash
apt install -y certbot
certbot certonly --standalone -d gruporubio.es -d www.gruporubio.es
certbot certonly --standalone -d api.gruporubio.es
```

Si Docker ya estaba levantado, detener nginx primero:
```bash
cd /srv/gruporubio-web/deploy
docker compose stop nginx
# ... ejecutar certbot ...
docker compose start nginx
```

### 4. Arrancar todos los servicios
```bash
cd /srv/gruporubio-web/deploy
docker compose up -d --build
```

### 5. Migraciones y seed (solo la primera vez)
```bash
docker compose exec medusa npx medusa db:migrate
docker compose exec medusa npx medusa exec src/scripts/seed.ts
```

El seed es **idempotente** — si ya se ejecutó previamente, salta los datos existentes.
Si se han añadido credenciales de PayPal, re-ejecutar el seed añadirá PayPal a la región España.

### 6. Verificación post-deploy
- [ ] `https://gruporubio.es` carga la web
- [ ] Formulario de contacto → llega email a administracion@gruporubio.net
- [ ] Chatbot Ignacio responde
- [ ] Tienda muestra productos (pide que Medusa esté con seed hecho)
- [ ] Checkout Stripe test: tarjeta `4242 4242 4242 4242`
- [ ] GA4 → tiempo real muestra visitas

---

## Actualizaciones (commits nuevos)

```bash
cd /srv/gruporubio-web
git pull
cd deploy
docker compose up -d --build web       # Solo frontend
docker compose up -d --build medusa    # Solo backend
```

## Renovación SSL automática
```bash
# Añadir a crontab del root:
0 3 * * * certbot renew --quiet && docker compose -f /srv/gruporubio-web/deploy/docker-compose.yml restart nginx
```

## Variables pendientes antes de go-live
- `STRIPE_SECRET_KEY` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → cambiar de `test` a `live`
- `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` → credenciales de producción PayPal Business
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` → mismo Client ID en .env.web
- `GOOGLE_CLIENT_ID/SECRET` → credenciales OAuth producción (cuando se reactive Mi Cuenta)
- Webhook Stripe → configurar en Stripe Dashboard apuntando a `https://gruporubio.es/api/stripe/webhook`
