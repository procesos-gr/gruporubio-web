/**
 * Rate limiter en memoria por IP para /api/chat.
 * Límites: 10 mensajes/minuto y 60 mensajes/día por IP.
 * Suficiente para un solo proceso Next (VPS). Si algún día hay varias
 * instancias detrás de un load balancer, migrar a Redis.
 */

interface Bucket {
  minuteCount: number;
  minuteReset: number;
  dayCount: number;
  dayReset: number;
}

const MINUTE = 60_000;
const DAY = 86_400_000;
const MAX_PER_MINUTE = 10;
const MAX_PER_DAY = 60;

const buckets = new Map<string, Bucket>();

// Limpieza periódica para que el Map no crezca sin límite
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 10 * MINUTE) return;
  lastSweep = now;
  for (const [ip, b] of buckets) {
    if (now > b.dayReset) buckets.delete(ip);
  }
}

export function checkRateLimit(ip: string): { ok: boolean; reason?: string } {
  const now = Date.now();
  sweep(now);

  let b = buckets.get(ip);
  if (!b) {
    b = { minuteCount: 0, minuteReset: now + MINUTE, dayCount: 0, dayReset: now + DAY };
    buckets.set(ip, b);
  }

  if (now > b.minuteReset) {
    b.minuteCount = 0;
    b.minuteReset = now + MINUTE;
  }
  if (now > b.dayReset) {
    b.dayCount = 0;
    b.dayReset = now + DAY;
  }

  if (b.minuteCount >= MAX_PER_MINUTE) {
    return { ok: false, reason: "Demasiados mensajes seguidos. Espera un momento e inténtalo de nuevo." };
  }
  if (b.dayCount >= MAX_PER_DAY) {
    return { ok: false, reason: "Has alcanzado el límite diario del chat. Llámanos al 948 82 50 25 y te atendemos encantados." };
  }

  b.minuteCount++;
  b.dayCount++;
  return { ok: true };
}
