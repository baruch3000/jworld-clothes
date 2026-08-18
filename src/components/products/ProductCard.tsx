import { Heart, ExternalLink, Tag } from 'lucide-react'
import type { Product } from '../../types/product'
import { getAffiliateRedirectPath } from '../../lib/affiliate'
import { isOnSale } from '../../lib/filters'
import { useCurrency } from '../../context/CurrencyContext'
import {
  hasMerchantDiscountNotice,
  MERCHANT_DISCOUNT_BADGE,
  MERCHANT_DISCOUNT_NOTICE,
  PRICE_DISCLAIMER,
} from '../../lib/merchantDiscount'
import { useWishlist } from '../../context/WishlistContext'
import { LazyImage } from '../ui/LazyImage'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { isWishlisted, toggle } = useWishlist()
  const { formatProductPrice, formatProductOriginalPrice, isConverted } = useCurrency()
  const onSale = isOnSale(product)
  const showMerchantDiscount = hasMerchantDiscountNotice(product)
  const redirectPath = getAffiliateRedirectPath(product.id)
  const originalPriceLabel = formatProductOriginalPrice(product)

  const handleAffiliateClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.open(redirectPath, '_blank', 'noopener,noreferrer')
  }

  return (
    <article className="group animate-fade-in flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-100">
        <a
          href={redirectPath}
          onClick={handleAffiliateClick}
          rel="noopener noreferrer sponsored"
          className="block h-full w-full"
          aria-label={`View ${product.title} on merchant site`}
        >
          <LazyImage
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full product-image-zoom"
          />
        </a>

        {onSale && (
          <span className="absolute left-3 top-3 bg-brand-900 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Sale
          </span>
        )}

        {showMerchantDiscount && !onSale && (
          <span className="absolute left-3 top-3 flex items-center gap-1 bg-accent px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            <Tag className="h-3 w-3" />
            {MERCHANT_DISCOUNT_BADGE}
          </span>
        )}

        {showMerchantDiscount && onSale && (
          <span className="absolute left-3 top-11 flex items-center gap-1 bg-accent/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            + Store Deal
          </span>
        )}

        {!product.inStock && (
          <span className="absolute right-3 top-3 bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-800">
            Out of Stock
          </span>
        )}

        <button
          type="button"
          onClick={() => toggle(product.id)}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
          aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted(product.id)
                ? 'fill-red-500 text-red-500'
                : 'text-brand-800'
            }`}
          />
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-widest text-brand-800/60">
          {product.brand}
        </span>

        <a
          href={redirectPath}
          onClick={handleAffiliateClick}
          rel="noopener noreferrer sponsored"
          className="font-display text-base font-medium leading-snug text-brand-900 transition hover:text-accent line-clamp-2"
        >
          {product.title}
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
          {isConverted(product) && ' Converted at today\'s exchange rate.'}
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
            {product.sizes.length > 6 && (
              <span className="text-[10px] text-brand-800/50">
                +{product.sizes.length - 6}
              </span>
            )}
          </div>
        )}

        <a
          href={redirectPath}
          onClick={handleAffiliateClick}
          rel="noopener noreferrer sponsored"
          className="mt-3 flex items-center justify-center gap-2 border border-brand-900 bg-brand-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-800"
        >
          Check Current Price &amp; Buy
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  )
}
