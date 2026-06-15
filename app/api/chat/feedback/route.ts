import { z } from "zod";
import { logChatEvent } from "@/lib/chatbot/logger";

const BodySchema = z.object({
  botMessage: z.string().min(1).max(4000),
  rating: z.enum(["up", "down"]),
});

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  let body;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "Petición inválida" }, { status: 400 });
  }

  await logChatEvent({ ip, type: "feedback", botMessage: body.botMessage, rating: body.rating });
  return Response.json({ ok: true });
}
