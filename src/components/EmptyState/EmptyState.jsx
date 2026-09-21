// Shown when there is nothing to display (no results, no favorites, page not found).
// It has an icon, a title, an optional message, and any buttons passed as children.
export const EmptyState = ({ icon, title, message, children }) => (
  <div className="flex flex-col items-center gap-4 py-16 text-center max-w-xl mx-auto animate-fade-up">
    <span className="grid place-items-center w-24 h-24 rounded-full text-4xl ring-8 ring-brand-50 bg-brand-50 text-brand-500">
      {icon}
    </span>
    <h2 className="text-2xl sm:text-3xl font-bold text-ink">{title}</h2>
    {message && <p className="text-muted max-w-md">{message}</p>}
    {children && <div className="mt-2 flex flex-col items-center gap-5">{children}</div>}
  </div>
)
