import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CatalogProvider } from './context/CatalogContext'
import { WishlistProvider } from './context/WishlistContext'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { CategoryPage } from './pages/CategoryPage'
import { SearchPage } from './pages/SearchPage'
import { SalePage } from './pages/SalePage'
import { BrandsPage } from './pages/BrandsPage'
import { BrandDetailPage } from './pages/BrandDetailPage'
import { WishlistPage } from './pages/WishlistPage'
import { RedirectPage } from './pages/RedirectPage'
import { AdminPage } from './pages/admin/AdminPage'
import {
  AboutPage,
  ContactPage,
  PrivacyPage,
  TermsPage,
  AffiliateDisclosurePage,
} from './pages/legal/LegalPages'

export default function App() {
  return (
    <BrowserRouter>
      <CatalogProvider>
        <WishlistProvider>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/go/:productId" element={<RedirectPage />} />
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="sale" element={<SalePage />} />
              <Route path="brands" element={<BrandsPage />} />
              <Route path="brands/:brand" element={<BrandDetailPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="affiliate-disclosure" element={<AffiliateDisclosurePage />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </CatalogProvider>
    </BrowserRouter>
  )
}
