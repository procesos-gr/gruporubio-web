import { routing } from "@/i18n/routing";

export const SITE_URL = "https://gruporubio.es";

/**
 * Construye el bloque `alternates` (canonical + hreflang) para una ruta dada.
 * `path` va SIN locale y SIN slash inicial, ej: "" para home, "servicios/limpiezas-industriales".
 */
export function buildAlternates(locale: string, path: string = "") {
  const suffix = path ? `/${path}` : "";
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}${suffix}`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${suffix}`;

  return {
    canonical: `${SITE_URL}/${locale}${suffix}`,
    languages,
  };
}
