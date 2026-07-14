import snapshot from './maquinaria-snapshot.json'

export type EspecMaquina = {
  label: string
  valor: string
}

export type MaquinaAlquiler = {
  handle: string
  titulo: string
  marca: string
  categoria: string
  categoriaSlug: string
  descripcion: string
  descripcionCorta: string
  precioDesde: string
  disponible: boolean
  destacado?: boolean
  tension?: string
  uso: 'interior' | 'exterior' | 'ambos'
  perfilCliente: 'B2B' | 'B2C' | 'ambos'
  advertencia?: string
  imagen: string
  usos: string[]
  specs: EspecMaquina[]
  specsDestacadas: [string, string][]
  // Modelo de referencia (catálogo en Medusa, bundle de gruporubio-bot).
  // modeloConfirmadoFlota=false ⇒ modelo representativo de la categoría,
  // NO confirmado contra la flota real — la web lo señala como tal.
  modelo?: string | null
  skuFabricante?: string | null
  urlFichaFabricante?: string | null
  modeloConfirmadoFlota?: boolean
}

/**
 * Snapshot estático del catálogo de alquiler.
 *
 * La fuente de verdad es Medusa (sales channel "Alquiler Maquinaria") vía
 * `lib/maquinaria.ts`; este snapshot alimenta los client components (strip,
 * fallback del buscador del hero) y es la red de seguridad si Medusa cae.
 *
 * Regenerar tras editar maquinaria en Medusa: `npm run maquinaria:snapshot`
 */
export const MAQUINARIA: MaquinaAlquiler[] = snapshot as MaquinaAlquiler[]

export function getMaquina(handle: string): MaquinaAlquiler | undefined {
  return MAQUINARIA.find((m) => m.handle === handle)
}

export const CATEGORIAS = [...new Set(MAQUINARIA.map((m) => m.categoria))]

// Título enriquecido con la spec destacada principal (ej. "Fregadora conductor a pie — 2.000 m²/h")
// para capturar búsquedas long-tail por especificación, siguiendo el patrón de Kiloutou/Loxam.
export function getTituloConSpec(maquina: MaquinaAlquiler): string {
  const specPrincipal = maquina.specsDestacadas?.[0]?.[1]
  return specPrincipal ? `${maquina.titulo} — ${specPrincipal}` : maquina.titulo
}

export type ConsejoMaquina = { q: string; a: string }

const USO_LABEL: Record<MaquinaAlquiler['uso'], string> = {
  interior: 'Está pensada para uso en interior (naves, almacenes, locales cerrados).',
  exterior: 'Está pensada para uso en exterior (obra, fachadas, espacios abiertos).',
  ambos: 'Puede usarse tanto en interior como en exterior.',
}

const PERFIL_LABEL: Record<MaquinaAlquiler['perfilCliente'], string> = {
  B2B: 'Pensada para uso profesional/empresarial (naves, comunidades, empresas de servicios).',
  B2C: 'Apta también para particulares, sin necesidad de formación previa.',
  ambos: 'La alquilan tanto particulares como empresas, según el proyecto.',
}

// Deriva "consejos de uso" a partir de campos ya existentes (usos, uso, tensión, perfilCliente,
// advertencia) en vez de inventar contenido técnico nuevo sin verificar.
export function getMaquinaConsejos(maquina: MaquinaAlquiler): ConsejoMaquina[] {
  const casosUso = maquina.usos.length
    ? ` Casos de uso habituales: ${maquina.usos.join(', ')}.`
    : ''
  const consejos: ConsejoMaquina[] = [
    {
      q: `¿Para qué se usa el/la ${maquina.titulo}?`,
      a: `${maquina.descripcionCorta}${casosUso}`,
    },
    {
      q: '¿Se puede usar en interior o en exterior?',
      a: USO_LABEL[maquina.uso],
    },
    {
      q: '¿Es para particulares o para empresas?',
      a: PERFIL_LABEL[maquina.perfilCliente],
    },
  ]

  if (maquina.tension) {
    consejos.push({
      q: '¿Qué alimentación necesita?',
      a: `Funciona con ${maquina.tension.toLowerCase()}. Comprueba que tu instalación es compatible antes de reservar, o consúltanos y te asesoramos.`,
    })
  }

  if (maquina.advertencia) {
    consejos.push({ q: 'Antes de alquilarla, ten en cuenta:', a: maquina.advertencia })
  }

  return consejos
}
