// Búsqueda instantánea vía Meilisearch (índices "products" y "content").
// Funciona en cliente y servidor con la key de solo-búsqueda (NEXT_PUBLIC_*).
// Si las vars no están definidas, los llamantes usan su fallback local.

export interface SearchResult {
  type: "service" | "product" | "rental"
  title: string
  subtitle: string
  href: string
}

export type ProductHit = {
  id: string
  title: string
  handle: string
  description?: string | null
  thumbnail?: string | null
  collection_title?: string | null
  collection_handle?: string | null
}

type ContentHit = {
  id: string
  type: "service" | "rental"
  title: string
  subtitle: string
  description?: string
  href: string
}

const HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST
const SEARCH_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY

export function isSearchConfigured(): boolean {
  return Boolean(HOST && SEARCH_KEY)
}

async function meiliFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${HOST}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SEARCH_KEY}`,
    },
    body: JSON.stringify(body),
    // Búsqueda instantánea: si Meilisearch no responde rápido, mejor
    // cortar y dejar que el llamante caiga a su fallback
    signal: AbortSignal.timeout(2000),
  })
  if (!res.ok) {
    throw new Error(`Meilisearch ${path} → ${res.status}`)
  }
  return res.json() as Promise<T>
}

/** Busca solo en el índice de productos (tienda, chatbot). */
export async function searchProducts(q: string, limit = 10): Promise<ProductHit[]> {
  if (!isSearchConfigured()) {
    throw new Error("Meilisearch no configurado")
  }
  const data = await meiliFetch<{ hits: ProductHit[] }>(
    "/indexes/products/search",
    { q, limit }
  )
  return data.hits ?? []
}

/** Busca productos + servicios + maquinaria en una sola petición (hero). */
export async function searchAll(
  q: string,
  opts?: { productsLimit?: number; contentLimit?: number }
): Promise<SearchResult[]> {
  if (!isSearchConfigured()) {
    throw new Error("Meilisearch no configurado")
  }
  const data = await meiliFetch<{
    results: { indexUid: string; hits: (ProductHit | ContentHit)[] }[]
  }>("/multi-search", {
    queries: [
      { indexUid: "content", q, limit: opts?.contentLimit ?? 8 },
      { indexUid: "products", q, limit: opts?.productsLimit ?? 4 },
    ],
  })

  const results: SearchResult[] = []
  for (const { indexUid, hits } of data.results ?? []) {
    if (indexUid === "content") {
      for (const hit of hits as ContentHit[]) {
        results.push({ type: hit.type, title: hit.title, subtitle: hit.subtitle, href: hit.href })
      }
    } else {
      for (const hit of hits as ProductHit[]) {
        results.push({
          type: "product",
          title: hit.title,
          subtitle: hit.collection_title || "Producto",
          href: hit.handle ? `/tienda/${hit.handle}` : "/tienda",
        })
      }
    }
  }
  return results
}
