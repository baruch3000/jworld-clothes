import { ExternalLink, Tag } from 'lucide-react'
import type { Category, Product } from '../../types/product'
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
import {
  getLinkOnlyDisplayTitle,
  getLinkOnlyPlaceholderCategory,
  getLinkOnlyPlaceholderSubcategory,
} from '../../lib/linkOnlyProduct'
import { ProductPlaceholder } from './ProductPlaceholder'
import { ProductSizeList } from './ProductSizeList'

interface AmazonProductCardProps {
  product: Product
  pageCategory?: Category
}

export function AmazonProductCard({ product, pageCategory }: AmazonProductCardProps) {
  const { formatProductPrice, formatProductOriginalPrice, isConverted } = useCurrency()
  const onSale = isOnSale(product)
  const showMerchantDiscount = hasMerchantDiscountNotice(product)
  const storeUrl = getAffiliateStoreUrl(product)
  const originalPriceLabel = formatProductOriginalPrice(product)
  const displayTitle = getLinkOnlyDisplayTitle(product, pageCategory)
  const placeholderCategory = getLinkOnlyPlaceholderCategory(product, pageCategory)
  const placeholderSubcategory = getLinkOnlyPlaceholderSubcategory(product, pageCategory)

  const handleStoreClick = () => {
    trackProductClick(product.id)
  }

  return (
    <article className="group animate-fade-in flex h-full flex-col ring-1 ring-[#FF9900]/40 transition hover:ring-[#FF9900]/60">
      <div className="relative aspect-[16/10] overflow-hidden">
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleStoreClick}
          className="block h-full w-full"
          aria-label={`See ${displayTitle} on Amazon (paid link)`}
        >
          <ProductPlaceholder
            category={placeholderCategory}
            subcategory={placeholderSubcategory}
            compact
            className="transition duration-500 group-hover:opacity-95"
          />
        </a>

        <span className="absolute left-3 top-3 bg-[#232F3E] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FF9900]">
          Amazon
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

      <div className="mt-3 flex flex-1 flex-col gap-1.5 border-t border-[#FF9900]/20 bg-brand-50/50 px-0.5 pt-3">
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
          className="font-display text-base font-medium leading-snug text-brand-900 transition hover:text-accent"
        >
          <span className="line-clamp-2">{displayTitle}</span>
          <span className="mt-0.5 block text-[11px] font-normal normal-case tracking-normal text-brand-800/50">
            (paid link)
          </span>
        </a>

        {product.shortDescription?.trim() && (
          <p className="text-sm leading-snug text-brand-800/70 line-clamp-2">
            {product.shortDescription.trim()}
          </p>
        )}

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

        <ProductSizeList sizes={product.sizes} />

        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleStoreClick}
          className="mt-auto flex items-center justify-center gap-2 border border-[#FF9900] bg-[#232F3E] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#37475A]"
        >
          See on Amazon
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  )
}
