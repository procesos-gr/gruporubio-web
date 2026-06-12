/**
 * Registro de leads en Medusa (módulo Solicitudes) — best effort.
 * El email es el canal primario; esto alimenta el panel de gestión.
 * Si Medusa no responde, NO bloquea el flujo: el lead ya viajó por email.
 */

interface SolicitudPayload {
  origen: "contacto" | "presupuesto" | "alquiler" | "chatbot";
  nombre: string;
  email: string;
  telefono: string;
  mensaje?: string;
  detalles?: Record<string, string>;
}

export async function registrarSolicitudEnMedusa(payload: SolicitudPayload): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000";
  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  if (!key) return;

  try {
    const res = await fetch(`${baseUrl}/store/solicitudes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": key,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.warn("[solicitudes] Medusa respondió", res.status);
    }
  } catch (err) {
    console.warn("[solicitudes] Medusa no disponible — lead solo por email:", (err as Error).message);
  }
}
