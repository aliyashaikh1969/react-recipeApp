import { useState } from 'react'
import { LuChefHat } from 'react-icons/lu'

// Shows a recipe image. If there is no image, or it fails to load, a placeholder is shown instead.
// Images load lazily (only when they are near the screen). Use `priority` for the main image of a page.
export const RecipeImage = ({ src, alt, className = '', priority = false }) => {
  // Remember which image failed, so a different image (new src) gets a fresh try.
  const [failedSrc, setFailedSrc] = useState(null)

  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full grid place-items-center bg-gradient-to-br from-brand-50 to-accent-100 text-brand-500/40 text-6xl"
      >
        <LuChefHat />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={className}
    />
  )
}
