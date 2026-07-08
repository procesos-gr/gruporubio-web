// Optimiza imágenes fuente de public/ → WebP redimensionado con NOMBRE NUEVO
// (regla del proyecto: al reemplazar una imagen, nombre nuevo por la caché
// del optimizador de Next). Tras ejecutarlo hay que actualizar las
// referencias en código y borrar el archivo antiguo.
//
// Uso: node scripts/optimize-images.mjs
// Edita el MANIFEST según lo que toque optimizar.

import sharp from "sharp"
import { statSync } from "node:fs"
import { join } from "node:path"

const PUB = new URL("../public/", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")

// { in: ruta relativa a public/, out: ruta nueva, width: ancho máx, q: calidad }
const MANIFEST = [
  // Heros / banners (pantalla completa)
  { in: "images/hero/hero-banner-v6.png", out: "images/hero/hero-banner-v7.webp", width: 2560, q: 82 },
  { in: "images/tienda/banner-gpt2-v1-flotantes.jpg", out: "images/tienda/banner-gpt2-v1-flotantes-b.webp", width: 2560, q: 82 },
  // Brand story (columnas ~600px)
  { in: "images/tienda/brand-story/large.png", out: "images/tienda/brand-story/large-b.webp", width: 1200, q: 82 },
  { in: "images/tienda/brand-story/small-1.jpg", out: "images/tienda/brand-story/small-1-b.webp", width: 1200, q: 82 },
  { in: "images/tienda/brand-story/small-2.jpg", out: "images/tienda/brand-story/small-2-b.webp", width: 1200, q: 82 },
  // Nosotros
  { in: "images/nosotros/xanael-innovacion.webp", out: "images/nosotros/xanael-innovacion-b.webp", width: 1200, q: 82 },
  { in: "images/nosotros/hermanos-rubio-stand.webp", out: "images/nosotros/hermanos-rubio-stand-b.webp", width: 1200, q: 82 },
  { in: "images/nosotros/rsc-arenas.webp", out: "images/nosotros/rsc-arenas-b.webp", width: 1200, q: 82 },
  { in: "images/nosotros/rsc-covid.webp", out: "images/nosotros/rsc-covid-b.webp", width: 1200, q: 82 },
  // Servicios (detalle, ~50% del viewport)
  { in: "images/servicios/desinsectacion-de-carcoma/1-hq.webp", out: "images/servicios/desinsectacion-de-carcoma/1-hq-b.webp", width: 1600, q: 82 },
  { in: "images/servicios/limpiezas-en-altura/2.webp", out: "images/servicios/limpiezas-en-altura/2-b.webp", width: 1600, q: 82 },
  { in: "images/servicios/servicios-globales-de-higiene/2.webp", out: "images/servicios/servicios-globales-de-higiene/2-b.webp", width: 1600, q: 82 },
  { in: "images/servicios/tratamientos-de-legionela/1-hq.webp", out: "images/servicios/tratamientos-de-legionela/1-hq-b.webp", width: 1600, q: 82 },
  { in: "images/servicios/tratamientos-de-legionela/2-hq.webp", out: "images/servicios/tratamientos-de-legionela/2-hq-b.webp", width: 1600, q: 82 },
  { in: "images/servicios/formacion-de-manipulador-de-alimentos/1-hq-v2.webp", out: "images/servicios/formacion-de-manipulador-de-alimentos/1-hq-v3.webp", width: 1600, q: 82 },
  { in: "images/servicios/servicio-tecnico-oficial-karcher/1-hq.webp", out: "images/servicios/servicio-tecnico-oficial-karcher/1-hq-b.webp", width: 1600, q: 82 },
  { in: "images/servicios/ozonizacion/1-hq.webp", out: "images/servicios/ozonizacion/1-hq-b.webp", width: 1600, q: 82 },
  { in: "images/servicios/limpiezas-industriales/1.webp", out: "images/servicios/limpiezas-industriales/1-b.webp", width: 1600, q: 82 },
  // Home (cards del grid)
  { in: "images/home/limpiezas-industriales-home.webp", out: "images/home/limpiezas-industriales-home-b.webp", width: 1600, q: 82 },
  { in: "images/home/limpieza-alturas-v2.webp", out: "images/home/limpieza-alturas-v3.webp", width: 1600, q: 82 },
  { in: "images/home/tratamiento-suelos-v2.webp", out: "images/home/tratamiento-suelos-v3.webp", width: 1600, q: 82 },
  // Logos de clientes (se muestran a ~200px; alpha preservado)
  { in: "images/clients/logo-urzante.png", out: "images/clients/logo-urzante-b.webp", width: 512, q: 90 },
]

let before = 0
let after = 0
for (const item of MANIFEST) {
  const src = join(PUB, item.in)
  const dst = join(PUB, item.out)
  const inSize = statSync(src).size
  await sharp(src)
    .resize({ width: item.width, withoutEnlargement: true })
    .webp({ quality: item.q })
    .toFile(dst)
  const outSize = statSync(dst).size
  before += inSize
  after += outSize
  console.log(
    `${item.in}  ${(inSize / 1024).toFixed(0)}KB → ${item.out}  ${(outSize / 1024).toFixed(0)}KB`
  )
}
console.log(`\nTotal: ${(before / 1048576).toFixed(1)}MB → ${(after / 1048576).toFixed(1)}MB`)
