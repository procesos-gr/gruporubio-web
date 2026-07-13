import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  // output: standalone solo para builds Docker (no compatible con Vercel)
  ...(process.env.DOCKER_BUILD === "true" ? { output: "standalone" } : {}),
  images: {
    qualities: [75, 85, 86, 88, 90, 92, 95],
    // 31 días: seguro porque la regla del proyecto es nombre de archivo NUEVO
    // al reemplazar una imagen (nunca se reutiliza la misma ruta)
    minimumCacheTTL: 2678400,
    // Solo en dev: permite que el optimizador cargue imágenes de Medusa en
    // localhost:9000 (IP privada). En prod Medusa está en dominio público, así
    // que el guard SSRF de Next sigue activo.
    ...(process.env.NODE_ENV !== "production" ? { dangerouslyAllowLocalIP: true } : {}),
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'http', hostname: 'localhost', port: '9000' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  // Los sourcemaps solo se suben si hay SENTRY_AUTH_TOKEN en el build
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
  // Proxy interno /monitoring para que los adblockers no bloqueen los eventos
  tunnelRoute: "/monitoring",
});
