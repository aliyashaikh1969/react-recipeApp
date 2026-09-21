const chipClasses = {
  onColor: 'bg-white/20 text-white backdrop-blur-sm hover:bg-white hover:text-brand-600',
  light: 'bg-white text-body border border-line shadow-sm hover:border-brand-500 hover:text-brand-600',
}

const labelClasses = {
  onColor: 'text-white/80',
  light: 'text-muted',
}

// A row of quick-search buttons. Clicking one calls onSelect(term).
// variant: "onColor" (on the red hero) | "light" (on the normal page background)
export const SuggestionChips = ({ terms, onSelect, label, variant = 'light' }) => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {label && <span className={`text-sm ${labelClasses[variant]}`}>{label}</span>}
    {terms.map((term) => (
      <button
        key={term}
        type="button"
        onClick={() => onSelect(term)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition duration-200 active:scale-95 ${chipClasses[variant]}`}
      >
        {term}
      </button>
    ))}
  </div>
)
