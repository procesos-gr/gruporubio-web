import { streamText, tool, stepCountIs, smoothStream } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/chatbot/knowledge";
import { checkRateLimit } from "@/lib/chatbot/rate-limit";
import { logChatEvent } from "@/lib/chatbot/logger";
import { getMedusa } from "@/lib/medusa";
import { searchProducts, isSearchConfigured } from "@/lib/search";

export const runtime = "nodejs";
export const maxDuration = 30;

// ── Validación del body ──────────────────────────────────────────────────────
// El usuario está capado a 800 chars; las respuestas del bot pueden ser más
// largas y viajan de vuelta en el historial → límite propio más amplio.
const MessageSchema = z.discriminatedUnion("role", [
  z.object({ role: z.literal("user"), content: z.string().min(1).max(800) }),
  z.object({ role: z.literal("assistant"), content: z.string().min(1).max(4000) }),
]);

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(12), // historial acotado
});

// ── Tool: productos de la tienda (Medusa en vivo) ───────────────────────────
const buscarProductos = tool({
  description:
    "Busca productos de higiene y limpieza en la tienda online de Grupo Rubio. Úsala cuando el usuario pregunte por productos, precios de tienda o quiera comprar algo. Sin query devuelve el catálogo completo.",
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe("Término de búsqueda, p. ej. 'desengrasante'. Omitir para listar el catálogo completo."),
  }),
  execute: async ({ query }) => {
    try {
      const client = getMedusa();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let products: any[] | undefined;

      // Meilisearch primero (tolera typos tipo "desinfektante"); si falla o
      // no está configurado, cae al buscador básico de Medusa.
      if (query?.trim() && isSearchConfigured()) {
        try {
          const hits = await searchProducts(query, 5);
          products = hits.map((h) => ({
            title: h.title,
            handle: h.handle,
            collection: h.collection_title ? { title: h.collection_title } : undefined,
          }));
        } catch {
          products = undefined;
        }
      }

      if (!products) {
        ({ products } = await client.store.product.list(
          query?.trim() ? { q: query, limit: 5 } : { limit: 8 }
        ));
      }
      let exactMatch = true;
      // Sin resultados para esa búsqueda → devolver el catálogo actual para
      // que el bot pueda ofrecer alternativas reales en vez de un "no hay".
      if (!products?.length && query?.trim()) {
        exactMatch = false;
        ({ products } = await client.store.product.list({ limit: 8 }));
      }
      if (!products?.length) {
        return { found: false, message: "La tienda no tiene productos publicados todavía." };
      }
      return {
        found: true,
        exactMatch,
        note: exactMatch
          ? undefined
          : "No hay resultados exactos para esa búsqueda; esto es el catálogo actual de la tienda por si sirve como alternativa.",
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

  const lastUserMessage = messages[messages.length - 1]?.content ?? "";

  let result;
  try {
    result = streamText({
      model: anthropic("claude-haiku-4-5"),
      system: await buildSystemPrompt(),
      messages,
      tools: { buscarProductos },
      stopWhen: stepCountIs(3), // máx. 2 rondas de tools + respuesta
      maxOutputTokens: 700,     // respuestas cortas, margen para no cortar enlaces markdown
      temperature: 0.4,
      // Stream suave palabra a palabra — sin esto el texto llega a trompicones
      experimental_transform: smoothStream({ delayInMs: 18, chunking: "word" }),
      onError: ({ error }) => {
        logChatEvent({ ip, type: "error", userMessage: lastUserMessage, error: String(error) });
      },
      onFinish: ({ text }) => {
        logChatEvent({ ip, type: "conversation", userMessage: lastUserMessage, botMessage: text });
      },
    });
  } catch (error) {
    logChatEvent({ ip, type: "error", userMessage: lastUserMessage, error: String(error) });
    return Response.json({ error: "Ahora mismo no puedo responder. Llámanos al 948 82 50 25 y te atendemos encantados." }, { status: 503 });
  }

  return result.toTextStreamResponse();
}
