import blurMap from "./blur-map.json"

// Props de blur para next/image en imágenes locales de public/images.
// El mapa se genera con `npm run img:blur` (re-ejecutar al añadir imágenes).
// Para rutas remotas o sin entrada devuelve {} — seguro de aplicar siempre.
const map = blurMap as Record<string, string>

export function blurProps(src: string): { placeholder: "blur"; blurDataURL: string } | Record<string, never> {
  const blurDataURL = map[src]
  return blurDataURL ? { placeholder: "blur", blurDataURL } : {}
}
