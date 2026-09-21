import { LuTriangleAlert } from 'react-icons/lu'
import { Button } from '../Button/Button'

// Shown when something failed (for example the API request).
// `message` explains what went wrong. If `onRetry` is given, a "Try again" button is shown.
// Extra buttons can be passed as children.
export const ErrorMessage = ({ title = 'Something went wrong', message, onRetry, children }) => (
  <div
    className="flex flex-col items-center gap-4 py-16 text-center max-w-xl mx-auto animate-fade-up"
    role="alert"
  >
    <span className="grid place-items-center w-24 h-24 rounded-full text-4xl ring-8 ring-brand-50 bg-brand-100 text-brand-600">
      <LuTriangleAlert />
    </span>
    <h2 className="text-2xl sm:text-3xl font-bold text-ink">{title}</h2>
    {message && <p className="text-muted max-w-md">{message}</p>}
    <div className="mt-2 flex flex-wrap justify-center gap-3">
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
      {children}
    </div>
  </div>
)
