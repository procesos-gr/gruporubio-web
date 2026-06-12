# Grupo Rubio Web — Contexto para Claude Code

Web de marketing + tienda de Grupo Rubio (limpieza profesional, control de plagas e higiene, Tudela — Navarra). Next.js 16 App Router, React 19, next-intl (`/es` por defecto), Tailwind 4 + muchos estilos inline. Rama de trabajo: `feature/tienda-medusa`.

## Arranque
- `npm run dev` (si el puerto 3000 está ocupado: `npm run dev -- -p 3001`)
- Necesita `.env.local` (no está en git): claves de Medusa (`NEXT_PUBLIC_MEDUSA_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`), `ANTHROPIC_API_KEY` (chatbot), SMTP (`SMTP_HOST/PORT/USER/PASS`, `CONTACT_EMAIL`) y Stripe.
- Backend Medusa aparte: repo `gruporubio-medusa` (corre en :9000, admin en /app).

## Mapa rápido
- `lib/services-data.ts` — los 14+ servicios (fuente de verdad; alimenta páginas, buscador del hero y chatbot)
- `lib/maquinaria-alquiler.ts` — catálogo de alquiler
- `components/sections/hero.tsx` — hero + buscador conectado a servicios/maquinaria/productos Medusa en vivo
- `components/chat/ChatWidget.tsx` + `app/api/chat/route.ts` + `lib/chatbot/` — chatbot "Ignacio" (Claude Haiku, AI SDK, rate-limit por IP)
- `app/api/contacto` y `app/api/alquiler/solicitud` — leads: envían email (nodemailer/SMTP) Y registran en Medusa (`/store/solicitudes`)
- `components/layout/Navbar.tsx` — mega-menu desktop + hamburguesa móvil (breakpoint 1140px; logo a la izquierda solo <640px)
- `app/[locale]/servicios/[slug]/page.tsx` — detalle de servicio con 3 layouts rotatorios (controlables con `imagePos`, `noImage2`, `noImages` en services-data)

## Reglas del proyecto
- Iconos: SOLO lucide-react
- Border-radius bajo (máx 8px en tarjetas/botones, nunca pill)
- Respuestas/logs en español
- Ir commiteando proactivamente según se avanza, sin que se pida
- Al reemplazar imágenes usar nombre de archivo NUEVO (caché del optimizador de Next)
- Imágenes IA: nanobanana Pro (Gemini) — FLUX PROHIBIDO
- Calidad primero: verificar visualmente (Playwright headless) antes de dar por terminado

## Estado (2026-06-12)
- Hecho: chatbot, leads email+Medusa, responsive móvil/tablet completo, 404, datos de contacto reales (948 82 50 25 / info@gruporubio.es)
- Pendiente del plan: idiomas (decidir si solo ES), SEO/GEO (sitemap, Schema LocalBusiness), legal/cookies (faltan datos fiscales), analytics, limpieza de carpetas temporales (`.ai-variants/`, `preview-variantes`, `_variants`), despliegue en VPS propio (NO Vercel)
- Tienda: productos demo del seed; al meter productos reales en Medusa, buscador/chatbot/tienda los recogen automáticamente
