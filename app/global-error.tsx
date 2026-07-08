"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Captura errores del layout raíz (los demás los recoge onRequestError /
// el SDK de cliente). Debe renderizar su propio <html>/<body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: "#FFFFFF" }}>
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center", padding: 32,
        }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", marginBottom: 12 }}>
            Algo ha ido mal
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 24, maxWidth: 420 }}>
            Ha ocurrido un error inesperado. Puedes intentarlo de nuevo o volver a la página de inicio.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={reset}
              style={{
                background: "#111827", color: "#FFFFFF", border: "none", borderRadius: 8,
                padding: "12px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Reintentar
            </button>
            <a
              href="/"
              style={{
                background: "#FFFFFF", color: "#111827", border: "1.5px solid #E5E7EB", borderRadius: 8,
                padding: "12px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none",
              }}
            >
              Ir al inicio
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
