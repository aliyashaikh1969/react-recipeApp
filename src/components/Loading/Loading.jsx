// A spinner with a short message, shown while one page or section is loading.
export const Loading = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-32" role="status">
    <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-500 animate-spin"></div>
    <p className="text-muted">{message}</p>
  </div>
)
