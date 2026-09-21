import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar/Navbar'
import { Home } from './pages/Home/Home'
import { RecipeDetails } from './pages/RecipeDetails/RecipeDetails'
import { Favorites } from './pages/Favorites/Favorites'
import { NotFound } from './pages/NotFound/NotFound'

// The Navbar is outside <Routes>, so it stays on every page. Only the page below it changes.
function App() {
  return (
    <div className="min-h-screen px-4 sm:px-6 pb-12 bg-gradient-to-b from-brand-50 via-white to-accent-100/40 text-body text-base">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe-item/:id" element={<RecipeDetails />} />
        <Route path="/favourite" element={<Favorites />} />
        {/* "*" matches every other URL */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
