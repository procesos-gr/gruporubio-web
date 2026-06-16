# Spec: Rediseño Chat Widget — Ignacio

**Fecha:** 2026-06-16  
**Estado:** Aprobado por usuario

---

## Contexto

El widget actual (`components/chat/ChatWidget.tsx`) funciona correctamente (streaming, feedback, nudge, chips) pero tiene un aspecto genérico. Se rediseña solo el frontend — toda la lógica de negocio (API, streaming, feedback, rate-limit) se mantiene intacta.

---

## Diseño elegido

Combinación de estilos:
- **Estructura y contenido**: Estilo A (Flowise/Clean AI) — el más usado en chatbots de IA profesionales
- **Botón flotante (FAB)**: Cuadrado con bordes redondeados (`border-radius: 16px`), fondo oscuro `#0f172a`
- **Header del panel**: Fondo oscuro `#0f172a` (estilo C)

---

## Componentes visuales

### 1. Botón flotante (FAB)
- **Forma**: cuadrado redondeado, `border-radius: 16px` (NO círculo)
- **Tamaño**: 56×56px
- **Fondo**: `#0f172a` (casi negro)
- **Icono**: `MessageCircle` de lucide-react, blanco, 24px
- **Sombra**: `0 4px 24px rgba(0,0,0,0.35)`
- **Posición**: bottom 24px, right 24px (igual que ahora)
- **Animación**: `scale(1.05)` en hover, `scale(0.95)` en tap (framer-motion, igual que ahora)
- **Transición icono**: rotación suave entre `MessageCircle` y `X` (igual que ahora)

### 2. Popup nudge ("¿Necesitas ayuda?")
- Mantiene la misma lógica (8s delay, una vez por sesión)
- Rediseño visual: `border-radius: 12px`, sombra más pronunciada
- La flecha apunta al botón cuadrado (ajuste posición)
- Fondo blanco, borde `#e2e8f0`

### 3. Panel del chat
- **Posición**: bottom 92px, right 24px (ajustado al nuevo tamaño del FAB)
- **Dimensiones**: `min(380px, calc(100vw - 32px))` × `min(560px, calc(100vh - 120px))`
- **Border-radius**: 16px
- **Sombra**: `0 8px 48px rgba(0,0,0,0.2)`
- **Fondo general**: `#ffffff`
- **Animación apertura**: scale + opacity (igual que ahora, framer-motion)

### 4. Header del panel
- **Fondo**: `#0f172a`
- **Padding**: 16px 18px
- **Avatar "I"**:
  - Círculo 40px, fondo `rgba(255,255,255,0.1)`, borde `rgba(255,255,255,0.2)`
  - Letra "I" blanca, 16px, font-weight 800
  - Punto verde online: 10px, `#22c55e`, borde `2px solid #0f172a`
- **Nombre**: "Ignacio", blanco, 15px, font-weight 700
- **Subtítulo**: "Asistente de Grupo Rubio · En línea", `rgba(255,255,255,0.55)`, 11px
- **Botón cerrar**: `rgba(255,255,255,0.1)` redondeado, icono X blanco

### 5. Área de mensajes
- **Fondo**: `#f8fafc`
- **Padding**: 16px 14px 8px
- **Mini-avatar bot** (por cada mensaje): cuadrado redondeado `border-radius: 8px`, 24px, fondo `#0f172a`, letra "I" blanca 10px
- **Burbuja bot**: fondo `#ffffff`, borde `1px solid #e2e8f0`, `border-radius: 4px 14px 14px 14px`, sombra sutil, texto `#0f172a`
- **Burbuja usuario**: fondo `#1e3a8a`, `border-radius: 14px 14px 4px 14px`, texto blanco
- **Chips de sugerencias**: fondo `#f0f4ff`, borde `#c7d7fd`, texto `#1e3a8a`, `border-radius: 99px` (pills), 11px
- **Typing dots**: igual que ahora (3 puntos animados)

### 6. Input
- **Fondo zona**: `#ffffff`, borde top `1px solid #f1f5f9`
- **Campo**: `border-radius: 12px`, fondo `#f8fafc`, borde `1.5px solid #e2e8f0`
- **Botón enviar**: `border-radius: 10px` (cuadrado redondeado, consistente con FAB), fondo `#1e3a8a`
- **Focus**: borde `#1e3a8a`, fondo blanco

---

## Lo que NO cambia

- Toda la lógica de `send()`, streaming, abort controller
- `BotText` (renderizado de markdown/links)
- `FeedbackButtons` (thumbs up/down) — solo ajuste visual mínimo si hace falta
- `TypingDots`
- API routes (`/api/chat`, `/api/chat/feedback`)
- Lógica del nudge (timing, sessionStorage)

---

## Archivos afectados

- `components/chat/ChatWidget.tsx` — único archivo a tocar

---

## Criterio de éxito

- Visualmente profesional: botón cuadrado redondeado oscuro, header dark, burbujas limpias
- Funcionalidad 100% intacta (streaming, feedback, chips, nudge)
- Sin regresiones en móvil (el panel ya usa `min(...)` responsive)
