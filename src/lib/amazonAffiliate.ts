import type { Product } from '../types/product'
import { isLinkOnlyProduct } from './linkOnlyProduct'

export const AMAZON_ASSOCIATE_DISCLOSURE =
  'As an Amazon Associate I earn from qualifying purchases.'

const AMAZON_HOST_PATTERN =
  /^(?:www\.)?(?:amazon\.(?:com|co\.uk|de|fr|it|es|ca|com\.au|co\.jp|in|com\.mx|com\.br|nl|se|pl|sg|ae|sa|eg)|amzn\.to|a\.co)(?:[:/]|$)/i

export function isAmazonAffiliateUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false

  try {
    const hostname = new URL(trimmed).hostname.replace(/^www\./i, '')
    return AMAZON_HOST_PATTERN.test(hostname)
  } catch {
    return AMAZON_HOST_PATTERN.test(trimmed)
  }
}

export function isAmazonLinkProduct(product: Product): boolean {
  if (!isLinkOnlyProduct(product)) return false
  if (product.amazonLink === true) return true
  return isAmazonAffiliateUrl(product.affiliateUrl)
}

export function splitAmazonLinkProducts(products: Product[]): {
  regular: Product[]
  amazon: Product[]
} {
  const regular: Product[] = []
  const amazon: Product[] = []

  for (const product of products) {
    if (isAmazonLinkProduct(product)) {
      amazon.push(product)
    } else {
      regular.push(product)
    }
  }

  return { regular, amazon }
}
