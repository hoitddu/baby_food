import { AlertTriangle, Heart } from 'lucide-react'
import { RecipeListSkeleton } from '../SkeletonLoader'
import HighlightText from '../HighlightText'
import { detectAllergyRisks } from '../../domain/allergy'
import { getCategoryTheme } from '../../domain/categoryTheme'

function HomeRecipeList({
  isLoading,
  filteredRecipes,
  preferences,
  favorites,
  debouncedSearchTerm,
  onRecipeClick,
  onToggleFavorite
}) {
  if (isLoading) {
    return (
      <div className="recipe-list">
        <RecipeListSkeleton count={6} />
      </div>
    )
  }

  if (filteredRecipes.length === 0) {
    return (
      <div className="recipe-list">
        <div className="empty-state">
          <div className="home-empty-icon">🔍</div>
          <p>
            검색 결과가 없어요<br />
            다른 검색어로 찾아보세요
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="recipe-list">
      {filteredRecipes.map((recipe) => {
        const risks = detectAllergyRisks(recipe, preferences)
        const isSafe = risks.length === 0
        const isFavorite = favorites[recipe.id]
        const theme = getCategoryTheme(recipe.category)

        return (
          <div
            key={recipe.id}
            className={`recipe-card fade-in home-recipe-card ${isSafe ? '' : 'unsafe'}`.trim()}
            onClick={() => onRecipeClick(recipe)}
          >
            <div className="recipe-header">
              <div className="home-recipe-main">
                <h3 className="home-recipe-title">
                  <span>
                    <HighlightText text={recipe.name} searchTerm={debouncedSearchTerm} />
                  </span>
                  {!isSafe && <AlertTriangle size={16} color="#FF5252" />}
                </h3>

                <span
                  className="home-recipe-category-badge"
                  style={{
                    '--category-bg': theme.bg,
                    '--category-border': theme.border,
                    '--category-text': theme.text
                  }}
                >
                  {recipe.category}
                </span>

                {!isSafe && (
                  <div className="home-recipe-risk">
                    알레르기 주의 ({risks.join(', ')})
                  </div>
                )}
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(recipe.id)
                }}
                className="home-favorite-button"
              >
                <Heart
                  size={22}
                  color={isFavorite ? '#FF5252' : '#D7CCC8'}
                  fill={isFavorite ? '#FF5252' : 'none'}
                  className="home-favorite-icon"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default HomeRecipeList