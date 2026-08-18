import type { Product } from '../types/product'

/** Returns a clean outbound redirect path — affiliate URL is never exposed in the DOM. */
export function getAffiliateRedirectPath(productId: string): string {
  return `/go/${productId}`
}

export function openAffiliateLink(product: Product): void {
  window.open(getAffiliateRedirectPath(product.id), '_blank', 'noopener,noreferrer')
}

export { formatPrice, formatProductPrice, formatProductOriginalPrice } from './pricing'
