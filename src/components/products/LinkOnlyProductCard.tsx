import { ExternalLink, Tag } from 'lucide-react'
import type { Product } from '../../types/product'
import { getAffiliateStoreUrl } from '../../lib/affiliate'
import { isOnSale } from '../../lib/filters'
import { useCurrency } from '../../context/CurrencyContext'
import {
  hasMerchantDiscountNotice,
  MERCHANT_DISCOUNT_BADGE,
  MERCHANT_DISCOUNT_NOTICE,
  PRICE_DISCLAIMER,
} from '../../lib/merchantDiscount'
import { trackProductClick } from '../../lib/clickApi'
import { getLinkOnlyDisplayTitle } from '../../lib/linkOnlyProduct'
import { getProductCategories } from '../../lib/productCategories'
import { ProductPlaceholder } from './ProductPlaceholder'

interface LinkOnlyProductCardProps {
  product: Product
}

export function LinkOnlyProductCard({ product }: LinkOnlyProductCardProps) {
  const { formatProductPrice, formatProductOriginalPrice, isConverted } = useCurrency()
  const onSale = isOnSale(product)
  const showMerchantDiscount = hasMerchantDiscountNotice(product)
  const storeUrl = getAffiliateStoreUrl(product)
  const originalPriceLabel = formatProductOriginalPrice(product)
  const displayTitle = getLinkOnlyDisplayTitle(product)
  const primaryCategory = getProductCategories(product)[0] ?? product.category

  const handleStoreClick = () => {
    trackProductClick(product.id)
  }

  return (
    <article className="group animate-fade-in flex h-full flex-col ring-1 ring-accent/30 transition hover:ring-accent/50">
      <div className="relative aspect-[3/4] overflow-hidden">
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleStoreClick}
          className="block h-full w-full"
          aria-label={`View ${displayTitle} on merchant site`}
        >
          <ProductPlaceholder
            category={primaryCategory}
            subcategory={product.subcategory}
            className="transition duration-500 group-hover:opacity-95"
          />
        </a>

        <span className="absolute left-3 top-3 bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
          Store Link
        </span>

        {onSale && (
          <span className="absolute right-3 top-3 bg-brand-900 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Sale
          </span>
        )}

        {showMerchantDiscount && !onSale && (
          <span className="absolute right-3 top-3 flex items-center gap-1 bg-brand-900/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            <Tag className="h-3 w-3" />
            {MERCHANT_DISCOUNT_BADGE}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1.5 border-t border-accent/20 bg-brand-50/50 px-0.5 pt-3">
        {product.brand.trim() && (
          <span className="text-xs font-medium uppercase tracking-widest text-brand-800/60">
            {product.brand}
          </span>
        )}

        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleStoreClick}
          className="font-display text-base font-medium leading-snug text-brand-900 transition hover:text-accent line-clamp-2"
        >
          {displayTitle}
        </a>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-brand-900">
            {formatProductPrice(product)}
          </span>
          {onSale && originalPriceLabel && (
            <span className="text-sm text-brand-800/50 line-through">
              {originalPriceLabel}
            </span>
          )}
        </div>

        {showMerchantDiscount && (
          <p className="flex items-start gap-1.5 text-xs font-medium leading-snug text-accent">
            <Tag className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {MERCHANT_DISCOUNT_NOTICE}
          </p>
        )}

        <p className="text-[11px] leading-tight text-brand-800/45">
          {PRICE_DISCLAIMER}
          {isConverted(product) && " Converted at today's exchange rate."}
        </p>

        {product.sizes.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {product.sizes.slice(0, 6).map((size) => (
              <span
                key={size}
                className="border border-brand-200 px-1.5 py-0.5 text-[10px] font-medium text-brand-800/70"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleStoreClick}
          className="mt-auto flex items-center justify-center gap-2 border border-accent bg-brand-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-800"
        >
          Check at Store
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  )
}
