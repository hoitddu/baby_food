import { useState, useEffect, useCallback } from 'react'
import { Check } from 'lucide-react'
import mascotImg from '../assets/mascot-chatgpt.png'
import './onboarding.css'

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [babyName, setBabyName] = useState('')
  const [selectedAllergies, setSelectedAllergies] = useState({})

  const allergiesList = [
    { key: 'dairy', label: '우유', icon: '🥛' },
    { key: 'eggs', label: '계란', icon: '🥚' },
    { key: 'peanuts', label: '땅콩', icon: '🥜' },
    { key: 'treeNuts', label: '견과류', icon: '🌰' },
    { key: 'wheat', label: '밀가루', icon: '🌾' },
    { key: 'soy', label: '콩류', icon: '🫘' },
    { key: 'fish', label: '생선', icon: '🐟' }
  ]

  const toggleAllergy = (key) => {
    setSelectedAllergies((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleNext = useCallback(() => {
    if (step === 1 && !babyName.trim()) return

    if (step < 2) {
      setStep((prev) => prev + 1)
    } else {
      onComplete({ name: babyName.trim(), allergies: selectedAllergies })
    }
  }, [step, babyName, selectedAllergies, onComplete])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Enter') return
      if (e.isComposing || e.keyCode === 229) return
      handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext])

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="onboarding-step onboarding-fade-in">
            <div className="onboarding-hero">
              <div className="onboarding-mascot-shell">
                <img src={mascotImg} alt="Mascot" className="onboarding-mascot" />
              </div>
            </div>
            <h1 className="onboarding-title-main">반가워요! 👋</h1>
            <p className="onboarding-description">
              우리 아기만을 위한 맞춤 이유식,
              <br />
              <b>Baby YumYum</b>에 오신 걸 환영해요.
            </p>
          </div>
        )
      case 1:
        return (
          <div className="onboarding-step onboarding-slide-in">
            <h2 className="onboarding-title-sub">
              아기 이름은
              <br />
              무엇인가요? 🍼
            </h2>
            <input
              type="text"
              placeholder="예: 지우"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              className="onboarding-name-input"
              autoFocus
            />
          </div>
        )
      case 2:
        return (
          <div className="onboarding-step onboarding-slide-in">
            <h2 className="onboarding-title-sub compact">
              못 먹는 재료가
              <br />
              있나요? ⚠️
            </h2>
            <p className="onboarding-help">해당되는 재료를 선택해주세요.</p>

            <div className="onboarding-allergy-grid">
              {allergiesList.map((item) => {
                const selected = !!selectedAllergies[item.key]
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleAllergy(item.key)}
                    className={`onboarding-allergy-item ${selected ? 'selected' : ''}`}
                  >
                    <span className="onboarding-allergy-icon">{item.icon}</span>
                    <span className={`onboarding-allergy-label ${selected ? 'selected' : ''}`}>{item.label}</span>
                    {selected && <Check size={16} color="#FF6F00" className="onboarding-check" />}
                  </div>
                )
              })}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const isNameStepInvalid = step === 1 && !babyName.trim()

  return (
    <div className="onboarding-page">
      <div className="app-container onboarding-shell">
        <div className="onboarding-progress-track">
          <div className={`onboarding-progress-fill step-${step + 1}`} />
        </div>

        <div className="onboarding-content">{renderStepContent()}</div>

        <button
          onClick={handleNext}
          disabled={isNameStepInvalid}
          className={`onboarding-next-btn ${isNameStepInvalid ? 'disabled' : ''}`}
        >
          {step === 2 ? '완성하기! 🎉' : '다음으로 👉'}
        </button>
      </div>
    </div>
  )
}

export default Onboarding
