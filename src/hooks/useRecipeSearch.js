import { useMemo } from 'react'
import useDebounce from './useDebounce'

const SPECIAL_CATEGORIES = ['추천', '전체보기']
const RECOMMENDED_LIMIT = 15

function sortRecipes(a, b, sortBy, debouncedSearchTerm) {
  if (sortBy === 'name') {
    return a.name.localeCompare(b.name, 'ko-KR')
  }

  if (sortBy === 'category') {
    const categoryCompare = a.category.localeCompare(b.category, 'ko-KR')
    if (categoryCompare !== 0) return categoryCompare
    return a.name.localeCompare(b.name, 'ko-KR')
  }

  if (debouncedSearchTerm.trim() === '') return 0

  const term = debouncedSearchTerm.toLowerCase()
  const aNameMatch = a.name.toLowerCase().includes(term)
  const bNameMatch = b.name.toLowerCase().includes(term)
  const aNameStartsWith = a.name.toLowerCase().startsWith(term)
  const bNameStartsWith = b.name.toLowerCase().startsWith(term)

  if (aNameStartsWith && !bNameStartsWith) return -1
  if (!aNameStartsWith && bNameStartsWith) return 1
  if (aNameMatch && !bNameMatch) return -1
  if (!aNameMatch && bNameMatch) return 1

  return 0
}

function pickRandomRecipes(recipes = [], limit = RECOMMENDED_LIMIT) {
  const shuffled = [...recipes]

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[randomIndex]
    shuffled[randomIndex] = temp
  }

  return shuffled.slice(0, limit)
}

function useRecipeSearch({
  recipes = [],
  searchTerm = '',
  activeCategory = 'All',
  sortBy = 'relevance',
  debounceMs = 300
}) {
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs)

  const categories = useMemo(() => {
    const recipeCategories = [...new Set(recipes.map((recipe) => recipe.category))]
    return [...SPECIAL_CATEGORIES, ...recipeCategories]
  }, [recipes])

  const filteredRecipes = useMemo(() => {
    const baseFiltered = recipes
      .filter((recipe) => {
        const categoryMatch =
          SPECIAL_CATEGORIES.includes(activeCategory) ||
          activeCategory === 'All' ||
          recipe.category === activeCategory
        const searchMatch =
          debouncedSearchTerm.trim() === '' ||
          recipe.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (recipe.ingredients && recipe.ingredients.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))

        return categoryMatch && searchMatch
      })

    if (activeCategory === '추천') {
      return pickRandomRecipes(baseFiltered, RECOMMENDED_LIMIT)
    }

    return baseFiltered.sort((a, b) => sortRecipes(a, b, sortBy, debouncedSearchTerm))
  }, [recipes, activeCategory, debouncedSearchTerm, sortBy])

  const suggestions = useMemo(() => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) return []

    const term = searchTerm.toLowerCase()
    const matched = new Set()

    recipes.forEach((recipe) => {
      if (recipe.name.toLowerCase().includes(term)) {
        matched.add(recipe.name)
      }
    })

    return Array.from(matched).slice(0, 5)
  }, [recipes, searchTerm])

  return {
    categories,
    debouncedSearchTerm,
    filteredRecipes,
    suggestions
  }
}

export default useRecipeSearch
