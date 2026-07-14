import {
  MAQUINARIA as CATALOGO_ESTATICO,
  type MaquinaAlquiler,
} from "./maquinaria-alquiler"

/**
 * Adaptador del catálogo de alquiler de maquinaria.
 *
 * Fuente de verdad: Medusa (sales channel "Alquiler Maquinaria", key propia
 * NEXT_PUBLIC_MEDUSA_ALQUILER_KEY — la tienda usa otra key y nunca ve las
 * máquinas). Devuelve el MISMO tipo `MaquinaAlquiler` de siempre, así que
 * los componentes no distinguen de dónde vienen los datos.
 *
 * Red de seguridad: si Medusa no responde, la key falta o el catálogo llega
 * vacío/corrupto, se sirve el snapshot estático de `maquinaria-alquiler.ts`
 * (mismo patrón de fallback que Meilisearch). /alquiler no se cae nunca.
 *
 * Solo para código de servidor (páginas, sitemap, chatbot, scripts). Los
 * client components (hero, strip) siguen usando el snapshot estático.
 */

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const ALQUILER_KEY = process.env.NEXT_PUBLIC_MEDUSA_ALQUILER_KEY || ""
const REVALIDATE_SEGUNDOS = 300

type ProductoMedusa = {
  handle: string
  title: string
  description: string | null
  thumbnail: string | null
  metadata: Record<string, unknown> | null
}

function mapear(p: ProductoMedusa): MaquinaAlquiler | null {
  const m = p.metadata
  if (!m || m.tipo !== "maquinaria_alquiler") return null
  // Campos imprescindibles para que la ficha no se rompa
  if (!p.handle || !p.title || !m.categoria || !m.categoriaSlug) return null
  return {
    handle: p.handle,
    titulo: p.title,
    marca: (m.marca as string) ?? "Kärcher",
    categoria: m.categoria as string,
    categoriaSlug: m.categoriaSlug as string,
    descripcion: p.description ?? "",
    descripcionCorta: (m.descripcionCorta as string) ?? "",
    precioDesde: (m.precioDesde as string) ?? "Consultar precio",
    disponible: (m.disponible as boolean) ?? true,
    destacado: (m.destacado as boolean) ?? false,
    tension: (m.tension as string) ?? undefined,
    uso: (m.uso as MaquinaAlquiler["uso"]) ?? "ambos",
    perfilCliente: (m.perfilCliente as MaquinaAlquiler["perfilCliente"]) ?? "ambos",
    advertencia: (m.advertencia as string) ?? undefined,
    imagen: p.thumbnail ?? "",
    usos: (m.usos as string[]) ?? [],
    specs: (m.specs as MaquinaAlquiler["specs"]) ?? [],
    specsDestacadas: (m.specsDestacadas as MaquinaAlquiler["specsDestacadas"]) ?? [],
  }
}

export async function getMaquinaria(): Promise<MaquinaAlquiler[]> {
  if (!ALQUILER_KEY) return CATALOGO_ESTATICO
  try {
    const res = await fetch(
      `${MEDUSA_URL}/store/products?limit=100&fields=handle,title,description,thumbnail,+metadata`,
      {
        headers: { "x-publishable-api-key": ALQUILER_KEY },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: REVALIDATE_SEGUNDOS },
      }
    )
    if (!res.ok) throw new Error(`Medusa alquiler HTTP ${res.status}`)
    const { products } = (await res.json()) as { products: ProductoMedusa[] }
    const maquinas = (products ?? [])
      .map(mapear)
      .filter((m): m is MaquinaAlquiler => m !== null)
    if (!maquinas.length) return CATALOGO_ESTATICO
    // preservar el orden editorial del catálogo original
    const orden = new Map(
      (products ?? []).map((p) => [p.handle, Number(p.metadata?.orden ?? 999)])
    )
    return maquinas.sort(
      (a, b) => (orden.get(a.handle) ?? 999) - (orden.get(b.handle) ?? 999)
    )
  } catch {
    return CATALOGO_ESTATICO
  }
}

export async function getMaquinaPorHandle(
  handle: string
): Promise<MaquinaAlquiler | undefined> {
  const maquinas = await getMaquinaria()
  return maquinas.find((m) => m.handle === handle)
}

export function getCategoriasDe(maquinas: MaquinaAlquiler[]): string[] {
  return [...new Set(maquinas.map((m) => m.categoria))]
}
