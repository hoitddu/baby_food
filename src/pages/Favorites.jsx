import { useNavigate } from 'react-router-dom'
import { Heart, AlertTriangle } from 'lucide-react'
import { recipes } from '../data/recipes'
import RecipeImage from '../components/RecipeImage'
import { detectAllergyRisks } from '../domain/allergy'
import './favorites.css'

function Favorites({ favorites, toggleFavorite, preferences }) {
  const navigate = useNavigate()

  const favoriteRecipes = recipes.filter((recipe) => favorites[recipe.id])

  return (
    <div className="page-content">
      <header className="app-header favorites-header">
        <h1 className="favorites-title">
          <Heart fill="#FF5252" color="#FF5252" size={28} />
          찜한 레시피
        </h1>
        <p className="favorites-desc">아기가 좋아하는 메뉴만 모아봤어요!</p>
      </header>

      <div className="recipe-list">
        {favoriteRecipes.length === 0 ? (
          <div className="empty-state">
            <div className="favorites-empty-icon">💝</div>
            <p>
              아직 찜한 레시피가 없어요.
              <br />
              마음에 드는 메뉴에 하트를 눌러보세요.
            </p>
          </div>
        ) : (
          favoriteRecipes.map((recipe) => {
            const risks = detectAllergyRisks(recipe, preferences)
            const isSafe = risks.length === 0

            return (
              <div
                key={recipe.id}
                className="recipe-card fade-in"
                onClick={() => navigate(`/recipe/${recipe.id}`, { state: { recipe } })}
              >
                <RecipeImage
                  recipeName={recipe.name}
                  category={recipe.category}
                  imagePath={recipe.image}
                  height="180px"
                  borderRadius="12px 12px 0 0"
                />

                <div className="recipe-header">
                  <div className="favorites-recipe-main">
                    <h3 className="favorites-recipe-title">
                      {recipe.name}
                      {!isSafe && <AlertTriangle size={16} color="#FF5252" />}
                    </h3>
                    {!isSafe && (
                      <div className="favorites-recipe-risk">알레르기 주의 ({risks.join(', ')})</div>
                    )}
                  </div>

                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(recipe.id)
                    }}
                    className="favorites-heart-btn"
                  >
                    <Heart size={22} color="#FF5252" fill="#FF5252" />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="favorites-bottom-space" />
    </div>
  )
}

export default Favorites
