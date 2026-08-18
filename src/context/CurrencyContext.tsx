import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Currency, Product } from '../types/product'
import {
  convertAmount,
  fetchExchangeRates,
  type ExchangeRateMap,
} from '../lib/exchangeRates'
import {
  formatPrice,
  formatPriceRange,
  getEffectivePrice,
  getProductCurrency,
  isOnSale,
  isPriceRange,
} from '../lib/pricing'

const STORAGE_KEY = 'jworld_display_currency'

interface CurrencyContextValue {
  displayCurrency: Currency
  setDisplayCurrency: (currency: Currency) => void
  rates: ExchangeRateMap
  ratesDate: string | null
  ratesLoading: boolean
  convertPrice: (amount: number, from: Currency) => number
  formatProductPrice: (product: Product) => string
  formatProductOriginalPrice: (product: Product) => string | null
  isConverted: (product: Product) => boolean
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

function readStoredCurrency(): Currency {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'USD' || stored === 'EUR' || stored === 'GBP' || stored === 'ILS') {
      return stored
    }
  } catch {
    // ignore
  }
  return 'USD'
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [displayCurrency, setDisplayCurrencyState] = useState<Currency>(readStoredCurrency)
  const [rates, setRates] = useState<ExchangeRateMap>({
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    ILS: 3.65,
  })
  const [ratesDate, setRatesDate] = useState<string | null>(null)
  const [ratesLoading, setRatesLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchExchangeRates().then(({ rates: nextRates, date }) => {
      if (!active) return
      setRates(nextRates)
      setRatesDate(date)
      setRatesLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const setDisplayCurrency = useCallback((currency: Currency) => {
    setDisplayCurrencyState(currency)
    try {
      localStorage.setItem(STORAGE_KEY, currency)
    } catch {
      // ignore
    }
  }, [])

  const convertPrice = useCallback(
    (amount: number, from: Currency) => convertAmount(amount, from, displayCurrency, rates),
    [displayCurrency, rates]
  )

  const formatProductPrice = useCallback(
    (product: Product) => {
      const from = getProductCurrency(product)
      const currency = displayCurrency

      if (isPriceRange(product)) {
        const max = product.originalPriceMax!
        if (isOnSale(product) && product.salePrice != null) {
          const saleMax = product.salePriceMax ?? product.salePrice
          return formatPriceRange(
            convertAmount(product.salePrice, from, currency, rates),
            convertAmount(saleMax, from, currency, rates),
            currency
          )
        }
        return formatPriceRange(
          convertAmount(product.originalPrice, from, currency, rates),
          convertAmount(max, from, currency, rates),
          currency
        )
      }

      const effective = getEffectivePrice(product)
      return formatPrice(convertAmount(effective, from, currency, rates), currency)
    },
    [displayCurrency, rates]
  )

  const formatProductOriginalPrice = useCallback(
    (product: Product) => {
      if (!isOnSale(product)) return null
      const from = getProductCurrency(product)
      const currency = displayCurrency

      if (isPriceRange(product) && product.originalPriceMax != null) {
        return formatPriceRange(
          convertAmount(product.originalPrice, from, currency, rates),
          convertAmount(product.originalPriceMax, from, currency, rates),
          currency
        )
      }

      return formatPrice(
        convertAmount(product.originalPrice, from, currency, rates),
        currency
      )
    },
    [displayCurrency, rates]
  )

  const isConverted = useCallback(
    (product: Product) => getProductCurrency(product) !== displayCurrency,
    [displayCurrency]
  )

  const value = useMemo(
    () => ({
      displayCurrency,
      setDisplayCurrency,
      rates,
      ratesDate,
      ratesLoading,
      convertPrice,
      formatProductPrice,
      formatProductOriginalPrice,
      isConverted,
    }),
    [
      displayCurrency,
      setDisplayCurrency,
      rates,
      ratesDate,
      ratesLoading,
      convertPrice,
      formatProductPrice,
      formatProductOriginalPrice,
      isConverted,
    ]
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
