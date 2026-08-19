import type { Product } from '../types/product'

export function getAffiliateStoreUrl(product: Product): string {
  return product.affiliateUrl
}

export function openAffiliateLink(product: Product): void {
  window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer')
}

export { formatPrice, formatProductPrice, formatProductOriginalPrice } from './pricing'
