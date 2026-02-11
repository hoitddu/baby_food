import { useState, useEffect } from 'react'
import { safeGetItem, safeSetItem } from '../utils/safeLocalStorage'

/**
 * Custom hook for managing state with localStorage synchronization
 * Automatically saves to localStorage whenever state changes
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if nothing in storage
 * @returns {[value, setValue, removeValue]} - state value, setter, and remover
 */
function useLocalStorage(key, initialValue) {
  // Initialize state from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    return safeGetItem(key, initialValue)
  })

  // Update localStorage whenever state changes
  useEffect(() => {
    safeSetItem(key, storedValue)
  }, [key, storedValue])

  // Remove item from storage
  const removeValue = () => {
    setStoredValue(initialValue)
    localStorage.removeItem(key)
  }

  return [storedValue, setStoredValue, removeValue]
}

export default useLocalStorage
