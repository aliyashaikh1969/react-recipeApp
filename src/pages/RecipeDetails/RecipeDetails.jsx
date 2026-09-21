import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LuArrowLeft, LuExternalLink } from 'react-icons/lu'
import { getRecipeDetails } from '../../services/recipeApi'
import { Loading } from '../../components/Loading/Loading'
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage'
import { RecipeImage } from '../../components/RecipeImage/RecipeImage'
import { FavoriteButton } from '../../components/FavoriteButton/FavoriteButton'
import { Button } from '../../components/Button/Button'
import { IngredientList } from './IngredientList'

// Shows one recipe. The recipe id comes from the URL (/recipe-item/:id).
// Only this page needs the recipe details, so they are kept in local state instead of the shared context.
export const RecipeDetails = () => {
  const { id } = useParams()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0) // changing this number runs the effect again

  // Load the recipe when the page opens, when the id in the URL changes, or when "Try again" is clicked.
  useEffect(() => {
    // Set to true when the user leaves the page, so a late response does not update an unmounted page.
    let isCancelled = false

    const loadRecipe = async () => {
      try {
        setLoading(true)
        setError('')

        const foundRecipe = await getRecipeDetails(id)
        if (!isCancelled) setRecipe(foundRecipe)
      } catch (err) {
        if (!isCancelled) setError(err.message)
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    loadRecipe()

    return () => {
      isCancelled = true
    }
  }, [id, retryCount])

  if (error) {
    return (
      <ErrorMessage
        title="We couldn't load this recipe"
        message={error}
        onRetry={() => setRetryCount(retryCount + 1)}
      >
        <Button variant="secondary" to="/">Back to recipes</Button>
      </ErrorMessage>
    )
  }

  // recipe.id !== id means we still hold the previous recipe while the new one is loading.
  if (loading || !recipe || recipe.id !== id) return <Loading message="Loading recipe..." />

  return (
    <div className="container mx-auto py-8">
      <title>{`${recipe.title} | Food Recipe`}</title>

      <Button to="/" variant="link" className="mb-6">
        <LuArrowLeft /> Back to recipes
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 lg:p-10 bg-white rounded-3xl border border-line shadow-lg animate-fade-up">
        {/* Image */}
        <div className="h-80 lg:h-[28rem] lg:sticky lg:top-28 self-start overflow-hidden rounded-2xl bg-line/40 group">
          <RecipeImage
            src={recipe.image_url}
            alt={recipe.title}
            priority
            className="block w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-wide text-brand-600 font-semibold">{recipe.publisher}</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink">{recipe.title}</h1>

          <div className="flex flex-wrap gap-3 text-sm font-medium">
            {recipe.cooking_time && (
              <span className="px-3 py-1 rounded-full bg-accent-100 text-accent-700">{recipe.cooking_time} min</span>
            )}
            {recipe.servings && (
              <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-600">{recipe.servings} servings</span>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <FavoriteButton recipe={recipe} variant="labelled" />
            {/* The API has no cooking steps, so we link to the publisher's page for the full directions. */}
            {recipe.source_url && (
              <Button variant="secondary" href={recipe.source_url} target="_blank" rel="noreferrer">
                Directions <LuExternalLink />
              </Button>
            )}
          </div>

          <IngredientList ingredients={recipe.ingredients} />
        </div>
      </div>
    </div>
  )
}
