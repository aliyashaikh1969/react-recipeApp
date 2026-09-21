import { useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { useRecipes } from '../../context/RecipeContext'
import { MAX_SEARCH_LENGTH } from '../../config'
import { Button } from '../Button/Button'

// Removes spaces at both ends and collapses repeated spaces: "  chicken   soup " -> "chicken soup".
const cleanSearchText = (text) => text.trim().replace(/\s+/g, ' ')

// Returns a message if the search is not allowed, or an empty string if it is fine.
const getSearchError = (searchText) => {
  if (searchText === '') return 'Please enter a recipe name to search.'
  if (searchText.length > MAX_SEARCH_LENGTH) return `Search is too long (max ${MAX_SEARCH_LENGTH} characters).`
  return ''
}

// The search form. Pressing Enter or clicking Search runs the search.
// variant "hero": big input with a Search button (home page).  variant "navbar": compact input only.
export const SearchBar = ({ variant = 'navbar' }) => {
  const { searchInput, setSearchInput, handleSearch, loading } = useRecipes()
  const [errorMessage, setErrorMessage] = useState('')

  const isHero = variant === 'hero'

  const handleInputChange = (event) => {
    setSearchInput(event.target.value)
    setErrorMessage('') // hide the old error as soon as the user starts typing again
  }

  const handleSubmit = (event) => {
    event.preventDefault() // stop the browser from reloading the page

    const searchText = cleanSearchText(searchInput)
    const validationMessage = getSearchError(searchText)

    if (validationMessage) {
      setErrorMessage(validationMessage)
      return
    }
    handleSearch(searchText)
  }

  const inputClasses = isHero
    ? 'w-full py-4 pl-14 pr-5 rounded-full text-ink placeholder:text-muted bg-white outline-none shadow-md sm:shadow-none transition duration-200 focus:ring-4 focus:ring-white/50 sm:focus:ring-0'
    : `w-full py-3 pl-12 pr-6 rounded-full bg-white text-ink placeholder:text-muted outline-none border shadow-sm transition duration-200 focus:ring-2 ${
        errorMessage ? 'border-brand-500 ring-2 ring-brand-200' : 'border-line focus:border-brand-500 focus:ring-brand-200'
      }`

  const iconClasses = isHero
    ? 'absolute left-5 top-1/2 -translate-y-1/2 text-xl text-muted'
    : 'absolute left-5 top-3.5 text-muted'

  const errorClasses = isHero
    ? 'mt-3 inline-block rounded-full bg-white px-4 py-1 text-sm font-medium text-brand-600 shadow-sm'
    : 'absolute left-5 top-full mt-1 text-sm text-brand-600'

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={isHero ? 'w-full max-w-2xl' : 'relative w-full order-last lg:order-none lg:w-96 pb-1 lg:pb-0'}
    >
      <div className={isHero ? 'flex flex-col sm:flex-row gap-3 sm:gap-0 sm:bg-white sm:rounded-full sm:p-2 sm:shadow-lg' : ''}>
        <div className="relative flex-1">
          <LuSearch className={iconClasses} />
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Search recipes, e.g. pizza"
            aria-label="Search recipes"
            aria-invalid={Boolean(errorMessage)}
            className={inputClasses}
          />
        </div>

        {/* Not disabled while loading: a disabled submit button also blocks the Enter key. */}
        {isHero && (
          <Button type="submit" size="large">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        )}
      </div>

      {errorMessage && (
        <p role="alert" className={errorClasses}>
          {errorMessage}
        </p>
      )}
    </form>
  )
}
