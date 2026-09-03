export const SIZE_BADGE_MANY_SMALL = 'Many sizes — Small'
export const SIZE_BADGE_MANY_LARGE = 'Many sizes — Large'

export const SIZE_RANGE_BADGES = [SIZE_BADGE_MANY_SMALL, SIZE_BADGE_MANY_LARGE] as const

export type SizeRangeBadge = (typeof SIZE_RANGE_BADGES)[number]

export function isSizeRangeBadge(size: string): size is SizeRangeBadge {
  return (SIZE_RANGE_BADGES as readonly string[]).includes(size)
}

export function partitionProductSizes(sizes: string[]): {
  badges: string[]
  regular: string[]
} {
  const badges: string[] = []
  const regular: string[] = []

  for (const size of sizes) {
    if (isSizeRangeBadge(size)) badges.push(size)
    else regular.push(size)
  }

  return { badges, regular }
}
