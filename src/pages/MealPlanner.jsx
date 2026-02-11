import { useState, useMemo, useEffect } from 'react'
import { BookOpen, PieChart, Trash2, ChevronRight, X, Award, Zap, LayoutGrid } from 'lucide-react'
import { recipes } from '../data/recipes'
import { useNavigate } from 'react-router-dom'
import { MealPlanListSkeleton } from '../components/SkeletonLoader'
import LoadingSpinner from '../components/LoadingSpinner'
import { NutritionDoughnutChart, WeeklyNutritionChart, NutritionProgressBar } from '../components/NutritionCharts'

// Ingredient Categories for Analysis
const ingredientCategories = {
    carbs: ['쌀', '현미', '오트밀', '찹쌀', '국수', '밀가루', '감자', '고구마'],
    protein: ['소고기', '닭고기', '대구', '살코기', '두부', '콩', '달걀', '노른자', '흰자', '동태', '가자미'],
    veggies: ['애호박', '시금치', '당근', '브로콜리', '양파', '비트', '청경채', '단호박', '무', '배추', '오이'],
    fruits: ['사과', '배', '바나나', '퓨레', '딸기', '블루베리']
}

function MealPlanner({ mealPlan, setMealPlan }) {
    const navigate = useNavigate()
    const [reportType, setReportType] = useState('weekly') // 'weekly' or 'monthly'
    const [showDetailReport, setShowDetailReport] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Initial loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 300)
        return () => clearTimeout(timer)
    }, [])

    // 1. Flatten meal plan to a list of records
    const historyList = useMemo(() => {
        const list = []
        Object.keys(mealPlan).forEach(date => {
            const dayPlan = mealPlan[date]
            Object.keys(dayPlan).forEach(type => {
                const meals = dayPlan[type]
                // Handle both single object (legacy) and array of objects
                const mealList = Array.isArray(meals) ? meals : [meals]

                mealList.forEach(recipe => {
                    if (recipe) {
                        list.push({ date, type, recipe })
                    }
                })
            })
        })
        return list.sort((a, b) => new Date(b.date) - new Date(a.date))
    }, [mealPlan])

    const removeMeal = (date, type, recipeId) => {
        if (confirm('이 기록을 삭제하시겠습니까?')) {
            setMealPlan(prev => {
                const newState = { ...prev }
                if (newState[date]) {
                    const updatedDay = { ...newState[date] }
                    const meals = updatedDay[type]

                    if (Array.isArray(meals)) {
                        updatedDay[type] = meals.filter(m => m.id !== recipeId)
                        if (updatedDay[type].length === 0) delete updatedDay[type]
                    } else {
                        // Legacy support
                        delete updatedDay[type]
                    }

                    if (Object.keys(updatedDay).length === 0) delete newState[date]
                    else newState[date] = updatedDay
                }
                return newState
            })
        }
    }

    // 2. Advanced Nutrition Analysis
    const analysis = useMemo(() => {
        const today = new Date()
        const startDate = new Date(today)
        if (reportType === 'weekly') startDate.setDate(today.getDate() - 7)
        else startDate.setDate(today.getDate() - 30)

        let beefCount = 0
        let meatCount = 0 // Total Protein (Beef + Chicken + Fish)
        let uniqueIngredients = new Set()
        let balance = { carbs: 0, protein: 0, veggies: 0, fruits: 0 }

        const filteredList = historyList.filter(record => new Date(record.date) >= startDate)

        filteredList.forEach(record => {
            const ingText = (record.recipe.ingredients || "").toLowerCase()

            // Iron Check (Critical)
            if (ingText.includes('소고기')) beefCount++

            // Category Analysis
            let hasProtein = false

            Object.keys(ingredientCategories).forEach(cat => {
                ingredientCategories[cat].forEach(keyword => {
                    if (ingText.includes(keyword)) {
                        balance[cat]++
                        uniqueIngredients.add(keyword)
                        if (cat === 'protein') hasProtein = true
                    }
                })
            })
            if (hasProtein) meatCount++
        })

        // Score Calculation (Simple Logic)
        // Weekly expectation: Beef at least 3-4 times
        const beefScore = reportType === 'weekly'
            ? Math.min(100, (beefCount / 4) * 100)
            : Math.min(100, (beefCount / 15) * 100)

        return {
            count: filteredList.length,
            beefCount,
            meatCount,
            uniqueIngredients: Array.from(uniqueIngredients),
            balance,
            beefScore
        }
    }, [historyList, reportType])

    // Group by Date for timeline display
    const groupedHistory = useMemo(() => {
        const groups = {}
        historyList.forEach(item => {
            if (!groups[item.date]) groups[item.date] = []
            groups[item.date].push(item)
        })
        return groups
    }, [historyList])

    // Prepare weekly chart data
    const weeklyChartData = useMemo(() => {
        const today = new Date()
        const last7Days = []

        // Generate last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(today.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]

            const dayData = {
                date: dateStr,
                carbs: 0,
                protein: 0,
                veggies: 0,
                fruits: 0
            }

            // Count nutrition for this day
            const dayRecords = historyList.filter(r => r.date === dateStr)
            dayRecords.forEach(record => {
                const ingText = (record.recipe.ingredients || "").toLowerCase()
                Object.keys(ingredientCategories).forEach(cat => {
                    ingredientCategories[cat].forEach(keyword => {
                        if (ingText.includes(keyword)) {
                            dayData[cat]++
                        }
                    })
                })
            })

            last7Days.push(dayData)
        }

        return last7Days
    }, [historyList])

    // Show loading state
    if (isLoading) {
        return (
            <div className="page-content" style={{ paddingBottom: '100px' }}>
                <header className="app-header" style={{ paddingBottom: '10px' }}>
                    <h1 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BookOpen size={28} color="#FFAB40" />
                        식사 일기
                    </h1>
                </header>
                <div style={{ padding: '40px 24px' }}>
                    <LoadingSpinner centered={true} />
                </div>
            </div>
        )
    }

    return (
        <div className="page-content" style={{ paddingBottom: '100px' }}>
            <header className="app-header" style={{ paddingBottom: '10px' }}>
                <h1 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={28} color="#FFAB40" />
                    식사 일기
                </h1>
            </header>

            {/* Report Toggle Tabs */}
            <div style={{ padding: '0 24px 15px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => setReportType('weekly')}
                    style={{
                        flex: 1, padding: '10px', borderRadius: '12px', border: 'none', fontWeight: 'bold',
                        background: reportType === 'weekly' ? '#4E342E' : '#EFEBE9',
                        color: reportType === 'weekly' ? 'white' : '#8D6E63', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                >
                    주간 리포트
                </button>
                <button
                    onClick={() => setReportType('monthly')}
                    style={{
                        flex: 1, padding: '10px', borderRadius: '12px', border: 'none', fontWeight: 'bold',
                        background: reportType === 'monthly' ? '#4E342E' : '#EFEBE9',
                        color: reportType === 'monthly' ? 'white' : '#8D6E63', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                >
                    월간 리포트
                </button>
            </div>

            {/* Report Summary Card (Clickable) */}
            <div
                onClick={() => setShowDetailReport(true)}
                style={{ margin: '0 24px 25px', background: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                        <h3 style={{ margin: 0, color: '#4E342E', fontSize: '1.2rem' }}>
                            {reportType === 'weekly' ? '이번 주' : '이번 달'} 영양 점수
                        </h3>
                        <p style={{ margin: '5px 0 0', color: '#8D6E63', fontSize: '0.9rem' }}>
                            총 {analysis.count}끼를 챙겨주셨어요! 👏
                        </p>
                    </div>
                    <div style={{ background: '#FFF3E0', padding: '8px', borderRadius: '50%' }}>
                        <ChevronRight color="#FFAB40" />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, background: '#FAFAFA', padding: '15px', borderRadius: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: '#BCAAA4', marginBottom: '4px' }}>소고기(철분)</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#FF7043' }}>{analysis.beefCount}회</div>
                    </div>
                    <div style={{ flex: 1, background: '#FAFAFA', padding: '15px', borderRadius: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: '#BCAAA4', marginBottom: '4px' }}>다양한 재료</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#66BB6A' }}>{analysis.uniqueIngredients.length}종</div>
                    </div>
                </div>

                <div style={{ marginTop: '15px', background: '#E3F2FD', padding: '10px 15px', borderRadius: '12px', fontSize: '0.9rem', color: '#1976D2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={16} fill="#1976D2" />
                    <span>
                        {analysis.beefScore >= 100 ? "철분 섭취가 완벽해요! 💪" : "소고기를 조금 더 챙겨주세요 🥩"}
                    </span>
                </div>
            </div>

            {/* Nutrition Charts Section */}
            {analysis.count > 0 && (
                <>
                    {/* Doughnut Chart - Nutrition Balance */}
                    <div style={{ margin: '0 24px 20px', background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#4E342E', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PieChart size={20} color="#FF8A65" />
                            영양소 균형
                        </h3>
                        <NutritionDoughnutChart
                            carbsCount={analysis.balance.carbs}
                            proteinCount={analysis.balance.protein}
                            veggiesCount={analysis.balance.veggies}
                            fruitsCount={analysis.balance.fruits}
                        />
                    </div>

                    {/* Progress Bars */}
                    <div style={{ margin: '0 24px 20px', background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#4E342E', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                            icon="🥦"
                        />
                        <NutritionProgressBar
                            label="과일"
                            current={analysis.balance.fruits}
                            goal={reportType === 'weekly' ? 7 : 30}
                            color="#FFB74D"
                            icon="🍎"
                        />
                    </div>

                    {/* Weekly Bar Chart */}
                    {reportType === 'weekly' && weeklyChartData.length > 0 && (
                        <div style={{ margin: '0 24px 20px', background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ margin: '0 0 20px 0', color: '#4E342E', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <LayoutGrid size={20} color="#FF8A65" />
                                주간 영양 트렌드
                            </h3>
                            <WeeklyNutritionChart weeklyData={weeklyChartData} />
                        </div>
                    )}
                </>
            )}

            {/* Timeline List */}
            <div style={{ padding: '0 24px' }}>
                {Object.keys(groupedHistory).length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📝</div>
                        <p>아직 기록이 없어요.</p>
                    </div>
                ) : (
                    Object.keys(groupedHistory).sort((a, b) => new Date(b) - new Date(a)).map(date => {
                        const dayRecords = groupedHistory[date]
                        const d = new Date(date)
                        const dayName = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]

                        return (
                            <div key={date} style={{ marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '1.1rem', color: '#4E342E', marginBottom: '12px', paddingLeft: '5px', borderLeft: '4px solid #FFAB40', lineHeight: '1.2' }}>
                                    {d.getMonth() + 1}월 {d.getDate()}일 {dayName}요일
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {dayRecords.map((item, idx) => (
                                        <div key={idx} style={{ background: 'white', padding: '15px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                                            <div style={{ background: '#FFF8E1', color: '#FF6F00', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>
                                                {item.type}
                                            </div>
                                            <div style={{ flex: 1, fontSize: '1rem', color: '#3E2723', fontWeight: '500', cursor: 'pointer' }} onClick={() => navigate(`/recipe/${recipes.findIndex(r => r.name === item.recipe.name)}`, { state: { recipe: item.recipe } })}>{item.recipe.name}</div>
                                            <button onClick={() => removeMeal(item.date, item.type, item.recipe.id)} style={{ background: 'none', border: 'none', color: '#CFD8DC', padding: '5px' }}><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* DETAIL REPORT MODAL */}
            {showDetailReport && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#FDFBF7', zIndex: 3000, overflowY: 'auto' }}>
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#4E342E' }}>상세 분석 📊</h2>
                            <button onClick={() => setShowDetailReport(false)} style={{ background: '#EEE', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer' }}><X color="#5D4037" /></button>
                        </div>

                        {/* Section 1: Iron Status */}
                        <div className="section" style={{ marginBottom: '30px' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF7043', marginBottom: '15px' }}>
                                <Award size={24} /> 철분왕 도전!
                            </h3>
                            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                                <p style={{ color: '#8D6E63', marginBottom: '10px' }}>소고기 섭취 횟수</p>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#FF7043', marginBottom: '10px' }}>
                                    {analysis.beefCount}<span style={{ fontSize: '1.2rem', color: '#BCAAA4' }}>회</span>
                                </div>
                                <div style={{ height: '10px', background: '#F5F5F5', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px' }}>
                                    <div style={{ width: `${analysis.beefScore}%`, height: '100%', background: 'linear-gradient(90deg, #FFAB40, #FF7043)' }} />
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#5D4037' }}>
                                    {analysis.beefScore >= 100 ? "완벽해요! 우리 아기 철분 충전 완료! 💪" : "빈혈 예방을 위해 소고기를 더 챙겨주세요."}
                                </p>
                            </div>
                        </div>

                        {/* Section 2: Ingredient Variety (Badge Collection style) */}
                        <div className="section" style={{ marginBottom: '30px' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#66BB6A', marginBottom: '15px' }}>
                                <LayoutGrid size={24} /> 맛본 재료 도감
                            </h3>
                            <div style={{ background: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                                <p style={{ marginBottom: '15px', color: '#8D6E63' }}>총 <b>{analysis.uniqueIngredients.length}가지</b> 재료를 먹어봤어요.</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {analysis.uniqueIngredients.length > 0 ? analysis.uniqueIngredients.map((ing, i) => (
                                        <span key={i} style={{ background: '#E8F5E9', color: '#2E7D32', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '500' }}>
                                            {ing}
                                        </span>
                                    )) : (
                                        <div style={{ color: '#BCAAA4' }}>아직 기록이 없어요.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Balance Stats */}
                        <div className="section">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E88E5', marginBottom: '15px' }}>
                                <PieChart size={24} /> 영양 밸런스
                            </h3>
                            <div style={{ background: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dashed #EEE' }}>
                                    <span>🥩 단백질 (고기/콩)</span>
                                    <b>{analysis.balance.protein}회</b>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dashed #EEE' }}>
                                    <span>🥦 비타민 (채소)</span>
                                    <b>{analysis.balance.veggies}회</b>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>🍚 에너지 (탄수화물)</span>
                                    <b>{analysis.balance.carbs}회</b>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default MealPlanner
