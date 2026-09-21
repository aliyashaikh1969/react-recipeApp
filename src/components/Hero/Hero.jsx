import { useRecipes } from '../../context/RecipeContext'
import { SearchBar } from '../SearchBar/SearchBar'
import { SuggestionChips } from '../SuggestionChips/SuggestionChips'
import { SUGGESTED_SEARCHES } from '../../config'

// The big red banner at the top of the home page, with the search bar and quick searches.
export const Hero = () => {
  const { searchTerm, handleSearch } = useRecipes()

  // After a search the banner shrinks, so the results are visible without scrolling.
  const isCompact = searchTerm !== ''

  return (
    <section
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-accent-400 px-6 sm:px-12 text-center text-white shadow-lg transition-all duration-300 ${
        isCompact ? 'py-8 sm:py-10' : 'py-14 sm:py-20'
      }`}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10"></div>
      <div className="pointer-events-none absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-white/10"></div>

      <div className="relative mx-auto max-w-3xl flex flex-col items-center gap-6">
        <h1 className={`font-extrabold leading-tight ${isCompact ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl lg:text-6xl'}`}>
          What are you <span className="underline decoration-accent-100 decoration-4 underline-offset-8">cooking</span> today?
        </h1>

        {!isCompact && (
          <p className="text-lg sm:text-xl text-white/90">
            Search thousands of recipes, see what's in them, and save your favourites.
          </p>
        )}

        <SearchBar variant="hero" />

        <SuggestionChips terms={SUGGESTED_SEARCHES} onSelect={handleSearch} label="Try:" variant="onColor" />
      </div>
    </section>
  )
}
