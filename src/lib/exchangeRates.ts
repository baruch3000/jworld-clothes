import type { Currency } from '../types/product'
import { getEffectivePrice, getEffectivePriceMax, getProductCurrency } from './pricing'
import type { Product } from '../types/product'

export const DISPLAY_CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'ILS']

const FALLBACK_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  ILS: 3.65,
}

const CACHE_KEY = 'jworld_fx_rates'
const CACHE_DATE_KEY = 'jworld_fx_date'

export type ExchangeRateMap = Record<Currency, number>

export function convertAmount(
  amount: number,
  from: Currency,
  to: Currency,
  rates: ExchangeRateMap
): number {
  if (from === to) return amount
  const usd = from === 'USD' ? amount : amount / rates[from]
  return to === 'USD' ? usd : usd * rates[to]
}

export function getCatalogDisplayPriceRange(
  products: Product[],
  displayCurrency: Currency,
  rates: ExchangeRateMap
): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 500 }

  const converted = products.flatMap((product) => {
    const currency = getProductCurrency(product)
    return [
      convertAmount(getEffectivePrice(product), currency, displayCurrency, rates),
      convertAmount(getEffectivePriceMax(product), currency, displayCurrency, rates),
    ]
  })

  return {
    min: Math.floor(Math.min(...converted)),
    max: Math.ceil(Math.max(...converted)),
  }
}

export async function fetchExchangeRates(): Promise<{ rates: ExchangeRateMap; date: string }> {
  const today = new Date().toISOString().slice(0, 10)

  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    const cachedDate = sessionStorage.getItem(CACHE_DATE_KEY)
    if (cached && cachedDate === today) {
      return { rates: JSON.parse(cached) as ExchangeRateMap, date: today }
    }
  } catch {
    // ignore cache read errors
  }

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD')
    const data = (await response.json()) as {
      result?: string
      rates?: Partial<Record<Currency, number>>
    }

    if (data.result === 'success' && data.rates) {
      const rates: ExchangeRateMap = {
        USD: 1,
        EUR: data.rates.EUR ?? FALLBACK_RATES.EUR,
        GBP: data.rates.GBP ?? FALLBACK_RATES.GBP,
        ILS: data.rates.ILS ?? FALLBACK_RATES.ILS,
      }
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(rates))
      sessionStorage.setItem(CACHE_DATE_KEY, today)
      return { rates, date: today }
    }
  } catch {
    // use fallback below
  }

  return { rates: FALLBACK_RATES, date: today }
}
