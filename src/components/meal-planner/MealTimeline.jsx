import { Trash2 } from 'lucide-react'
import { DAY_NAMES_KO } from '../../domain/constants'

function MealTimeline({ groupedHistory, onOpenRecipe, onRemoveMeal }) {
  const sortedDates = Object.keys(groupedHistory).sort((a, b) => new Date(b) - new Date(a))

  if (sortedDates.length === 0) {
    return (
      <div className="planner-timeline">
        <div className="empty-state">
          <div className="planner-empty-icon">📷</div>
          <p>아직 기록이 없어요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="planner-timeline">
      {sortedDates.map((date) => {
        const dayRecords = groupedHistory[date]
        const d = new Date(date)
        const dayName = DAY_NAMES_KO[d.getDay()]

        return (
          <div key={date} className="planner-day-group">
            <h3 className="planner-day-title">
              {d.getMonth() + 1}월 {d.getDate()}일 ({dayName})
            </h3>
            <div className="planner-day-list">
              {dayRecords.map((item, idx) => (
                <div key={item.recipe.mealEntryId ?? item.recipe.id ?? `${item.date}-${item.type}-${idx}`} className="planner-day-item">
                  <div className="planner-meal-type">{item.type}</div>
                  <div className="planner-meal-name" onClick={() => onOpenRecipe(item.recipe)}>
                    {item.recipe.name}
                  </div>
                  <button
                    onClick={() => onRemoveMeal(item.date, item.type, item.recipe.mealEntryId ?? item.recipe.id)}
                    className="planner-remove-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MealTimeline
