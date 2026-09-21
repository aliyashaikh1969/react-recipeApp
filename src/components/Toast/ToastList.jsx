import { LuX } from 'react-icons/lu'

// Draws the toast notifications in the corner of the screen.
// The list of toasts and the timers live in ToastContext; this component only displays them.
export const ToastList = ({ toasts, onClose }) => (
  <div
    aria-live="polite"
    className="fixed z-50 inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 flex flex-col items-center sm:items-end gap-3 pointer-events-none"
  >
    {toasts.map((toast) => (
      <div
        key={toast.id}
        role="status"
        className="pointer-events-auto flex items-center gap-3 w-full sm:w-auto sm:max-w-sm px-4 py-3 rounded-2xl bg-white border border-line shadow-lg animate-toast-in"
      >
        {toast.icon && <span className="text-xl shrink-0 text-brand-500">{toast.icon}</span>}
        <p className="text-sm font-medium text-ink flex-1">{toast.message}</p>
        <button
          onClick={() => onClose(toast.id)}
          aria-label="Dismiss notification"
          className="shrink-0 p-1 rounded-full text-muted hover:text-ink hover:bg-line/60 cursor-pointer transition duration-200"
        >
          <LuX />
        </button>
      </div>
    ))}
  </div>
)
