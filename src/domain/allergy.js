export const ALLERGY_KEYWORDS = {
  dairy: ['우유', '치즈', '요거트', '버터', '크림', '분유'],
  eggs: ['계란', '달걀', '노른자', '흰자'],
  peanuts: ['땅콩'],
  treeNuts: ['호두', '아몬드', '잣', '캐슈넛', '밤'],
  wheat: ['밀가루', '빵', '국수', '면', '파스타', '소면'],
  soy: ['콩', '두부', '두유', '간장', '된장', '나또'],
  fish: ['생선', '대구', '가자미', '조기', '멸치', '연어']
}

export function detectAllergyRisks(recipeOrIngredients, preferences = {}) {
  const ingredients =
    typeof recipeOrIngredients === 'string'
      ? recipeOrIngredients
      : recipeOrIngredients?.ingredients || ''

  const ingredientText = ingredients.toLowerCase()

  return Object.keys(preferences).filter((key) => {
    if (!preferences[key]) return false
    const keywords = ALLERGY_KEYWORDS[key] || []
    return keywords.some((keyword) => ingredientText.includes(keyword))
  })
}

