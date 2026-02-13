import test from 'node:test'
import assert from 'node:assert/strict'

import {
  flattenMealPlan,
  analyzeMealHistory,
  groupHistoryByDate,
  buildWeeklyChartData
} from './mealAnalysis.js'

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

test('flattenMealPlan flattens and sorts by date desc', () => {
  const mealPlan = {
    '2026-01-01': {
      아침: [{ id: 'r1', name: 'A' }]
    },
    '2026-01-03': {
      저녁: { id: 'r2', name: 'B' }
    }
  }

  const list = flattenMealPlan(mealPlan)

  assert.equal(list.length, 2)
  assert.equal(list[0].date, '2026-01-03')
  assert.equal(list[1].date, '2026-01-01')
})

test('analyzeMealHistory returns expected aggregates', () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const historyList = [
    {
      date: toDateKey(today),
      type: '아침',
      recipe: { ingredients: '소고기 쌀 당근 사과' }
    },
    {
      date: toDateKey(yesterday),
      type: '점심',
      recipe: { ingredients: '두부 감자' }
    }
  ]

  const categories = {
    carbs: ['쌀', '감자'],
    protein: ['소고기', '두부'],
    veggies: ['당근'],
    fruits: ['사과']
  }

  const result = analyzeMealHistory(historyList, 'weekly', categories)

  assert.equal(result.count, 2)
  assert.equal(result.beefCount, 1)
  assert.equal(result.meatCount, 2)
  assert.equal(result.balance.carbs, 2)
  assert.equal(result.balance.protein, 2)
  assert.equal(result.balance.veggies, 1)
  assert.equal(result.balance.fruits, 1)
  assert.equal(result.beefScore, 25)
  assert.ok(result.uniqueIngredients.includes('소고기'))
  assert.ok(result.uniqueIngredients.includes('감자'))
})

test('groupHistoryByDate groups records by date key', () => {
  const grouped = groupHistoryByDate([
    { date: '2026-01-01', type: '아침', recipe: { id: 'a' } },
    { date: '2026-01-01', type: '점심', recipe: { id: 'b' } },
    { date: '2026-01-02', type: '저녁', recipe: { id: 'c' } }
  ])

  assert.equal(grouped['2026-01-01'].length, 2)
  assert.equal(grouped['2026-01-02'].length, 1)
})

test('buildWeeklyChartData returns 7 days and counts today records', () => {
  const today = new Date()
  const todayKey = toDateKey(today)

  const historyList = [
    {
      date: todayKey,
      type: '아침',
      recipe: { ingredients: '소고기 쌀 당근 사과' }
    }
  ]

  const categories = {
    carbs: ['쌀'],
    protein: ['소고기'],
    veggies: ['당근'],
    fruits: ['사과']
  }

  const weekly = buildWeeklyChartData(historyList, categories)
  const todayRow = weekly.find((item) => item.date === todayKey)

  assert.equal(weekly.length, 7)
  assert.ok(todayRow)
  assert.equal(todayRow.carbs, 1)
  assert.equal(todayRow.protein, 1)
  assert.equal(todayRow.veggies, 1)
  assert.equal(todayRow.fruits, 1)
})
