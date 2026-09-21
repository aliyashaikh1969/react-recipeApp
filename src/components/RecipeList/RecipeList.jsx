import { RecipeCard } from '../RecipeCard/RecipeCard'

// The grid layout shared by the real list and the loading placeholder.
export const recipeGridClasses =
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 justify-items-center'

// Shows recipes as a responsive grid of cards: 1 column on phones up to 4 on wide screens.
export const RecipeList = ({ recipes }) => (
  <div className={`${recipeGridClasses} animate-fade-up`}>
    {recipes.map((recipe) => (
      <RecipeCard key={recipe.id} recipe={recipe} />
    ))}
  </div>
)
