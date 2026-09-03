import { useMemo } from 'react'
import type { Category, Product } from '../../types/product'
import { isAmazonLinkProduct } from '../../lib/amazonAffiliate'
import { buildInterleavedSections } from '../../lib/interleavedGrid'
import { useGridColumnCount } from '../../hooks/useGridColumnCount'
import { ProductCard } from './ProductCard'
import { LinkOnlyProductCard } from './LinkOnlyProductCard'
import { AmazonProductCard } from './AmazonProductCard'
import { SearchX } from 'lucide-react'

interface InterleavedProductGridProps {
  products: Product[]
  pageCategory?: Category
  emptyMessage?: string
}

function renderProduct(product: Product, pageCategory?: Category) {
  if (isAmazonLinkProduct(product)) {
    return <AmazonProductCard key={product.id} product={product} pageCategory={pageCategory} />
  }
  if (product.linkOnly) {
    return <LinkOnlyProductCard key={product.id} product={product} pageCategory={pageCategory} />
  }
  return <ProductCard key={product.id} product={product} />
}

export function InterleavedProductGrid({
  products,
  pageCategory,
  emptyMessage = 'No products match your filters. Try adjusting your search or filters.',
}: InterleavedProductGridProps) {
  const columns = useGridColumnCount()
  const sections = useMemo(
    () => buildInterleavedSections(products, columns),
    [products, columns]
  )

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <SearchX className="mb-4 h-12 w-12 text-brand-800/30" />
        <p className="max-w-md text-brand-800/60">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div
          key={`${section.type}-${index}`}
          className={
            section.type === 'link'
              ? 'rounded border border-brand-200/80 bg-brand-50/40 p-3 sm:p-4'
              : undefined
          }
        >
          <div className="grid grid-cols-2 items-stretch gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {section.items.map((product) => renderProduct(product, pageCategory))}
          </div>
        </div>
      ))}
    </div>
  )
}
