import { useCallback } from 'react'
import useLocalStorage from './useLocalStorage'

/**
 * Custom hook for managing recent search history
 * Stores up to maxItems recent searches in localStorage
 *
 * @param {number} maxItems - Maximum number of recent searches to store (default: 5)
 * @returns {Object} - { recentSearches, addSearch, clearSearches }
 */
export function useRecentSearches(maxItems = 5) {
  const [recentSearches, setRecentSearches] = useLocalStorage('recentSearches', [])

  /**
   * Add a search term to recent searches
   * - Removes duplicates
   * - Adds to the beginning of the list
   * - Limits to maxItems
   */
  const addSearch = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.trim().length === 0) return

    const trimmedTerm = searchTerm.trim()

    setRecentSearches((prev) => {
      // Remove the term if it already exists
      const filtered = prev.filter(term => term.toLowerCase() !== trimmedTerm.toLowerCase())

      // Add to the beginning and limit to maxItems
      return [trimmedTerm, ...filtered].slice(0, maxItems)
    })
  }, [maxItems, setRecentSearches])

  /**
   * Clear all recent searches
   */
  const clearSearches = useCallback(() => {
    setRecentSearches([])
  }, [setRecentSearches])

  /**
   * Remove a specific search term
   */
  const removeSearch = useCallback((searchTerm) => {
    setRecentSearches((prev) =>
      prev.filter(term => term.toLowerCase() !== searchTerm.toLowerCase())
    )
  }, [setRecentSearches])

  return {
    recentSearches,
    addSearch,
    clearSearches,
    removeSearch
  }
}

export default useRecentSearches
