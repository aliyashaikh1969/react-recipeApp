import { NavLink, useLocation } from 'react-router-dom'
import { LuChefHat } from 'react-icons/lu'
import { FaHeart } from 'react-icons/fa'
import { useRecipes } from '../../context/RecipeContext'
import { SearchBar } from '../SearchBar/SearchBar'

// NavLink gives us `isActive`, so the link of the current page can look different.
const getLinkClasses = ({ isActive }) =>
  `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition duration-200 ${
    isActive ? 'bg-ink text-white shadow-sm' : 'text-body hover:bg-white hover:text-ink hover:shadow-sm'
  }`

// The sticky top bar: logo, search (on pages other than Home) and links to Home and Favorites.
// On small screens the search wraps under the logo and links, so no separate mobile menu is needed.
export const Navbar = () => {
  const { favorites } = useRecipes()
  const { pathname } = useLocation()

  // The home page already has a big search bar in the hero, so a second one would be a duplicate.
  const showSearchBar = pathname !== '/'

  return (
    <header className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 backdrop-blur-md bg-white/70 border-b border-line">
      <nav className="flex flex-wrap justify-between items-center py-3 lg:py-4 container mx-auto gap-3">
        <NavLink to="/" className="group text-xl font-bold text-ink flex items-center gap-2">
          <span className="grid place-items-center w-10 h-10 rounded-full bg-brand-500 text-white text-2xl shadow-sm transition duration-200 group-hover:scale-110 group-hover:-rotate-6">
            <LuChefHat />
          </span>
          Food recipe
        </NavLink>

        {showSearchBar && <SearchBar variant="navbar" />}

        <div className="flex items-center gap-2">
          <NavLink to="/" className={getLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/favourite" className={getLinkClasses}>
            Favourite
            {favorites.length > 0 && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-brand-500 text-white">
                <FaHeart /> {favorites.length}
              </span>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
