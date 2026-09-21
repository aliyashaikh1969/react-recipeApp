import { useState } from 'react'
import { LuSearchX } from 'react-icons/lu'
import { useRecipes } from '../../context/RecipeContext'
import { RecipeList } from '../../components/RecipeList/RecipeList'
import { RecipeListSkeleton } from '../../components/RecipeList/RecipeListSkeleton'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage'
import { SectionHeader } from '../../components/SectionHeader/SectionHeader'
import { SuggestionChips } from '../../components/SuggestionChips/SuggestionChips'
import { Button } from '../../components/Button/Button'
import { POPULAR_RECIPE_COUNT, RESULTS_PER_PAGE, SUGGESTED_SEARCHES } from '../../config'

// A search can match hundreds of recipes, so only some are shown at first and "Show more" reveals the rest.
// The parent gives this component key={searchTerm}, so every new search starts again from the first page.
const PagedRecipeList = ({ recipes }) => {
  const [visibleCount, setVisibleCount] = useState(RESULTS_PER_PAGE)
  const remainingCount = recipes.length - visibleCount

  return (
    <>
      <RecipeList recipes={recipes.slice(0, visibleCount)} />

      {remainingCount > 0 && (
        <div className="mt-10 flex justify-center">
          <Button variant="secondary" onClick={() => setVisibleCount(visibleCount + RESULTS_PER_PAGE)}>
            Show more ({remainingCount} left)
          </Button>
        </div>
      )}
    </>
  )
}

// The results of the user's search. It handles four cases: loading, error, no results, and results.
export const SearchResults = () => {
  const { searchTerm, recipes, loading, error, retrySearch, clearSearch, handleSearch } = useRecipes()

  if (loading) return <RecipeListSkeleton count={POPULAR_RECIPE_COUNT} />

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={retrySearch}>
        <Button variant="secondary" onClick={clearSearch}>Clear search</Button>
      </ErrorMessage>
    )
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon={<LuSearchX />}
        title={`No recipes found for "${searchTerm}"`}
        message="Check the spelling, or try a more general word."
      >
        <SuggestionChips terms={SUGGESTED_SEARCHES} onSelect={handleSearch} label="Popular searches:" />
        <Button variant="secondary" onClick={clearSearch}>See popular recipes</Button>
      </EmptyState>
    )
  }

  return (
    <>
      <SectionHeader
        title={`Results for "${searchTerm}"`}
        subtitle={`${recipes.length} ${recipes.length === 1 ? 'recipe' : 'recipes'} found`}
        action={<Button variant="link" onClick={clearSearch}>Clear search</Button>}
      />
      <PagedRecipeList key={searchTerm} recipes={recipes} />
    </>
  )
}
