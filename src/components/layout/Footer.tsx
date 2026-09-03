import { Link } from 'react-router-dom'
import { AmazonAssociateDisclosure } from '../legal/AmazonAssociateDisclosure'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-semibold">J-World Clothes</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-800/60">
              Modest fashion from well-known brands — curated for you. Shop directly with trusted merchants.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Pages</h4>
            <ul className="mt-3 space-y-2 text-sm text-brand-800/70">
              <li><Link to="/about" className="transition hover:text-brand-900">About Us</Link></li>
              <li><Link to="/contact" className="transition hover:text-brand-900">Contact</Link></li>
              <li><Link to="/privacy" className="transition hover:text-brand-900">Privacy Policy</Link></li>
              <li><Link to="/terms" className="transition hover:text-brand-900">Terms of Service</Link></li>
              <li><Link to="/affiliate-disclosure" className="transition hover:text-brand-900">Affiliate Disclosure</Link></li>
              <li><Link to="/admin" className="transition hover:text-brand-900">Site Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Affiliate Disclaimer</h4>
            <p className="mt-3 text-xs leading-relaxed text-brand-800/50">
              Product prices and availability are accurate as of the date/time indicated and are subject to change.
              Any price and availability information displayed on the merchant site at the time of purchase will apply.
              As an affiliate, we may earn commissions from qualifying purchases.
            </p>
            <AmazonAssociateDisclosure className="mt-3 text-xs" />
          </div>
        </div>

        <div className="mt-10 border-t border-brand-200 pt-6 text-center text-xs text-brand-800/40">
          &copy; {new Date().getFullYear()} J-World Clothes. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
