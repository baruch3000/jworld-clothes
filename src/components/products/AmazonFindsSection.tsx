import type { Product } from '../../types/product'
import { AmazonAssociateDisclosure } from '../legal/AmazonAssociateDisclosure'
import { AmazonProductCard } from './AmazonProductCard'

interface AmazonFindsSectionProps {
  products: Product[]
  title?: string
  hideTitle?: boolean
  showDisclosure?: boolean
  className?: string
}

export function AmazonFindsSection({
  products,
  title = 'Amazon Finds',
  hideTitle = false,
  showDisclosure = true,
  className = '',
}: AmazonFindsSectionProps) {
  if (products.length === 0) return null

  return (
    <section className={`mt-12 border-t border-brand-200 pt-10 ${className}`.trim()}>
      {!hideTitle && (
        <h2 className="mb-6 font-display text-xl font-semibold md:text-2xl">{title}</h2>
      )}

      <div className="grid grid-cols-2 items-stretch gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <AmazonProductCard key={product.id} product={product} />
        ))}
      </div>

      {showDisclosure && (
        <AmazonAssociateDisclosure className="mt-8 rounded border border-brand-200 bg-brand-50 px-4 py-3" />
      )}
    </section>
  )
}
