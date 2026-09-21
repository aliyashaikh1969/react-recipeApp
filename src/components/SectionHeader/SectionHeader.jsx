// A section title with an optional subtitle and an optional element on the right (like a button).
export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-ink">{title}</h2>
      {subtitle && <p className="text-muted">{subtitle}</p>}
    </div>
    {action}
  </div>
)
