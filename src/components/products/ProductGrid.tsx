import type { Product } from '../../types/product'
import { ProductCard } from './ProductCard'
import { LinkOnlyProductCard } from './LinkOnlyProductCard'
import { isLinkOnlyProduct } from '../../lib/linkOnlyProduct'
import { SearchX } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
  emptyMessage?: string
}

export function ProductGrid({
  products,
  emptyMessage = 'No products match your filters. Try adjusting your search or filters.',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <SearchX className="mb-4 h-12 w-12 text-brand-800/30" />
        <p className="max-w-md text-brand-800/60">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 items-stretch gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) =>
        isLinkOnlyProduct(product) ? (
          <LinkOnlyProductCard key={product.id} product={product} />
        ) : (
          <ProductCard key={product.id} product={product} />
        )
      )}
    </div>
  )
}
