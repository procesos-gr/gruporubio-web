import { ProductCard } from "./ProductCard"

type Variant = {
  calculated_price?: { calculated_amount?: number | null } | null
}

type Product = {
  id: string
  handle: string
  title: string
  thumbnail: string | null
  variants?: Variant[]
}

type Props = {
  products: Product[]
  locale: string
}

export function ProductGrid({ products, locale }: Props) {
  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 32px", color: "#9CA3AF" }}>
        <p style={{ fontSize: 16 }}>No hay productos disponibles.</p>
      </div>
    )
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 24,
    }}>
      {products.map((product) => {
        const prices = (product.variants ?? [])
          .map((v) => v.calculated_price?.calculated_amount ?? null)
          .filter((p): p is number => p !== null)
        const minPrice = prices.length > 0 ? Math.min(...prices) : null

        return (
          <ProductCard
            key={product.id}
            handle={product.handle}
            title={product.title}
            thumbnail={product.thumbnail}
            minPrice={minPrice}
            currency="EUR"
            locale={locale}
          />
        )
      })}
    </div>
  )
}
