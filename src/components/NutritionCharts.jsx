import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

/**
 * Nutrition Doughnut Chart
 * Shows distribution of nutrition categories (carbs, protein, veggies, fruits)
 */
export function NutritionDoughnutChart({ carbsCount = 0, proteinCount = 0, veggiesCount = 0, fruitsCount = 0 }) {
  const total = carbsCount + proteinCount + veggiesCount + fruitsCount

  if (total === 0) {
    return (
      <div style={{
        height: '250px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9f9f9',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
        <p style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>
          아직 식단 기록이 없어요.<br />
          레시피를 기록하면 영양 분석이 표시됩니다.
        </p>
      </div>
    )
  }

  const data = {
    labels: ['탄수화물', '단백질', '채소', '과일'],
    datasets: [
      {
        data: [carbsCount, proteinCount, veggiesCount, fruitsCount],
        backgroundColor: [
          '#FFD180', // Carbs - Warm Orange
          '#FF8A65', // Protein - Deep Coral
          '#81C784', // Veggies - Green
          '#FFB74D'  // Fruits - Yellow Orange
        ],
        borderColor: [
          '#FFD180',
          '#FF8A65',
          '#81C784',
          '#FFB74D'
        ],
        borderWidth: 2,
        hoverOffset: 8
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 13,
            family: 'Pretendard, sans-serif',
            weight: '600'
          },
          color: '#4E342E',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(78, 52, 46, 0.9)',
        titleFont: {
          size: 14,
          family: 'Pretendard, sans-serif',
          weight: '700'
        },
        bodyFont: {
          size: 13,
          family: 'Pretendard, sans-serif'
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value}회 (${percentage}%)`
          }
        }
      }
    },
    cutout: '60%'
  }

  return (
    <div style={{ height: '280px', position: 'relative' }}>
      <Doughnut data={data} options={options} />

      {/* Center Text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#4E342E' }}>
          {total}
        </div>
        <div style={{ fontSize: '12px', color: '#8D6E63', marginTop: '4px' }}>
          총 기록
        </div>
      </div>
    </div>
  )
}

/**
 * Weekly Nutrition Bar Chart
 * Shows nutrition balance over the last 7 days
 */
export function WeeklyNutritionChart({ weeklyData = [] }) {
  // weeklyData: Array of { date, carbs, protein, veggies, fruits }

  if (weeklyData.length === 0) {
    return (
      <div style={{
        height: '250px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9f9f9',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📅</div>
        <p style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>
          주간 기록이 없습니다.
        </p>
      </div>
    )
  }

  const labels = weeklyData.map(d => {
    const date = new Date(d.date)
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    return `${date.getMonth() + 1}/${date.getDate()} (${dayNames[date.getDay()]})`
  })

  const data = {
    labels,
    datasets: [
      {
        label: '탄수화물',
        data: weeklyData.map(d => d.carbs || 0),
        backgroundColor: '#FFD180',
        borderRadius: 6
      },
      {
        label: '단백질',
        data: weeklyData.map(d => d.protein || 0),
        backgroundColor: '#FF8A65',
        borderRadius: 6
      },
      {
        label: '채소',
        data: weeklyData.map(d => d.veggies || 0),
        backgroundColor: '#81C784',
        borderRadius: 6
      },
      {
        label: '과일',
        data: weeklyData.map(d => d.fruits || 0),
        backgroundColor: '#FFB74D',
        borderRadius: 6
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 12,
          font: {
            size: 12,
            family: 'Pretendard, sans-serif',
            weight: '600'
          },
          color: '#4E342E',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(78, 52, 46, 0.9)',
        titleFont: {
          size: 13,
          family: 'Pretendard, sans-serif',
          weight: '700'
        },
        bodyFont: {
          size: 12,
          family: 'Pretendard, sans-serif'
        },
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Pretendard, sans-serif'
          },
          color: '#8D6E63'
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12,
            family: 'Pretendard, sans-serif'
          },
          color: '#8D6E63',
          stepSize: 1
        }
      }
    }
  }

  return (
    <div style={{ height: '280px' }}>
      <Bar data={data} options={options} />
    </div>
  )
}

/**
 * Progress Bar Component
 * Shows percentage progress towards nutrition goals
 */
export function NutritionProgressBar({ label, current, goal, color = '#FF8A65', icon = '📊' }) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0
  const isComplete = current >= goal

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#4E342E',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>{icon}</span>
          <span>{label}</span>
        </div>
        <div style={{
          fontSize: '13px',
          fontWeight: '700',
          color: isComplete ? '#4CAF50' : '#8D6E63'
        }}>
          {current} / {goal}
          {isComplete && ' ✓'}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '10px',
        background: '#f0f0f0',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: isComplete
            ? 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)'
            : `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
          borderRadius: '10px',
          transition: 'width 0.5s ease-out',
          boxShadow: `0 0 10px ${color}33`
        }} />
      </div>
    </div>
  )
}

export default {
  NutritionDoughnutChart,
  WeeklyNutritionChart,
  NutritionProgressBar
}
