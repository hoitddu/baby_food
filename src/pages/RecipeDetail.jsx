import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import { RecipeDetailSkeleton } from '../components/SkeletonLoader'
import RecipeImage from '../components/RecipeImage'
import { recipes } from '../data/recipes'
import RecipeNotFoundView from '../components/recipe-detail/RecipeNotFoundView'
import MealSelectorModal from '../components/recipe-detail/MealSelectorModal'
import RecordToast from '../components/recipe-detail/RecordToast'
import RecipeIngredientsSection from '../components/recipe-detail/RecipeIngredientsSection'
import RecipeInstructionsSection from '../components/recipe-detail/RecipeInstructionsSection'
import '../components/recipe-detail/recipeDetail.css'

function RecipeDetail({ favorites, toggleFavorite, addMealToHistory }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()

  const routeRecipe = recipes.find((item) => item.id === id)
  const legacyIndexRecipe = Number.isNaN(Number(id)) ? null : recipes[Number(id)]
  const stateRecipe = location.state?.recipe || null
  const recipe = routeRecipe || legacyIndexRecipe || stateRecipe

  const [showMealSelector, setShowMealSelector] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoading && !recipe) {
    return <RecipeNotFoundView onGoHome={() => navigate('/')} />
  }

  if (isLoading) {
    return <RecipeDetailSkeleton />
  }

  const isFavorite = favorites[recipe.id]

  const handleRecord = (mealType) => {
    const today = new Date().toISOString().split('T')[0]
    addMealToHistory(today, mealType, recipe)
    setShowMealSelector(false)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  return (
    <div className="page-content recipe-detail-page">
      <div className="recipe-detail-header-wrap">
        <div className="recipe-detail-image-wrap">
          <RecipeImage
            recipeName={recipe.name}
            category={recipe.category}
            imagePath={recipe.image}
            height="300px"
            borderRadius="0 0 30px 30px"
          />

          <div className="recipe-detail-image-overlay" />

          <div className="recipe-detail-back-button-wrap" onClick={() => navigate(-1)}>
            <div className="recipe-detail-back-button">
              <ArrowLeft size={24} color="#5D4037" />
            </div>
          </div>
        </div>

        <div onClick={() => toggleFavorite(recipe.id)} className="recipe-detail-favorite-button">
          <Heart
            size={24}
            color={isFavorite ? '#FF5252' : '#D7CCC8'}
            fill={isFavorite ? '#FF5252' : 'none'}
            className="recipe-detail-favorite-icon"
          />
        </div>
      </div>

      <div className="recipe-detail-content">
        <h1 className="recipe-detail-title">{recipe.name}</h1>

        <div className="recipe-detail-category-badge">{recipe.category}</div>

        <RecipeIngredientsSection recipe={recipe} />
        <RecipeInstructionsSection recipe={recipe} />
      </div>

      <div className="recipe-detail-bottom-bar">
        <button onClick={() => setShowMealSelector(true)} className="recipe-detail-record-btn">
          <span>🍽️</span> 오늘 먹였어요
        </button>
      </div>

      <MealSelectorModal
        show={showMealSelector}
        onClose={() => setShowMealSelector(false)}
        onSelectMealType={handleRecord}
      />

      <RecordToast show={showToast} />
    </div>
  )
}

export default RecipeDetail
