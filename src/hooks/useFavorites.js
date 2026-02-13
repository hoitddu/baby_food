import { useCallback, useEffect, useRef } from 'react'
import useLocalStorage from './useLocalStorage'
import { recipes } from '../data/recipes'
import { safeGetItem, safeRemoveItem } from '../utils/safeLocalStorage'

const FAVORITES_V2_KEY = 'baby_favorites_v2'
const FAVORITES_LEGACY_KEY = 'baby_favorites'

const RECIPE_ID_SET = new Set(recipes.map((recipe) => recipe.id))
const RECIPE_NAME_TO_ID = new Map(recipes.map((recipe) => [recipe.name, recipe.id]))

function normalizeFavoriteKey(recipeKey) {
  if (!recipeKey || typeof recipeKey !== 'string') return null
  if (RECIPE_ID_SET.has(recipeKey)) return recipeKey
  return RECIPE_NAME_TO_ID.get(recipeKey) || null
}

function migrateLegacyFavorites(legacyFavorites) {
  if (!legacyFavorites || typeof legacyFavorites !== 'object') return {}

  return Object.entries(legacyFavorites).reduce((acc, [key, isFavorite]) => {
    if (!isFavorite) return acc

    const recipeId = normalizeFavoriteKey(key)
    if (recipeId) acc[recipeId] = true
    return acc
  }, {})
}

/**
 * Custom hook for managing favorite recipes
 * Provides favorites state and toggle function
 *
 * @returns {Object} { favorites, toggleFavorite, clearFavorites, isFavorite }
 */
function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage(FAVORITES_V2_KEY, {})
  const migrationAttemptedRef = useRef(false)

  useEffect(() => {
    if (migrationAttemptedRef.current) return
    migrationAttemptedRef.current = true

    // If V2 already has data, remove legacy key and stop.
    if (Object.keys(favorites).length > 0) {
      safeRemoveItem(FAVORITES_LEGACY_KEY)
      return
    }

    const legacyFavorites = safeGetItem(FAVORITES_LEGACY_KEY, null)
    if (!legacyFavorites || typeof legacyFavorites !== 'object') {
      safeRemoveItem(FAVORITES_LEGACY_KEY)
      return
    }

    const migrated = migrateLegacyFavorites(legacyFavorites)
    if (Object.keys(migrated).length > 0) {
      setFavorites(migrated)
    }

    safeRemoveItem(FAVORITES_LEGACY_KEY)
  }, [favorites, setFavorites])

  /**
   * Toggle favorite status for a recipe
   * @param {string} recipeKey - recipe id (preferred) or legacy recipe name
   */
  const toggleFavorite = useCallback((recipeKey) => {
    const recipeId = normalizeFavoriteKey(recipeKey)
    if (!recipeId) return

    setFavorites(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }))
  }, [setFavorites])

  /**
   * Check if a recipe is favorited
   * @param {string} recipeKey - recipe id (preferred) or legacy recipe name
   * @returns {boolean}
   */
  const isFavorite = useCallback((recipeKey) => {
    const recipeId = normalizeFavoriteKey(recipeKey)
    if (!recipeId) return false
    return !!favorites[recipeId]
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
