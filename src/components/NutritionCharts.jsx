import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { DAY_NAMES_KO } from '../domain/constants'
import './nutritionCharts.css'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export function NutritionDoughnutChart({ carbsCount = 0, proteinCount = 0, veggiesCount = 0, fruitsCount = 0 }) {
  const total = carbsCount + proteinCount + veggiesCount + fruitsCount

  if (total === 0) {
    return (
      <div className="nutrition-empty">
        <div className="nutrition-empty-icon">📊</div>
        <p className="nutrition-empty-text">
          아직 식단 기록이 없어요.
          <br />
          레시피를 기록하면 영양 분석을 보여드려요.
        </p>
      </div>
    )
  }

  const data = {
    labels: ['탄수화물', '단백질', '채소', '과일'],
    datasets: [
      {
        data: [carbsCount, proteinCount, veggiesCount, fruitsCount],
        backgroundColor: ['#FFD180', '#FF8A65', '#81C784', '#FFB74D'],
        borderColor: ['#FFD180', '#FF8A65', '#81C784', '#FFB74D'],
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
          font: { size: 13, family: 'Pretendard, sans-serif', weight: '600' },
          color: '#4E342E',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(78, 52, 46, 0.9)',
        titleFont: { size: 14, family: 'Pretendard, sans-serif', weight: '700' },
        bodyFont: { size: 13, family: 'Pretendard, sans-serif' },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label(context) {
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
    <div className="nutrition-doughnut-wrap">
      <Doughnut data={data} options={options} />
      <div className="nutrition-doughnut-center">
        <div className="nutrition-doughnut-total">{total}</div>
        <div className="nutrition-doughnut-caption">총 기록</div>
      </div>
    </div>
  )
}

export function WeeklyNutritionChart({ weeklyData = [] }) {
  if (weeklyData.length === 0) {
    return (
      <div className="nutrition-empty">
        <div className="nutrition-empty-icon">📈</div>
        <p className="nutrition-empty-text">주간 기록이 아직 없어요.</p>
      </div>
    )
  }

  const labels = weeklyData.map((d) => {
    const date = new Date(d.date)
    return `${date.getMonth() + 1}/${date.getDate()} (${DAY_NAMES_KO[date.getDay()]})`
  })

  const data = {
    labels,
    datasets: [
      { label: '탄수화물', data: weeklyData.map((d) => d.carbs || 0), backgroundColor: '#FFD180', borderRadius: 6 },
      { label: '단백질', data: weeklyData.map((d) => d.protein || 0), backgroundColor: '#FF8A65', borderRadius: 6 },
      { label: '채소', data: weeklyData.map((d) => d.veggies || 0), backgroundColor: '#81C784', borderRadius: 6 },
      { label: '과일', data: weeklyData.map((d) => d.fruits || 0), backgroundColor: '#FFB74D', borderRadius: 6 }
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
          font: { size: 12, family: 'Pretendard, sans-serif', weight: '600' },
          color: '#4E342E',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(78, 52, 46, 0.9)',
        titleFont: { size: 13, family: 'Pretendard, sans-serif', weight: '700' },
        bodyFont: { size: 12, family: 'Pretendard, sans-serif' },
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          font: { size: 11, family: 'Pretendard, sans-serif' },
          color: '#8D6E63'
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          font: { size: 12, family: 'Pretendard, sans-serif' },
          color: '#8D6E63',
          stepSize: 1
        }
      }
    }
  }

  return (
    <div className="nutrition-bar-wrap">
      <Bar data={data} options={options} />
    </div>
  )
}

export function NutritionProgressBar({ label, current, goal, color = '#FF8A65', icon = '🍽️' }) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0
  const isComplete = current >= goal

  const fillStyle = {
    width: `${percentage}%`,
    background: isComplete
      ? 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)'
      : `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
    boxShadow: `0 0 10px ${color}33`
  }

  return (
    <div className="nutrition-progress-item">
      <div className="nutrition-progress-head">
        <div className="nutrition-progress-label">
          <span>{icon}</span>
          <span>{label}</span>
        </div>
        <div className={`nutrition-progress-value ${isComplete ? 'complete' : ''}`}>
          {current} / {goal}
          {isComplete && ' 완료'}
        </div>
      </div>

      <div className="nutrition-progress-track">
        <div className="nutrition-progress-fill" style={fillStyle} />
      </div>
    </div>
  )
}

export default {
  NutritionDoughnutChart,
  WeeklyNutritionChart,
  NutritionProgressBar
}
