import { X } from 'lucide-react'
import { MEAL_TYPES } from '../../domain/constants'

function MealSelectorModal({ show, onClose, onSelectMealType }) {
  if (!show) return null

  return (
    <div className="recipe-meal-modal-overlay" onClick={onClose}>
      <div className="recipe-meal-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="recipe-meal-modal-head">
          <h3 className="recipe-meal-modal-title">언제 먹였나요?</h3>
          <button onClick={onClose} className="recipe-meal-modal-close">
            <X color="#BCAAA4" />
          </button>
        </div>

        <div className="recipe-meal-type-grid">
          {MEAL_TYPES.map((type) => (
            <button key={type} onClick={() => onSelectMealType(type)} className="recipe-meal-type-btn">
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MealSelectorModal
