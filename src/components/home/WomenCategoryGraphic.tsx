export function WomenCategoryGraphic() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-brand-900">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-black" />

      <div
        aria-hidden
        className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-accent/25 transition duration-500 group-hover:scale-110"
      />
      <div
        aria-hidden
        className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full border border-white/10 transition duration-500 group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-4 border border-accent/20 transition duration-500 group-hover:border-accent/35"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <span className="font-display text-[clamp(1.75rem,6vw,2.5rem)] font-semibold leading-none tracking-[0.32em] text-white transition duration-500 group-hover:tracking-[0.38em]">
          WOMEN
        </span>
        <span className="mt-4 h-px w-14 bg-accent transition duration-500 group-hover:w-20" />
      </div>
    </div>
  )
}
