import type { Product } from '../types/product'
import { isLinkOnlyProduct } from './linkOnlyProduct'

export type GridSection = { type: 'regular' | 'link'; items: Product[] }

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size))
  }
  return rows
}

export function buildInterleavedSections(
  products: Product[],
  columns: number
): GridSection[] {
  const regular = products.filter((p) => !isLinkOnlyProduct(p))
  const linkOnly = products.filter(isLinkOnlyProduct)

  if (regular.length === 0) {
    return chunk(linkOnly, columns).map((items) => ({ type: 'link' as const, items }))
  }

  const sections: GridSection[] = []
  let linkIdx = 0

  for (let i = 0; i < regular.length; i += columns) {
    sections.push({ type: 'regular', items: regular.slice(i, i + columns) })

    if (linkIdx < linkOnly.length) {
      const linkRow = linkOnly.slice(linkIdx, linkIdx + columns)
      linkIdx += linkRow.length
      if (linkRow.length > 0) {
        sections.push({ type: 'link', items: linkRow })
      }
    }
  }

  while (linkIdx < linkOnly.length) {
    sections.push({ type: 'link', items: linkOnly.slice(linkIdx, linkIdx + columns) })
    linkIdx += columns
  }

  return sections
}
