import { generatedRecipes } from './generatedRecipes.js'

const mergedRecipes = generatedRecipes

const CATEGORY_LABEL_MAP = {
  '국,탕,맑은국': '국/탕',
  '단백질(고기,생선,두부,계란)': '단백질',
  면요리: '면',
  '죽,리조또,오트밀': '죽/리조또',
  채소반찬: '반찬',
  '토스트,팬케이크,머핀': '토스트/팬케이크',
  '퓨레,소스': '퓨레/소스',
  한그릇덮밥: '한그릇'
}

function normalizeCategory(category) {
  return CATEGORY_LABEL_MAP[category] ?? category
}

export const recipes = mergedRecipes.map((recipe, index) => ({
  ...recipe,
  rawCategory: recipe.category,
  category: normalizeCategory(recipe.category),
  id: recipe.id ?? `recipe-${index + 1}`
}))

export function getRecipeById(id) {
  return recipes.find((recipe) => recipe.id === id)
}

export const categories = [...new Set(recipes.map((recipe) => recipe.category))]

export const recipeStats = {
  total: recipes.length,
  byCategory: categories.reduce((acc, category) => {
    acc[category] = recipes.filter((recipe) => recipe.category === category).length
    return acc
  }, {})
}

export default recipes
