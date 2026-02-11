import { useState, useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import mascotImg from '../assets/mascot.png'

function Onboarding({ onComplete }) {
    const [step, setStep] = useState(0)
    const [babyName, setBabyName] = useState('')
    const [selectedAllergies, setSelectedAllergies] = useState({})

    const allergiesList = [
        { key: 'dairy', label: '우유', icon: '🥛' },
        { key: 'eggs', label: '계란', icon: '🥚' },
        { key: 'peanuts', label: '땅콩', icon: '🥜' },
        { key: 'treeNuts', label: '견과류', icon: '🌰' },
        { key: 'wheat', label: '밀가루', icon: '🍞' },
        { key: 'soy', label: '콩/두부', icon: '🌱' },
        { key: 'fish', label: '생선', icon: '🐟' },
    ]

    const toggleAllergy = (key) => {
        setSelectedAllergies(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const handleNext = () => {
        if (step < 2) setStep(step + 1)
        else {
            onComplete({ name: babyName, allergies: selectedAllergies })
        }
    }

    // Handle Enter Key Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                if (step === 1 && !babyName) return
                handleNext()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [step, babyName, selectedAllergies]) // Dependencies for handleNext logic

    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <div className="onboarding-step fade-in">
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <img src={mascotImg} alt="Mascot" style={{ width: '150px', borderRadius: '50%', boxShadow: '0 10px 30px rgba(255,171,64,0.2)' }} />
                        </div>
                        <h1 style={{ fontSize: '1.8rem', color: '#4E342E', marginBottom: '10px' }}>반가워요! 👋</h1>
                        <p style={{ color: '#8D6E63', lineHeight: '1.6' }}>
                            우리 아기만을 위한 맞춤 이유식,<br />
                            <b>Baby YumYum</b>이 도와드릴게요.
                        </p>
                    </div>
                )
            case 1:
                return (
                    <div className="onboarding-step slide-in">
                        <h2 style={{ fontSize: '1.5rem', color: '#4E342E', marginBottom: '30px' }}>아기 이름이<br />무엇인가요? 👶</h2>
                        <input
                            type="text"
                            placeholder="예: 지은이, 튼튼이"
                            value={babyName}
                            onChange={(e) => setBabyName(e.target.value)}
                            style={{
                                width: '100%', padding: '20px', fontSize: '1.2rem',
                                border: '2px solid #FFD180', borderRadius: '20px',
                                outline: 'none', background: 'white', color: '#4E342E',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                boxSizing: 'border-box'
                            }}
                            autoFocus
                        />
                    </div>
                )
            case 2:
                return (
                    <div className="onboarding-step slide-in">
                        <h2 style={{ fontSize: '1.5rem', color: '#4E342E', marginBottom: '10px' }}>못 먹는 재료가<br />있나요? 🚫</h2>
                        <p style={{ color: '#BCAAA4', marginBottom: '20px', fontSize: '0.9rem' }}>해당되는 재료를 선택해주세요.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {allergiesList.map(item => (
                                <div
                                    key={item.key}
                                    onClick={() => toggleAllergy(item.key)}
                                    style={{
                                        background: selectedAllergies[item.key] ? '#FFECB3' : 'white',
                                        border: selectedAllergies[item.key] ? '2px solid #FFAB40' : '2px solid transparent',
                                        padding: '15px', borderRadius: '15px',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                    <span style={{ fontWeight: selectedAllergies[item.key] ? 'bold' : 'normal', color: '#5D4037', fontSize: '0.9rem' }}>{item.label}</span>
                                    {selectedAllergies[item.key] && <Check size={16} color="#FF6F00" style={{ marginLeft: 'auto' }} />}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            default: return null
        }
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
            minHeight: '100vh', width: '100%', background: '#FDFBF7'
        }}>
            <div className="app-container" style={{
                boxShadow: 'none', background: 'transparent', // Reuse app container sizing but remove redundant styles
                padding: '20px 24px 40px',
                display: 'flex', flexDirection: 'column'
            }}>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '6px', background: '#F5F5F5', borderRadius: '3px', marginBottom: '40px', marginTop: '20px' }}>
                    <div style={{
                        width: `${((step + 1) / 3) * 100}%`, height: '100%',
                        background: '#FFAB40', borderRadius: '3px', transition: 'width 0.3s ease'
                    }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {renderStepContent()}
                </div>

                <button
                    onClick={handleNext}
                    disabled={step === 1 && !babyName}
                    style={{
                        width: '100%', padding: '20px', borderRadius: '25px',
                        background: (step === 1 && !babyName) ? '#E0E0E0' : 'linear-gradient(135deg, #FFD180 0%, #FFAB40 100%)',
                        color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 'bold',
                        boxShadow: (step === 1 && !babyName) ? 'none' : '0 10px 20px rgba(255, 171, 64, 0.3)',
                        cursor: 'pointer', transition: 'all 0.3s',
                        marginTop: '20px',
                        marginBottom: 'env(safe-area-inset-bottom)'
                    }}
                >
                    {step === 2 ? '완성하기! 🎉' : '다음으로 👉'}
                </button>

                <style>{`
                .fade-in { animation: fadeIn 0.5s ease-out; }
                .slide-in { animation: slideIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
            `}</style>
            </div>
        </div>
    )
}

export default Onboarding
