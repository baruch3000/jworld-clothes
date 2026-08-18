export interface ParsedAffiliateLink {
  url: string
  title?: string
}

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

/** Extract affiliate URL (and optional product title) from plain URL or pasted HTML. */
export function parseAffiliateInput(raw: string): ParsedAffiliateLink | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const hrefMatch = trimmed.match(/href\s*=\s*["']([^"']+)["']/i)
  if (hrefMatch?.[1]) {
    const url = sanitizeUrl(decodeBasicEntities(hrefMatch[1]))
    if (!url) return null

    const titleMatch = trimmed.match(/href\s*=\s*["'][^"']+["'][^>]*>([^<]+)</i)
    const title = titleMatch?.[1]?.trim()
    return title ? { url, title } : { url }
  }

  const urlMatch = trimmed.match(/https?:\/\/[^\s"'<>]+/i)
  if (urlMatch) {
    const url = sanitizeUrl(urlMatch[0])
    return url ? { url } : null
  }

  return null
}

function sanitizeUrl(value: string): string | null {
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString()
  } catch {
    return null
  }
}

export function isValidAffiliateUrl(value: string): boolean {
  return parseAffiliateInput(value) !== null
}
