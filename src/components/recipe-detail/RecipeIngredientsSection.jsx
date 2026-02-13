import { ChefHat } from 'lucide-react'

function RecipeIngredientsSection({ recipe }) {
  const ingredients = (recipe.ingredients || recipe.original_full_text || '').split(/[,،]/)
  const visualLength = (recipe.ingredients || '').split(',').length

  return (
    <div className="recipe-section">
      <h3 className="recipe-section-title">
        <ChefHat size={22} /> 재료 준비하기
      </h3>
      <div className="recipe-section-card">
        {ingredients.map((ingredient, idx) => {
          const trimmed = ingredient.trim()
          if (!trimmed) return null

          return (
            <div
              key={idx}
              className={`recipe-ingredient-item ${idx < visualLength - 1 ? 'with-divider' : ''}`}
            >
              <div className="recipe-ingredient-check" />
              <span className="recipe-ingredient-text">{trimmed}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecipeIngredientsSection
