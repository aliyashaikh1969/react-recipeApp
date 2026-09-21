import { Button } from '../Button/Button'
import { FavoriteButton } from '../FavoriteButton/FavoriteButton'
import { RecipeImage } from '../RecipeImage/RecipeImage'

// One recipe in a list: image, publisher, title, a favorite heart, and a link to the details page.
// Expects: recipe = { id, title, publisher, image_url }
export const RecipeCard = ({ recipe }) => (
  <article className="group relative flex flex-col w-full max-w-sm overflow-hidden p-5 gap-4 bg-white rounded-2xl border border-line shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
    <FavoriteButton recipe={recipe} />

    <div className="h-44 overflow-hidden rounded-xl bg-line/40">
      <RecipeImage
        src={recipe.image_url}
        alt={recipe.title}
        className="block w-full h-full object-cover group-hover:scale-105 transition duration-500"
      />
    </div>

    <span className="text-xs uppercase tracking-wide text-brand-600 font-semibold truncate">{recipe.publisher}</span>
    <h3 className="text-lg font-semibold text-ink truncate" title={recipe.title}>{recipe.title}</h3>

    <Button to={`/recipe-item/${recipe.id}`}>Recipe details</Button>
  </article>
)
