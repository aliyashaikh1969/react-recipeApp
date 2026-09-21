import { createContext, useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import { LuHeartOff } from 'react-icons/lu'
import { fetchRecipes } from '../services/recipeApi'
import { loadFavorites, saveFavorites } from '../utils/storage'
import { useToast } from './ToastContext'

const RecipeContext = createContext(null)

// Use this in any component: const { recipes, favorites, handleSearch } = useRecipes()
export const useRecipes = () => useContext(RecipeContext)

// Holds the state that several pages share: the search and the favorites.
// Data that only one page needs (like one recipe's details) stays inside that page.
export const RecipeProvider = ({ children }) => {
    // ----- Search state -----
    const [searchInput, setSearchInput] = useState('') // what is typed in the search box
    const [searchTerm, setSearchTerm] = useState('')   // the term that was actually searched ('' = no search yet)
    const [recipes, setRecipes] = useState([])         // results of the last search
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // ----- Favorites state -----
    // Passing the function (not its result) means localStorage is read only once, on the first render.
    const [favorites, setFavorites] = useState(loadFavorites)

    const navigate = useNavigate()
    const { showToast } = useToast()

    // Counts searches. If a new search starts before the old one finishes,
    // the old response is ignored, so results never show for the wrong search.
    const latestSearchNumber = useRef(0)

    // ----- Search -----

    // Searches for a term, stores the results and shows the Home page.
    const handleSearch = async (term) => {
        latestSearchNumber.current += 1
        const thisSearchNumber = latestSearchNumber.current
        const isLatestSearch = () => thisSearchNumber === latestSearchNumber.current

        setSearchInput(term)
        setSearchTerm(term)
        setLoading(true)
        setError('')
        navigate('/')

        try {
            const foundRecipes = await fetchRecipes(term)
            if (isLatestSearch()) setRecipes(foundRecipes)
        } catch (err) {
            if (isLatestSearch()) {
                setRecipes([])
                setError(err.message)
            }
        } finally {
            if (isLatestSearch()) setLoading(false)
        }
    }

    // Runs the last search again (used by the "Try again" button).
    const retrySearch = () => handleSearch(searchTerm)

    // Goes back to the state before any search, and cancels a search that is still loading.
    const clearSearch = () => {
        latestSearchNumber.current += 1
        setSearchInput('')
        setSearchTerm('')
        setRecipes([])
        setLoading(false)
        setError('')
    }

    // ----- Favorites -----

    const isFavorite = (recipeId) => favorites.some((favorite) => favorite.id === recipeId)

    // Adds the recipe to favorites, or removes it if it is already there.
    const toggleFavorite = (recipe) => {
        const wasFavorite = isFavorite(recipe.id)

        const updatedFavorites = wasFavorite
            ? favorites.filter((favorite) => favorite.id !== recipe.id)
            : [...favorites, recipe]

        setFavorites(updatedFavorites)
        saveFavorites(updatedFavorites) // keep localStorage in sync so favorites survive a refresh

        if (wasFavorite) showToast(`Removed "${recipe.title}" from favourites`, <LuHeartOff />)
        else showToast(`Saved "${recipe.title}" to favourites`, <FaHeart />)
    }

    return (
        <RecipeContext
            value={{
                searchInput,
                setSearchInput,
                searchTerm,
                recipes,
                loading,
                error,
                handleSearch,
                retrySearch,
                clearSearch,
                favorites,
                isFavorite,
                toggleFavorite,
            }}
        >
            {children}
        </RecipeContext>
    )
}
