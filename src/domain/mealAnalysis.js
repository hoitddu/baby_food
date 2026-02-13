export const INGREDIENT_CATEGORIES = {
  carbs: ['쌀', '오트밀', '파스타', '찹쌀', '국수', '밀가루', '감자', '고구마'],
  protein: ['소고기', '쇠고기', '돼지고기', '닭고기', '두부', '콩', '계란', '노른자', '흰자', '생선', '가자미'],
  veggies: ['애호박', '시금치', '양배추', '브로콜리', '양파', '비트', '청경채', '단호박', '무', '배추', '오이'],
  fruits: ['사과', '배', '바나나', '오렌지', '딸기', '블루베리']
}

const BEEF_KEYWORDS = ['소고기', '쇠고기']

function parseDateKey(dateKey) {
  const [y, m, d] = (dateKey || '').split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function normalizeText(value) {
  return (value || '').toLowerCase()
}

function buildCategoryEntries(categories) {
  return Object.entries(categories).map(([category, keywords]) => {
    const normalizedKeywords = (keywords || []).map((keyword) => normalizeText(keyword))
    return [category, normalizedKeywords]
  })
}

function applyIngredientCounts(ingredientText, categoryEntries, balance, uniqueIngredients = null) {
  let hasProtein = false

  categoryEntries.forEach(([category, keywords]) => {
    keywords.forEach((keyword) => {
      if (!keyword || !ingredientText.includes(keyword)) return

      balance[category] += 1
      if (uniqueIngredients) uniqueIngredients.add(keyword)
      if (category === 'protein') hasProtein = true
    })
  })

  return hasProtein
}

export function flattenMealPlan(mealPlan = {}) {
  const list = []

  Object.keys(mealPlan).forEach((date) => {
    const dayPlan = mealPlan[date]
    if (!dayPlan) return

    Object.keys(dayPlan).forEach((type) => {
      const meals = dayPlan[type]
      const mealList = Array.isArray(meals) ? meals : [meals]

      mealList.forEach((recipe) => {
        if (recipe) list.push({ date, type, recipe })
      })
    })
  })

  return list.sort((a, b) => {
    const bDate = parseDateKey(b.date)?.getTime() ?? 0
    const aDate = parseDateKey(a.date)?.getTime() ?? 0
    return bDate - aDate
  })
}

export function analyzeMealHistory(historyList = [], reportType = 'weekly', categories = INGREDIENT_CATEGORIES) {
  const today = new Date()
  const startDate = new Date(today)
  if (reportType === 'weekly') startDate.setDate(today.getDate() - 7)
  else startDate.setDate(today.getDate() - 30)
  const startTime = startDate.getTime()

  const balance = { carbs: 0, protein: 0, veggies: 0, fruits: 0 }
  const uniqueIngredients = new Set()
  const categoryEntries = buildCategoryEntries(categories)

  let count = 0
  let beefCount = 0
  let meatCount = 0

  historyList.forEach((record) => {
    const recordDate = parseDateKey(record?.date)
    if (!recordDate || recordDate.getTime() < startTime) return

    count += 1

    const ingredientText = normalizeText(record?.recipe?.ingredients)
    if (BEEF_KEYWORDS.some((keyword) => ingredientText.includes(keyword))) {
      beefCount += 1
    }

    const hasProtein = applyIngredientCounts(ingredientText, categoryEntries, balance, uniqueIngredients)
    if (hasProtein) meatCount += 1
  })

  const beefGoal = reportType === 'weekly' ? 4 : 15
  const beefScore = Math.min(100, (beefCount / beefGoal) * 100)

  return {
    count,
    beefCount,
    meatCount,
    uniqueIngredients: Array.from(uniqueIngredients),
    balance,
    beefScore
  }
}

export function groupHistoryByDate(historyList = []) {
  return historyList.reduce((groups, item) => {
    if (!item?.date) return groups
    if (!groups[item.date]) groups[item.date] = []
    groups[item.date].push(item)
    return groups
  }, {})
}

export function buildWeeklyChartData(historyList = [], categories = INGREDIENT_CATEGORIES) {
  const today = new Date()
  const categoryEntries = buildCategoryEntries(categories)
  const historyByDate = groupHistoryByDate(historyList)
  const last7Days = []

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = toDateKey(date)

    const dayData = { date: dateStr, carbs: 0, protein: 0, veggies: 0, fruits: 0 }
    const dayRecords = historyByDate[dateStr] || []

    dayRecords.forEach((record) => {
      const ingredientText = normalizeText(record?.recipe?.ingredients)
      applyIngredientCounts(ingredientText, categoryEntries, dayData)
    })

    last7Days.push(dayData)
  }

  return last7Days
}
