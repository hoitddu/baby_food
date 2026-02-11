import { useCallback } from 'react'
import useLocalStorage from './useLocalStorage'

/**
 * Custom hook for managing favorite recipes
 * Provides favorites state and toggle function
 *
 * @returns {Object} { favorites, toggleFavorite, clearFavorites, isFavorite }
 */
function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('baby_favorites', {})

  /**
   * Toggle favorite status for a recipe
   * @param {string} recipeName - name of the recipe
   */
  const toggleFavorite = useCallback((recipeName) => {
    setFavorites(prev => ({
      ...prev,
      [recipeName]: !prev[recipeName]
    }))
  }, [setFavorites])

  /**
   * Check if a recipe is favorited
   * @param {string} recipeName - name of the recipe
   * @returns {boolean}
   */
  const isFavorite = useCallback((recipeName) => {
    return !!favorites[recipeName]
  }, [favorites])

  /**
   * Clear all favorites
   */
  const clearFavorites = useCallback(() => {
    setFavorites({})
  }, [setFavorites])

  /**
   * Get count of favorited recipes
   * @returns {number}
   */
  const getFavoriteCount = useCallback(() => {
    return Object.values(favorites).filter(Boolean).length
  }, [favorites])

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    getFavoriteCount
  }
}

export default useFavorites
