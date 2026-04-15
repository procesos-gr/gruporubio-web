# Grupo Rubio Web + Ecommerce

Web corporativa + tienda online de Grupo Rubio Servicios Higiénicos Integrales S.L.

## Stack Tecnológico
- Next.js 15 (App Router)
- next-intl (i18n: es, en, fr)
- Prisma ORM + PostgreSQL (Neon)
- NextAuth.js v5 (Autenticación)
- Tailwind CSS v4

## Requisitos Previos
- Node.js 18+ (Recomendado versión LTS actual)
- npm o pnpm

## Variables de Entorno
Clona el archivo `.env.example` a `.env` y rellena las variables de entorno:

```bash
cp .env.example .env
```

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Generar cliente de Prisma:
```bash
npx prisma generate
```

3. (Opcional) Subir el esquema a la base de datos (con DATABASE_URL configurada):
```bash
npx prisma db push
```

## Desarrollo Local

Inicia el entorno de desarrollo:

```bash
npm run dev
```

El servidor estará corriendo en [http://localhost:3000](http://localhost:3000). Puedes verificar el i18n navegando automáticamente a `/es`.

## Design System

Para mantener la estética limpia y requerida en las directrices del proyecto:
- **Font**: Plus Jakarta Sans
- **Colores Secundarios**: Background (`#EEF4FB`), Primary (`#1A56DB`)
- **Estilo**: Uso de bordes curvos (`10px`).

Todos los componentes base están construidos utilizando puro Tailwind y React vanilla en `components/ui` para minimizar dependencias. Todos usan `sonner` para los Toast.
