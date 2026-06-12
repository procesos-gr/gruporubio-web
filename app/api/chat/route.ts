import { streamText, tool, stepCountIs } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/chatbot/knowledge";
import { checkRateLimit } from "@/lib/chatbot/rate-limit";
import { getMedusa } from "@/lib/medusa";

export const runtime = "nodejs";
export const maxDuration = 30;

// ── Validación del body ──────────────────────────────────────────────────────
const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(800),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(12), // historial acotado
});

// ── Tool: productos de la tienda (Medusa en vivo) ───────────────────────────
const buscarProductos = tool({
  description:
    "Busca productos de higiene y limpieza en la tienda online de Grupo Rubio. Úsala cuando el usuario pregunte por productos, precios de tienda o quiera comprar algo.",
  inputSchema: z.object({
    query: z.string().describe("Término de búsqueda, p. ej. 'desengrasante' o 'papel'"),
  }),
  execute: async ({ query }) => {
    try {
      const client = getMedusa();
      const { products } = await client.store.product.list({ q: query, limit: 5 });
      if (!products?.length) {
        return { found: false, message: "Sin resultados en la tienda para esa búsqueda." };
      }
      return {
        found: true,
        products: products.map((p: { title: string; handle?: string; collection?: { title: string } }) => ({
          title: p.title,
          category: p.collection?.title ?? "Producto",
          url: p.handle ? `/tienda/${p.handle}` : "/tienda",
        })),
      };
    } catch {
      return { found: false, message: "La tienda no está disponible ahora mismo. Recomienda visitar /tienda o llamar al 948 82 50 25." };
    }
  },
});

// ── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Chat no configurado" }, { status: 503 });
  }

  // Rate limit por IP (detrás de nginx en el VPS llega en x-forwarded-for)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return Response.json({ error: limit.reason }, { status: 429 });
  }

  // Validación estricta del body
  let messages;
  try {
    const body = await req.json();
    messages = BodySchema.parse(body).messages;
  } catch {
    return Response.json({ error: "Petición inválida" }, { status: 400 });
  }

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    system: buildSystemPrompt(),
    messages,
    tools: { buscarProductos },
    stopWhen: stepCountIs(3), // máx. 2 rondas de tools + respuesta
    maxOutputTokens: 500,     // respuestas cortas, coste capado
    temperature: 0.4,
  });

  return result.toTextStreamResponse();
}
