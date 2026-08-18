import type { Product } from '../types/product'

/** Whether to show the merchant discount notice (defaults to true if unset). */
export function hasMerchantDiscountNotice(product: Product): boolean {
  return product.merchantDiscount !== false
}

export const MERCHANT_DISCOUNT_BADGE = 'Extra Savings'

export const MERCHANT_DISCOUNT_NOTICE =
  'Significant discount may apply on the merchant site — click to see the current offer & final price'

export const PRICE_DISCLAIMER =
  '*Price subject to change. Click to check current price & availability'

export const SITE_PRICE_NOTICE =
  'Guide prices only — click any product for the live price, often lower at the store'
