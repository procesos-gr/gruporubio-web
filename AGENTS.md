# AGENTS.md — gruporubio-web

## Proyecto
Web corporativa + tienda online de Grupo Rubio Servicios Higiénicos Integrales S.L.
Stack: Next.js 15 (App Router) + Render + Neon PostgreSQL + Prisma + Stripe + NextAuth.js v5 + Resend + next-intl + Plausible

## Reglas absolutas — nunca violarlas
- NUNCA acceder directamente a la BD de GrupoRubioApp. Solo via API REST.
- NUNCA hardcodear strings en componentes — siempre i18n via next-intl
- NUNCA usar alert() / confirm() nativos — siempre Toast/Modal
- NUNCA pasar datos sensibles en parámetros de URL
- NUNCA exponer GRUPORUBIOAPP_API_KEY en el cliente (browser)
- Todos los campos de dinero: Decimal @db.Decimal(10,2) en Prisma — nunca Float
- Fechas: siempre T00:00:00 sin Z al parsear strings

## Design system
- Font: Plus Jakarta Sans
- Primary: #1A56DB
- Background: #EEF4FB
- Border radius: 10px
- Sin emojis en la UI

## i18n
- Idiomas: es (principal), en, fr
- Librería: next-intl
- Estructura: /messages/es.json, /messages/en.json, /messages/fr.json
- Rutas: /[locale]/...

## Estructura de carpetas
app/[locale]/ → rutas con i18n
components/   → componentes reutilizables
lib/          → utils, helpers, clientes API
messages/     → traducciones
prisma/       → schema BD web
public/       → assets estáticos

## Variables de entorno requeridas (nunca commitear valores reales)
DATABASE_URL, DATABASE_DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL,
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY,
GRUPORUBIOAPP_API_KEY, GRUPORUBIOAPP_API_URL, NEXT_PUBLIC_PLAUSIBLE_DOMAIN