// Regenera lib/maquinaria-snapshot.json desde Medusa (canal "Alquiler
// Maquinaria"). El snapshot alimenta los client components (strip, fallback
// del buscador del hero) y es la red de seguridad si Medusa cae.
//
// Uso: npm run maquinaria:snapshot   (tras editar maquinaria en Medusa)
// Requiere Node >= 23.6 (TS nativo) y NEXT_PUBLIC_MEDUSA_ALQUILER_KEY.

import fs from "node:fs"
import path from "node:path"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const KEY = process.env.NEXT_PUBLIC_MEDUSA_ALQUILER_KEY

if (!KEY) {
  console.error("Falta NEXT_PUBLIC_MEDUSA_ALQUILER_KEY en el entorno (.env.local)")
  process.exit(1)
}

const res = await fetch(
  `${MEDUSA_URL}/store/products?limit=100&fields=handle,title,description,thumbnail,+metadata`,
  { headers: { "x-publishable-api-key": KEY }, signal: AbortSignal.timeout(8000) }
)
if (!res.ok) {
  console.error(`Medusa respondió ${res.status}`)
  process.exit(1)
}
const { products } = await res.json()

const maquinas = (products ?? [])
  .filter((p: any) => p.metadata?.tipo === "maquinaria_alquiler")
  .sort((a: any, b: any) => (a.metadata.orden ?? 999) - (b.metadata.orden ?? 999))
  .map((p: any) => {
    const m = p.metadata
    return {
      handle: p.handle,
      titulo: p.title,
      marca: m.marca ?? "",
      categoria: m.categoria,
      categoriaSlug: m.categoriaSlug,
      descripcion: p.description ?? "",
      descripcionCorta: m.descripcionCorta ?? "",
      precioDesde: m.precioDesde ?? "Consultar precio",
      disponible: m.disponible ?? true,
      destacado: m.destacado ?? false,
      tension: m.tension ?? undefined,
      uso: m.uso ?? "ambos",
      perfilCliente: m.perfilCliente ?? "ambos",
      advertencia: m.advertencia ?? undefined,
      // Guardar la imagen como ruta relativa: el snapshot debe funcionar en
      // cualquier entorno (lib/maquinaria-alquiler.ts la prefija con
      // NEXT_PUBLIC_MEDUSA_URL al importar).
      imagen: (p.thumbnail ?? "").replace(MEDUSA_URL, ""),
      usos: m.usos ?? [],
      specs: m.specs ?? [],
      specsDestacadas: m.specsDestacadas ?? [],
      modelo: m.modelo ?? null,
      skuFabricante: m.skuFabricante ?? null,
      urlFichaFabricante: m.urlFichaFabricante ?? null,
      modeloConfirmadoFlota: m.modeloConfirmadoFlota ?? false,
    }
  })

if (!maquinas.length) {
  console.error("Medusa devolvió 0 máquinas — no piso el snapshot")
  process.exit(1)
}

const out = path.join(import.meta.dirname, "../lib/maquinaria-snapshot.json")
fs.writeFileSync(out, JSON.stringify(maquinas, null, 2) + "\n")
console.log(`Snapshot regenerado: ${maquinas.length} máquinas → lib/maquinaria-snapshot.json`)
