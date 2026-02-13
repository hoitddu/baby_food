import { useCallback } from 'react'
import useLocalStorage from './useLocalStorage'

/**
 * Default allergy preferences
 */
const DEFAULT_PREFERENCES = {
  dairy: false,
  eggs: false,
  peanuts: false,
  treeNuts: false,
  wheat: false,
  soy: false,
  fish: false
}

/**
 * Custom hook for managing baby profile and allergy preferences
 *
 * @returns {Object} profile management utilities
 */
function useProfile() {
  const [profile, setProfile] = useLocalStorage('baby_profile', null)
  const [preferences, setPreferences] = useLocalStorage('baby_preferences', DEFAULT_PREFERENCES)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('onboarding_completed', false)

  /**
   * Update baby profile
   * @param {Object} newProfile - new profile data
   */
  const updateProfile = useCallback((newProfile) => {
    setProfile(prev => ({
      ...prev,
      ...newProfile
    }))
  }, [setProfile])

  /**
   * Update allergy preferences
   * @param {Object} newPreferences - new allergy settings
   */
  const updatePreferences = useCallback((newPreferences) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences
    }))
  }, [setPreferences])

  /**
   * Toggle a single allergy preference
   * @param {string} allergyKey - allergy type (e.g., 'dairy', 'eggs')
   */
  const toggleAllergy = useCallback((allergyKey) => {
    setPreferences(prev => ({
      ...prev,
      [allergyKey]: !prev[allergyKey]
    }))
  }, [setPreferences])

  /**
   * Get list of active allergies
   * @returns {string[]} array of allergy keys that are enabled
   */
  const getActiveAllergies = useCallback(() => {
    return Object.keys(preferences).filter(key => preferences[key])
  }, [preferences])

  /**
   * Check if any allergies are set
   * @returns {boolean}
   */
  const hasAllergies = useCallback(() => {
    return Object.values(preferences).some(value => value === true)
  }, [preferences])

  /**
   * Clear all allergy preferences
   */
  const clearAllergies = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES)
  }, [setPreferences])

  /**
   * Complete onboarding setup
   * @param {Object} data - onboarding data { name, allergies }
   */
  const completeOnboarding = useCallback((data) => {
    setProfile({ name: data.name })
    if (data.allergies) {
      setPreferences(prev => ({
        ...prev,
        ...data.allergies
      }))
    }
    setHasCompletedOnboarding(true)
  }, [setProfile, setPreferences, setHasCompletedOnboarding])

  /**
   * Reset all profile data
   */
  const resetProfile = useCallback(() => {
    setProfile(null)
    setPreferences(DEFAULT_PREFERENCES)
    setHasCompletedOnboarding(false)
  }, [setProfile, setPreferences, setHasCompletedOnboarding])

  return {
    profile,
    hasCompletedOnboarding,
    preferences,
    setProfile,
    setPreferences,
    updateProfile,
    updatePreferences,
    toggleAllergy,
    getActiveAllergies,
    hasAllergies,
    clearAllergies,
    completeOnboarding,
    resetProfile
  }
}

export default useProfile
