import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Log JSONL de conversaciones del chatbot — append-only, una línea por evento.
 * Solo para diagnóstico/mejora (qué preguntan, dónde falla el bot, abusos).
 * No bloquea la respuesta: los fallos de escritura se ignoran.
 */

const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "chat-logs.jsonl");

type ChatLogEntry = {
  ts: string;
  ip: string;
  type: "conversation" | "error" | "feedback";
  userMessage?: string;
  botMessage?: string;
  error?: string;
  rating?: "up" | "down";
};

export async function logChatEvent(entry: Omit<ChatLogEntry, "ts">): Promise<void> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, JSON.stringify({ ts: new Date().toISOString(), ...entry }) + "\n", "utf8");
  } catch {
    // no crítico: nunca debe romper la respuesta al usuario
  }
}
