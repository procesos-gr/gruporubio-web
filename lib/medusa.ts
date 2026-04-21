import Medusa from "@medusajs/js-sdk"

let _medusa: Medusa | null = null

export function getMedusa(): Medusa {
  if (!_medusa) {
    _medusa = new Medusa({
      baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
      publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    })
  }
  return _medusa
}

export const medusa = new Proxy({} as Medusa, {
  get(_, prop) {
    return getMedusa()[prop as keyof Medusa]
  },
})
