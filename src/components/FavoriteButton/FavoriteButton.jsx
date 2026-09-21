import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { useRecipes } from '../../context/RecipeContext'
import { Button } from '../Button/Button'

// The heart button that adds or removes a recipe from favorites.
// variant "icon": a round heart on top of a recipe card.
// variant "labelled": a heart with "Save" / "Saved" text (used on the recipe details page).
export const FavoriteButton = ({ recipe, variant = 'icon' }) => {
  const { isFavorite, toggleFavorite } = useRecipes()

  const isSaved = isFavorite(recipe.id)
  const label = isSaved ? 'Remove from favourites' : 'Save as favourite'
  const heartIcon = isSaved ? <FaHeart /> : <FaRegHeart />

  if (variant === 'labelled') {
    return (
      <Button onClick={() => toggleFavorite(recipe)} aria-label={label}>
        {heartIcon}
        {isSaved ? 'Saved' : 'Save'}
      </Button>
    )
  }

  return (
    <button
      onClick={() => toggleFavorite(recipe)}
      aria-label={label}
      className="absolute z-10 top-7 right-7 grid place-items-center w-10 h-10 rounded-full bg-white/90 backdrop-blur border border-line shadow-md text-brand-500 text-xl cursor-pointer transition duration-200 hover:scale-110 active:scale-90"
    >
      {heartIcon}
    </button>
  )
}
