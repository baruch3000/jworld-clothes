import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { CATEGORY_LABELS, type Category } from '../../types/product'
import { categoryPagePath } from '../../lib/categoryNav'
import { SUBCATEGORIES_BY_CATEGORY } from '../../lib/subcategories'

interface NavCategoryMenuProps {
  categories: Category[]
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
}

function DesktopNavItem({ category }: { category: Category }) {
  const subcategories = SUBCATEGORIES_BY_CATEGORY[category]
  const label = CATEGORY_LABELS[category]
  const href = categoryPagePath(category)

  if (!subcategories?.length) {
    return (
      <li>
        <Link
          to={href}
          className="whitespace-nowrap px-3 py-1.5 text-sm font-medium text-brand-800/70 transition hover:text-brand-900"
        >
          {label}
        </Link>
      </li>
    )
  }

  return (
    <li className="group relative">
      <Link
        to={href}
        className="flex items-center gap-0.5 whitespace-nowrap px-3 py-1.5 text-sm font-medium text-brand-800/70 transition hover:text-brand-900"
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5 opacity-50 transition group-hover:rotate-180" />
      </Link>

      <div className="pointer-events-none invisible absolute left-0 top-full z-[70] min-w-[240px] pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
        <div className="border border-brand-200 bg-white py-1 shadow-xl">
          <Link
            to={href}
            className="block px-4 py-2.5 text-sm font-semibold text-brand-900 transition hover:bg-brand-50"
          >
            All {label}
          </Link>
          <div className="my-1 border-t border-brand-100" />
          {subcategories.map((sub) => (
            <Link
              key={sub}
              to={categoryPagePath(category, sub)}
              className="block px-4 py-2 text-sm text-brand-800/75 transition hover:bg-brand-50 hover:text-brand-900"
            >
              {sub}
            </Link>
          ))}
        </div>
      </div>
    </li>
  )
}

function MobileNavItem({
  category,
  onNavigate,
}: {
  category: Category
  onNavigate?: () => void
}) {
  const subcategories = SUBCATEGORIES_BY_CATEGORY[category]
  const label = CATEGORY_LABELS[category]
  const href = categoryPagePath(category)

  if (!subcategories?.length) {
    return (
      <li>
        <Link to={href} onClick={onNavigate} className="block py-2.5 text-sm font-medium">
          {label}
        </Link>
      </li>
    )
  }

  return (
    <li className="border-b border-brand-100 last:border-0">
      <Link to={href} onClick={onNavigate} className="block py-2.5 text-sm font-semibold">
        {label}
      </Link>
      <ul className="pb-2 pl-3">
        {subcategories.map((sub) => (
          <li key={sub}>
            <Link
              to={categoryPagePath(category, sub)}
              onClick={onNavigate}
              className="block py-1.5 text-sm text-brand-800/65 hover:text-brand-900"
            >
              {sub}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  )
}

export function NavCategoryMenu({
  categories,
  variant = 'desktop',
  onNavigate,
}: NavCategoryMenuProps) {
  if (variant === 'mobile') {
    return (
      <ul className="space-y-0">
        {categories.map((cat) => (
          <MobileNavItem key={cat} category={cat} onNavigate={onNavigate} />
        ))}
      </ul>
    )
  }

  return (
    <ul className="flex items-center gap-1 overflow-visible py-2">
      {categories.map((cat) => (
        <DesktopNavItem key={cat} category={cat} />
      ))}
    </ul>
  )
}
