import { ADMIN_PASSCODE } from './storage'

export interface ProductClickStats {
  clicks: number
  lastClickAt: string | null
}

export type ClickStatsMap = Record<string, ProductClickStats>

export function trackProductClick(productId: string): void {
  const payload = JSON.stringify({ action: 'track', productId })

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([payload], { type: 'application/json' })
    navigator.sendBeacon('/api/clicks.php', blob)
    return
  }

  fetch('/api/clicks.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {})
}

export async function fetchClickStats(): Promise<ClickStatsMap> {
  const res = await fetch('/api/clicks.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'get', passcode: ADMIN_PASSCODE }),
  })

  if (!res.ok) {
    throw new Error('Could not load click stats')
  }

  const data = (await res.json()) as {
    success?: boolean
    stats?: { products?: ClickStatsMap }
  }

  return data.stats?.products ?? {}
}
