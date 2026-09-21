import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { RecipeProvider } from './context/RecipeContext.jsx'

// Order matters:
// - BrowserRouter is outside RecipeProvider, because RecipeProvider uses navigate().
// - ToastProvider is outside RecipeProvider, because RecipeProvider shows toasts.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <RecipeProvider>
          <App />
        </RecipeProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
)
