import { useEffect, useState } from 'react'
import { LuChefHat } from 'react-icons/lu'
import { fetchRecipes } from '../../services/recipeApi'
import { useRecipes } from '../../context/RecipeContext'
import { RecipeList } from '../../components/RecipeList/RecipeList'
import { RecipeListSkeleton } from '../../components/RecipeList/RecipeListSkeleton'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage'
import { SectionHeader } from '../../components/SectionHeader/SectionHeader'
import { SuggestionChips } from '../../components/SuggestionChips/SuggestionChips'
import { POPULAR_RECIPE_COUNT, POPULAR_SEARCH_TERM, SUGGESTED_SEARCHES } from '../../config'

// Shown on the home page until the user searches.
// Only this page needs the popular recipes, so they are loaded here instead of in the shared context.
export const PopularRecipes = () => {
  const { handleSearch } = useRecipes()

  const [popularRecipes, setPopularRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0) // changing this number runs the effect again

  useEffect(() => {
    // Set to true when the user leaves the page, so a late response does not update an unmounted page.
    let isCancelled = false

    const loadPopularRecipes = async () => {
      try {
        setLoading(true)
        setError('')

        const foundRecipes = await fetchRecipes(POPULAR_SEARCH_TERM)
        if (!isCancelled) setPopularRecipes(foundRecipes.slice(0, POPULAR_RECIPE_COUNT))
      } catch (err) {
        if (!isCancelled) setError(err.message)
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    loadPopularRecipes()

    return () => {
      isCancelled = true
    }
  }, [retryCount])

  const renderContent = () => {
    if (loading) return <RecipeListSkeleton count={POPULAR_RECIPE_COUNT} />

    if (error) {
      return (
        <ErrorMessage
          title="Couldn't load popular recipes"
          message={error}
          onRetry={() => setRetryCount(retryCount + 1)}
        />
      )
    }

    if (popularRecipes.length === 0) {
      return (
        <EmptyState icon={<LuChefHat />} title="No recipes to show yet" message="Search above, or start with one of these.">
          <SuggestionChips terms={SUGGESTED_SEARCHES} onSelect={handleSearch} />
        </EmptyState>
      )
    }

    return <RecipeList recipes={popularRecipes} />
  }

  return (
    <>
      <SectionHeader title="Popular recipes" subtitle="Crowd favourites to get you started" />
      {renderContent()}
    </>
  )
}
