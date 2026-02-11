import { useCallback } from 'react'
import useLocalStorage from './useLocalStorage'

/**
 * Custom hook for managing meal plan/history
 * Provides meal plan state and management functions
 *
 * @returns {Object} { mealPlan, addMealToHistory, removeMeal, clearHistory, getMealsForDate }
 */
function useMealPlan() {
  const [mealPlan, setMealPlan] = useLocalStorage('baby_meal_plan', {})

  /**
   * Add a meal to history
   * @param {string} date - date in YYYY-MM-DD format
   * @param {string} mealType - '아침', '점심', '저녁', or '간식'
   * @param {Object} recipe - recipe object
   */
  const addMealToHistory = useCallback((date, mealType, recipe) => {
    setMealPlan(prev => {
      const dayPlan = prev[date] || {}
      const existingMeals = dayPlan[mealType] || []

      // If it's a single object (legacy data), convert to array
      const currentList = Array.isArray(existingMeals)
        ? existingMeals
        : [existingMeals]

      // Add new meal with a unique ID to allow deletion
      const newMeal = { ...recipe, id: Date.now() }

      return {
        ...prev,
        [date]: {
          ...dayPlan,
          [mealType]: [...currentList, newMeal]
        }
      }
    })
  }, [setMealPlan])

  /**
   * Remove a specific meal from history
   * @param {string} date - date in YYYY-MM-DD format
   * @param {string} mealType - meal type
   * @param {number} recipeId - unique recipe ID
   */
  const removeMeal = useCallback((date, mealType, recipeId) => {
    setMealPlan(prev => {
      const newState = { ...prev }
      if (newState[date]) {
        const updatedDay = { ...newState[date] }
        const meals = updatedDay[mealType]

        if (Array.isArray(meals)) {
          updatedDay[mealType] = meals.filter(m => m.id !== recipeId)
          if (updatedDay[mealType].length === 0) delete updatedDay[mealType]
        } else {
          // Legacy support
          delete updatedDay[mealType]
        }

        if (Object.keys(updatedDay).length === 0) delete newState[date]
        else newState[date] = updatedDay
      }
      return newState
    })
  }, [setMealPlan])

  /**
   * Get all meals for a specific date
   * @param {string} date - date in YYYY-MM-DD format
   * @returns {Object} meal plan for the day
   */
  const getMealsForDate = useCallback((date) => {
    return mealPlan[date] || {}
  }, [mealPlan])

  /**
   * Clear all meal history
   */
  const clearHistory = useCallback(() => {
    if (window.confirm('모든 식단 기록을 삭제하시겠습니까?')) {
      setMealPlan({})
    }
  }, [setMealPlan])

  /**
   * Get total meal count
   * @returns {number}
   */
  const getTotalMealCount = useCallback(() => {
    let count = 0
    Object.values(mealPlan).forEach(dayPlan => {
      Object.values(dayPlan).forEach(meals => {
        count += Array.isArray(meals) ? meals.length : 1
      })
    })
    return count
  }, [mealPlan])

  /**
   * Get meals for date range
   * @param {string} startDate - start date in YYYY-MM-DD format
   * @param {string} endDate - end date in YYYY-MM-DD format
   * @returns {Object} filtered meal plan
   */
  const getMealsInRange = useCallback((startDate, endDate) => {
    const filtered = {}
    Object.keys(mealPlan).forEach(date => {
      if (date >= startDate && date <= endDate) {
        filtered[date] = mealPlan[date]
      }
    })
    return filtered
  }, [mealPlan])

  return {
    mealPlan,
    setMealPlan,
    addMealToHistory,
    removeMeal,
    getMealsForDate,
    clearHistory,
    getTotalMealCount,
    getMealsInRange
  }
}

export default useMealPlan
