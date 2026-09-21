import { createContext, useContext, useState } from 'react'
import { ToastList } from '../components/Toast/ToastList'
import { TOAST_SECONDS } from '../config'

const ToastContext = createContext(null)

// Use this in any component that wants to show a small notification: const { showToast } = useToast()
export const useToast = () => useContext(ToastContext)

const MAX_TOASTS_ON_SCREEN = 3
let nextToastId = 1

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const removeToast = (id) => {
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
    }

    // Shows a message with an optional icon. It disappears by itself after a few seconds.
    const showToast = (message, icon = null) => {
        const id = nextToastId++
        const newToast = { id, message, icon }

        // Keep only the newest toasts if several appear at once.
        setToasts((currentToasts) => [...currentToasts.slice(-(MAX_TOASTS_ON_SCREEN - 1)), newToast])
        setTimeout(() => removeToast(id), TOAST_SECONDS * 1000)
    }

    return (
        <ToastContext value={{ showToast }}>
            {children}
            <ToastList toasts={toasts} onClose={removeToast} />
        </ToastContext>
    )
}
