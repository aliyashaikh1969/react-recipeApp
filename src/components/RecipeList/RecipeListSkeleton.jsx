import { recipeGridClasses } from './RecipeList'

// Grey placeholder cards shown while recipes are loading.
export const RecipeListSkeleton = ({ count = 8 }) => (
  <div className={recipeGridClasses} role="status" aria-label="Loading recipes">
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="w-full max-w-sm flex flex-col p-5 gap-4 bg-white rounded-2xl border border-line shadow-md animate-pulse"
      >
        <div className="h-44 rounded-xl bg-line"></div>
        <div className="h-3 w-1/3 rounded-full bg-line"></div>
        <div className="h-5 w-4/5 rounded-full bg-line"></div>
        <div className="h-11 rounded-full bg-line"></div>
      </div>
    ))}
  </div>
)
