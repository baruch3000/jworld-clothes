import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useCatalog } from '../../context/CatalogContext'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout() {
  const [searchValue, setSearchValue] = useState('')
  const { loading } = useCatalog()

  return (
    <div className="flex min-h-screen flex-col">
      <Header searchValue={searchValue} onSearchChange={setSearchValue} />
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-900" />
            <p className="text-sm text-brand-800/60">Loading products...</p>
          </div>
        ) : (
          <Outlet context={{ searchValue, setSearchValue }} />
        )}
      </main>
      <Footer />
    </div>
  )
}
