/**
 * Safe localStorage utilities with error handling
 * Prevents app crashes from corrupted localStorage data
 */

/**
 * Safely get and parse data from localStorage
 * @param {string} key - localStorage key
 * @param {*} defaultValue - fallback value if parse fails
 * @returns {*} parsed data or defaultValue
 */
export function safeGetItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }
    return JSON.parse(item)
  } catch (error) {
    console.error(`Failed to get item from localStorage (key: ${key}):`, error)
    // Optionally clear corrupted data
    try {
      localStorage.removeItem(key)
    } catch (removeError) {
      console.error(`Failed to remove corrupted item (key: ${key}):`, removeError)
    }
    return defaultValue
  }
}

/**
 * Safely set data to localStorage with JSON stringification
 * @param {string} key - localStorage key
 * @param {*} value - value to store
 * @returns {boolean} success status
 */
export function safeSetItem(key, value) {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
    return true
  } catch (error) {
    console.error(`Failed to set item to localStorage (key: ${key}):`, error)

    // Check if quota exceeded
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Consider clearing old data.')
      // Optionally: trigger a cleanup or notify user
    }

    return false
  }
}

/**
 * Safely remove item from localStorage
 * @param {string} key - localStorage key
 * @returns {boolean} success status
 */
export function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Failed to remove item from localStorage (key: ${key}):`, error)
    return false
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean} availability status
 */
export function isLocalStorageAvailable() {
  try {
    const testKey = '__localStorage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    console.warn('localStorage is not available:', error)
    return false
  }
}

/**
 * Get localStorage usage statistics
 * @returns {object} usage info
 */
export function getStorageInfo() {
  if (!isLocalStorageAvailable()) {
    return { available: false }
  }

  try {
    let totalSize = 0
    const items = {}

    for (let key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        const itemSize = localStorage.getItem(key).length
        totalSize += itemSize
        items[key] = itemSize
      }
    }

    return {
      available: true,
      totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      itemCount: Object.keys(items).length,
      items
    }
  } catch (error) {
    console.error('Failed to get storage info:', error)
    return { available: true, error: error.message }
  }
}
