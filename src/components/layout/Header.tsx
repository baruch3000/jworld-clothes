import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Heart, Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import type { Category } from '../../types/product'
import { useWishlist } from '../../context/WishlistContext'
import { SiteLogo } from '../ui/SiteLogo'
import { CurrencySelector } from '../ui/CurrencySelector'
import { SITE_PRICE_NOTICE } from '../../lib/merchantDiscount'
import { NavCategoryMenu } from './NavCategoryMenu'

const NAV_CATEGORIES: Category[] = [
  'men',
  'women',
  'boys',
  'girls',
  'teen',
  'baby',
  'shoes',
  'occasions',
  'brands',
  'sale',
]

interface HeaderProps {
  searchValue: string
  onSearchChange: (value: string) => void
}

export function Header({ searchValue, onSearchChange }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { wishlist } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  const isAmazonFinds = location.pathname === '/amazon-finds'

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`)
      setMobileOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-brand-200 bg-brand-50/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl overflow-visible px-4 sm:px-6">
        <div className="flex h-[4.5rem] items-center justify-between gap-4 md:h-20">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3 transition hover:opacity-90"
          >
            <SiteLogo size="lg" />
            <span className="font-display text-[1.75rem] font-semibold leading-none tracking-tight sm:text-4xl md:text-[2.75rem]">
              J-World <span className="text-accent">Clothes</span>
            </span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-800/40" />
              <input
                type="search"
                placeholder="Search products, brands..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full border border-brand-200 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-brand-800"
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <CurrencySelector />
            </div>
            <Link
              to="/wishlist"
              className="relative flex h-9 w-9 items-center justify-center transition hover:text-accent"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-brand-900 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <p className="-mt-1 border-t border-brand-200/60 pb-2 pt-2 text-center text-[11px] font-medium leading-snug tracking-wide text-brand-800/65 sm:text-xs">
          {SITE_PRICE_NOTICE}
        </p>

        <nav className="relative z-[60] hidden overflow-visible border-t border-brand-200 md:block">
          <div className="flex items-center justify-between gap-2">
            <NavCategoryMenu categories={NAV_CATEGORIES} />
            <Link
              to="/amazon-finds"
              className={`shrink-0 whitespace-nowrap px-3 py-2 text-sm font-semibold transition ${
                isAmazonFinds
                  ? 'text-[#C45500]'
                  : 'text-brand-800/70 hover:text-[#C45500]'
              }`}
            >
              Amazon Finds
            </Link>
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <div className="border-t border-brand-200 bg-brand-50 md:hidden animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="border-b border-brand-200 p-4">
            <div className="mb-3 flex justify-end sm:hidden">
              <CurrencySelector />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-800/40" />
              <input
                type="search"
                placeholder="Search products, brands..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full border border-brand-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none"
              />
            </div>
          </form>
          <nav className="p-4">
            <NavCategoryMenu
              categories={NAV_CATEGORIES}
              variant="mobile"
              onNavigate={() => setMobileOpen(false)}
            />
            <Link
              to="/amazon-finds"
              onClick={() => setMobileOpen(false)}
              className="mt-2 block border-t border-brand-100 py-3 text-sm font-semibold text-[#C45500]"
            >
              Amazon Finds
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
