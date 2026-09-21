import { FaRegHeart } from 'react-icons/fa'
import { useRecipes } from '../../context/RecipeContext'
import { RecipeList } from '../../components/RecipeList/RecipeList'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { SectionHeader } from '../../components/SectionHeader/SectionHeader'
import { SuggestionChips } from '../../components/SuggestionChips/SuggestionChips'
import { Button } from '../../components/Button/Button'
import { SUGGESTED_SEARCHES } from '../../config'

// Lists every recipe the user saved. The list comes from the shared context and localStorage.
export const Favorites = () => {
  const { favorites, handleSearch } = useRecipes()

  if (favorites.length === 0) {
    return (
      <>
        <title>Favourites | Food Recipe</title>
        <EmptyState
          icon={<FaRegHeart />}
          title="No favourites yet"
          message="You haven't added any favourite recipes yet. Tap the heart on any recipe to save it here."
        >
          <SuggestionChips terms={SUGGESTED_SEARCHES} onSelect={handleSearch} label="Find something to save:" />
          <Button variant="secondary" to="/">Browse popular recipes</Button>
        </EmptyState>
      </>
    )
  }

  return (
    <div className="py-10 mx-auto container">
      <title>Favourites | Food Recipe</title>
      <SectionHeader
        title="Your favourites"
        subtitle={`${favorites.length} saved ${favorites.length === 1 ? 'recipe' : 'recipes'}`}
      />
      <RecipeList recipes={favorites} />
    </div>
  )
}
