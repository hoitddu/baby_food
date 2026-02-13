import { useState, useMemo, useEffect } from 'react'
import { BookOpen, PieChart, ChevronRight, Award, Zap, LayoutGrid } from 'lucide-react'
import { recipes } from '../data/recipes'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import { NutritionDoughnutChart, WeeklyNutritionChart, NutritionProgressBar } from '../components/NutritionCharts'
import {
  flattenMealPlan,
  analyzeMealHistory,
  groupHistoryByDate,
  buildWeeklyChartData
} from '../domain/mealAnalysis'
import MealTimeline from '../components/meal-planner/MealTimeline'
import DetailReportModal from '../components/meal-planner/DetailReportModal'
import '../components/meal-planner/mealPlanner.css'

function MealPlanner({ mealPlan, removeMeal }) {
  const navigate = useNavigate()
  const [reportType, setReportType] = useState('weekly')
  const [showDetailReport, setShowDetailReport] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const historyList = useMemo(() => flattenMealPlan(mealPlan), [mealPlan])
  const analysis = useMemo(() => analyzeMealHistory(historyList, reportType), [historyList, reportType])
  const groupedHistory = useMemo(() => groupHistoryByDate(historyList), [historyList])
  const weeklyChartData = useMemo(() => buildWeeklyChartData(historyList), [historyList])

  const handleRemoveMeal = (date, type, mealEntryId) => {
    if (!window.confirm('이 기록을 삭제하시겠습니까?')) return
    removeMeal(date, type, mealEntryId)
  }

  const handleOpenRecipe = (historyRecipe) => {
    const fallbackRecipe = recipes.find((r) => r.name === historyRecipe.name)
    const targetRecipeId = historyRecipe.id ?? fallbackRecipe?.id
    if (!targetRecipeId) return
    navigate(`/recipe/${targetRecipeId}`, { state: { recipe: historyRecipe } })
  }

  if (isLoading) {
    return (
      <div className="page-content planner-page">
        <header className="app-header planner-header">
          <h1 className="planner-title">
            <BookOpen size={28} color="#FFAB40" />
            식사 일기
          </h1>
        </header>
        <div className="planner-loading-wrap">
          <LoadingSpinner centered={true} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-content planner-page">
      <header className="app-header planner-header">
        <h1 className="planner-title">
          <BookOpen size={28} color="#FFAB40" />
          식사 일기
        </h1>
      </header>

      <div className="planner-toggle-tabs">
        <button
          onClick={() => setReportType('weekly')}
          className={`planner-toggle-btn ${reportType === 'weekly' ? 'active' : ''}`}
        >
          주간 리포트
        </button>
        <button
          onClick={() => setReportType('monthly')}
          className={`planner-toggle-btn ${reportType === 'monthly' ? 'active' : ''}`}
        >
          월간 리포트
        </button>
      </div>

      <div className="planner-summary-card" onClick={() => setShowDetailReport(true)}>
        <div className="planner-summary-head">
          <div>
            <h3 className="planner-summary-title">
              {reportType === 'weekly' ? '이번 주' : '이번 달'} 영양 점수
            </h3>
            <p className="planner-summary-sub">총 {analysis.count}회를 기록했어요!</p>
          </div>
          <div className="planner-summary-arrow">
            <ChevronRight color="#FFAB40" />
          </div>
        </div>

        <div className="planner-summary-stats">
          <div className="planner-summary-stat-card">
            <div className="planner-summary-stat-label">소고기(철분)</div>
            <div className="planner-summary-stat-value meat">{analysis.beefCount}회</div>
          </div>
          <div className="planner-summary-stat-card">
            <div className="planner-summary-stat-label">다양한 재료</div>
            <div className="planner-summary-stat-value variety">{analysis.uniqueIngredients.length}종</div>
          </div>
        </div>

        <div className="planner-summary-tip">
          <Zap size={16} fill="#1976D2" />
          <span>{analysis.beefScore >= 100 ? '철분 섭취가 충분해요!' : '소고기 식단을 조금 더 채워주세요.'}</span>
        </div>
      </div>

      {analysis.count > 0 && (
        <>
          <div className="planner-section-card">
            <h3 className="planner-section-title">
              <PieChart size={20} color="#FF8A65" />
              영양 균형
            </h3>
            <NutritionDoughnutChart
              carbsCount={analysis.balance.carbs}
              proteinCount={analysis.balance.protein}
              veggiesCount={analysis.balance.veggies}
              fruitsCount={analysis.balance.fruits}
            />
          </div>

          <div className="planner-section-card">
            <h3 className="planner-section-title">
              <Award size={20} color="#FF8A65" />
              영양 목표 달성률
            </h3>
            <NutritionProgressBar
              label="탄수화물"
              current={analysis.balance.carbs}
              goal={reportType === 'weekly' ? 14 : 60}
              color="#FFD180"
              icon="🍚"
            />
            <NutritionProgressBar
              label="단백질"
              current={analysis.balance.protein}
              goal={reportType === 'weekly' ? 14 : 60}
              color="#FF8A65"
              icon="🥩"
            />
            <NutritionProgressBar
              label="채소"
              current={analysis.balance.veggies}
              goal={reportType === 'weekly' ? 14 : 60}
              color="#81C784"
              icon="🥬"
            />
            <NutritionProgressBar
              label="과일"
              current={analysis.balance.fruits}
              goal={reportType === 'weekly' ? 7 : 30}
              color="#FFB74D"
              icon="🍊"
            />
          </div>

          {reportType === 'weekly' && weeklyChartData.length > 0 && (
            <div className="planner-section-card">
              <h3 className="planner-section-title">
                <LayoutGrid size={20} color="#FF8A65" />
                주간 영양 히스토리
              </h3>
              <WeeklyNutritionChart weeklyData={weeklyChartData} />
            </div>
          )}
        </>
      )}

      <MealTimeline
        groupedHistory={groupedHistory}
        onOpenRecipe={handleOpenRecipe}
        onRemoveMeal={handleRemoveMeal}
      />

      <DetailReportModal
        show={showDetailReport}
        onClose={() => setShowDetailReport(false)}
        analysis={analysis}
      />
    </div>
  )
}

export default MealPlanner
