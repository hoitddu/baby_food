import { Home as HomeIcon } from 'lucide-react'

function RecipeNotFoundView({ onGoHome }) {
  return (
    <div className="recipe-not-found">
      <div className="recipe-not-found-icon">😵</div>
      <h2 className="recipe-not-found-title">레시피를 찾을 수 없어요</h2>
      <p className="recipe-not-found-desc">
        요청하신 레시피 정보를 불러올 수 없습니다.<br />
        다시 시도해주세요.
      </p>
      <button onClick={onGoHome} className="recipe-not-found-btn">
        <HomeIcon size={20} />
        홈으로 돌아가기
      </button>
    </div>
  )
}

export default RecipeNotFoundView
