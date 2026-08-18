import { Coins } from 'lucide-react'
import { DISPLAY_CURRENCIES } from '../../lib/exchangeRates'
import { CURRENCY_LABELS } from '../../lib/pricing'
import { useCurrency } from '../../context/CurrencyContext'
import type { Currency } from '../../types/product'

export function CurrencySelector() {
  const { displayCurrency, setDisplayCurrency, ratesLoading, ratesDate } = useCurrency()

  return (
    <div className="flex flex-col items-end gap-0.5">
      <label className="flex items-center gap-1.5">
        <Coins className="h-4 w-4 shrink-0 text-brand-800/50" aria-hidden="true" />
        <span className="sr-only">Display currency</span>
        <select
          value={displayCurrency}
          onChange={(e) => setDisplayCurrency(e.target.value as Currency)}
          className="cursor-pointer border border-brand-200 bg-white py-1.5 pl-2 pr-7 text-xs font-medium outline-none focus:border-brand-800"
          aria-label="Display currency"
        >
          {DISPLAY_CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {CURRENCY_LABELS[currency]}
            </option>
          ))}
        </select>
      </label>
      {!ratesLoading && ratesDate && (
        <span className="hidden text-[10px] text-brand-800/40 sm:block">
          Rates: {ratesDate}
        </span>
      )}
    </div>
  )
}
