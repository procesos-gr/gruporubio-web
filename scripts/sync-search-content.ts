// Sube servicios y maquinaria de alquiler (datos estáticos) al índice
// "content" de Meilisearch para el buscador del hero.
//
// Uso: npm run search:sync-content
// Requiere Node >= 23.6 (TS nativo) y MEILISEARCH_ADMIN_KEY en el entorno.
// Ejecutar tras cada cambio en lib/services-data.ts o lib/maquinaria-alquiler.ts.

import { SERVICES } from "../lib/services-data.ts"
import { MAQUINARIA } from "../lib/maquinaria-alquiler.ts"

const HOST =
  process.env.MEILISEARCH_HOST ||
  process.env.NEXT_PUBLIC_MEILISEARCH_HOST ||
  "http://localhost:7700"
const ADMIN_KEY = process.env.MEILISEARCH_ADMIN_KEY

if (!ADMIN_KEY) {
  console.error("Falta MEILISEARCH_ADMIN_KEY en el entorno")
  process.exit(1)
}

async function meili(method: string, path: string, body?: unknown) {
  const res = await fetch(`${HOST}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_KEY}`,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${await res.text()}`)
  }
  return res.json()
}

async function waitForTask(taskUid: number) {
  for (let i = 0; i < 60; i++) {
    const task = await meili("GET", `/tasks/${taskUid}`)
    if (task.status === "succeeded") return
    if (task.status === "failed" || task.status === "canceled") {
      throw new Error(`Tarea ${taskUid} ${task.status}: ${JSON.stringify(task.error)}`)
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`Tarea ${taskUid} no terminó a tiempo`)
}

const documents = [
  ...SERVICES.map((s) => ({
    id: `service-${s.slug}`,
    type: "service" as const,
    title: s.title,
    subtitle: s.categoryLabel,
    description: s.shortDesc,
    href: `/servicios/${s.slug}`,
  })),
  ...MAQUINARIA.filter((m) => m.disponible).map((m) => ({
    id: `rental-${m.handle}`,
    type: "rental" as const,
    title: m.titulo,
    subtitle: m.categoria,
    description: `${m.marca} — ${m.descripcionCorta}`,
    href: `/alquiler/${m.handle}`,
  })),
]

const settings = await meili("PATCH", "/indexes/content/settings", {
  searchableAttributes: ["title", "subtitle", "description"],
})
await waitForTask(settings.taskUid)

// Reemplazo completo: borra todo y vuelve a subir (los ids son estables,
// así también desaparecen servicios/máquinas retirados)
const cleared = await meili("DELETE", "/indexes/content/documents")
await waitForTask(cleared.taskUid)

const added = await meili("POST", "/indexes/content/documents", documents)
await waitForTask(added.taskUid)

console.log(
  `Índice "content" sincronizado: ${documents.length} documentos ` +
    `(${SERVICES.length} servicios, ${documents.length - SERVICES.length} máquinas)`
)
