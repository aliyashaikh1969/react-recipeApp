// A list of ingredients: quantity and unit on the left, description on the right.
// Expects: ingredients = [{ quantity, unit, description }]
export const IngredientList = ({ ingredients }) => (
  <>
    <h2 className="text-xl font-semibold text-ink mt-2">Ingredients</h2>
    <ul className="flex flex-col divide-y divide-line">
      {ingredients.map((ingredient, index) => (
        // The API gives ingredients no id, and descriptions can repeat, so the position is part of the key.
        <li key={`${index}-${ingredient.description}`} className="py-2 flex gap-2">
          <span className="font-semibold text-ink min-w-20">
            {ingredient.quantity} {ingredient.unit}
          </span>
          <span>{ingredient.description}</span>
        </li>
      ))}
    </ul>
  </>
)
