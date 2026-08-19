interface CategoryGraphicTileProps {
  label: string
  /** Slight layout variation so tiles don't look identical */
  variant?: 0 | 1 | 2 | 3
}

const CIRCLE_VARIANTS: Record<
  NonNullable<CategoryGraphicTileProps['variant']>,
  { top: string; bottom: string }
> = {
  0: {
    top: 'absolute -right-10 -top-10 h-44 w-44 rounded-full border border-accent/25 transition duration-500 group-hover:scale-110',
    bottom:
      'absolute -bottom-16 -left-16 h-56 w-56 rounded-full border border-white/10 transition duration-500 group-hover:scale-105',
  },
  1: {
    top: 'absolute -left-10 -top-8 h-40 w-40 rounded-full border border-accent/20 transition duration-500 group-hover:scale-110',
    bottom:
      'absolute -bottom-12 -right-14 h-52 w-52 rounded-full border border-white/10 transition duration-500 group-hover:scale-105',
  },
  2: {
    top: 'absolute -right-6 top-6 h-36 w-36 rounded-full border border-white/10 transition duration-500 group-hover:scale-110',
    bottom:
      'absolute -bottom-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full border border-accent/20 transition duration-500 group-hover:scale-105',
  },
  3: {
    top: 'absolute -left-8 top-4 h-44 w-44 rounded-full border border-white/10 transition duration-500 group-hover:scale-110',
    bottom:
      'absolute -bottom-14 -right-10 h-56 w-56 rounded-full border border-accent/25 transition duration-500 group-hover:scale-105',
  },
}

function labelTracking(label: string): string {
  const len = label.replace(/[^A-Z]/g, '').length
  if (len <= 3) return 'tracking-[0.42em] group-hover:tracking-[0.48em]'
  if (len <= 4) return 'tracking-[0.34em] group-hover:tracking-[0.4em]'
  return 'tracking-[0.26em] group-hover:tracking-[0.32em]'
}

export function CategoryGraphicTile({ label, variant = 0 }: CategoryGraphicTileProps) {
  const circles = CIRCLE_VARIANTS[variant]

  return (
    <div className="relative h-full w-full overflow-hidden bg-brand-900">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-black" />

      <div aria-hidden className={circles.top} />
      <div aria-hidden className={circles.bottom} />
      <div
        aria-hidden
        className="absolute inset-4 border border-accent/20 transition duration-500 group-hover:border-accent/35"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
        <span
          className={`font-display text-[clamp(1.5rem,5.5vw,2.5rem)] font-semibold leading-none text-white transition duration-500 ${labelTracking(label)}`}
        >
          {label}
        </span>
        <span className="mt-4 h-px w-14 bg-accent transition duration-500 group-hover:w-20" />
      </div>
    </div>
  )
}
