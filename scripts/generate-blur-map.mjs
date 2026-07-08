// Genera lib/blur-map.json: miniatura base64 (blurDataURL) por cada imagen
// local de public/images, para placeholder="blur" en next/image.
//
// Uso: npm run img:blur  — re-ejecutar al añadir o renombrar imágenes.
// Se excluyen logos/iconos (clients, brand): no necesitan blur.

import sharp from "sharp"
import { readdirSync, statSync, writeFileSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const PUB = fileURLToPath(new URL("../public", import.meta.url))
const OUT = fileURLToPath(new URL("../lib/blur-map.json", import.meta.url))
const EXCLUDE = [join(PUB, "images", "clients"), join(PUB, "images", "brand")]

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (/\.(jpe?g|png|webp)$/i.test(name)) out.push(p)
  }
  return out
}

const files = walk(join(PUB, "images")).filter(
  (f) => !EXCLUDE.some((dir) => f.startsWith(dir))
)

const map = {}
for (const file of files) {
  const buf = await sharp(file).resize({ width: 10 }).webp({ quality: 40 }).toBuffer()
  const key = "/" + relative(PUB, file).replace(/\\/g, "/")
  map[key] = `data:image/webp;base64,${buf.toString("base64")}`
}

writeFileSync(OUT, JSON.stringify(map, null, 0) + "\n")
console.log(`lib/blur-map.json generado: ${Object.keys(map).length} imágenes, ${(statSync(OUT).size / 1024).toFixed(1)} KB`)
