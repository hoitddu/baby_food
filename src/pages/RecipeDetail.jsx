import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, ChefHat, CheckCircle, X, Check, Home as HomeIcon } from 'lucide-react'
import { RecipeDetailSkeleton } from '../components/SkeletonLoader'
import RecipeImage from '../components/RecipeImage'

function RecipeDetail({ favorites, toggleFavorite, addMealToHistory }) {
    const location = useLocation()
    const navigate = useNavigate()
    const { recipe } = location.state || {}

    // State for Meal Selector Modal
    const [showMealSelector, setShowMealSelector] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Simulate loading for smooth UX
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 200)
        return () => clearTimeout(timer)
    }, [])

    // Improved "Recipe not found" UI
    if (!isLoading && !recipe) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #FDFBF7 0%, #FFF3E0 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>😕</div>
                <h2 style={{ fontSize: '24px', color: '#4E342E', marginBottom: '12px' }}>
                    레시피를 찾을 수 없어요
                </h2>
                <p style={{ fontSize: '16px', color: '#8D6E63', marginBottom: '32px', lineHeight: '1.6' }}>
                    요청하신 레시피 정보를 불러올 수 없습니다.<br />
                    다시 시도해주세요.
                </p>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '16px 32px',
                        background: '#FF8A65',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(255, 138, 101, 0.3)'
                    }}
                >
                    <HomeIcon size={20} />
                    홈으로 돌아가기
                </button>
            </div>
        )
    }

    // Show skeleton loader while loading
    if (isLoading) {
        return <RecipeDetailSkeleton />
    }

    const isFavorite = favorites[recipe.name]

    const handleRecord = (mealType) => {
        // 1. Get Today's Date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0]

        // 2. Call the App's record function
        addMealToHistory(today, mealType, recipe)

        // 3. Close modal and show confirmation
        setShowMealSelector(false)
        setShowToast(true)

        // 4. Hide toast after 2 seconds
        setTimeout(() => setShowToast(false), 2000)
    }

    return (
        <div className="page-content" style={{ background: '#FDFBF7', minHeight: '100vh', paddingBottom: '100px' }}>

            {/* Header Wrapper */}
            <div style={{ position: 'relative' }}>
                {/* Recipe Image Header */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <RecipeImage
                        recipeName={recipe.name}
                        category={recipe.category}
                        imagePath={recipe.image}
                        height="300px"
                        borderRadius="0 0 30px 30px"
                    />

                    {/* Gradient Overlay for better text visibility */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%)',
                        borderRadius: '0 0 30px 30px'
                    }} />

                    {/* Back Button */}
                    <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }} onClick={() => navigate(-1)}>
                        <div style={{ background: 'rgba(255,255,255,0.9)', padding: '10px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <ArrowLeft size={24} color="#5D4037" />
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => toggleFavorite(recipe.name)}
                    style={{
                        position: 'absolute', bottom: '-25px', right: '30px',
                        zIndex: 20,
                        background: 'white', padding: '15px', borderRadius: '50%',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <Heart
                        size={24}
                        color={isFavorite ? '#FF5252' : '#D7CCC8'}
                        fill={isFavorite ? '#FF5252' : 'none'}
                        style={{ transition: 'all 0.2s' }}
                    />
                </div>
            </div>

            <div style={{ padding: '40px 24px 0' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#4E342E', marginBottom: '8px', fontWeight: '700' }}>{recipe.name}</h1>

                {/* Category Badge */}
                <div style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #FFD180 0%, #FFAB40 100%)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(255, 171, 64, 0.3)'
                }}>
                    {recipe.category}
                </div>

                {/* Ingredients - Checklist Style */}
                <div className="section" style={{ marginBottom: '30px' }}>
                    <h3 style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#FF8A65',
                        marginBottom: '16px',
                        fontSize: '1.3rem',
                        fontWeight: '700'
                    }}>
                        <ChefHat size={22} /> 재료 준비하기
                    </h3>
                    <div style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '20px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        border: '2px solid #FFF3E0'
                    }}>
                        {(recipe.ingredients || recipe.original_full_text || '').split(/[,،]/).map((ingredient, idx) => {
                            const trimmed = ingredient.trim()
                            if (!trimmed) return null

                            return (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    padding: '12px 0',
                                    borderBottom: idx < (recipe.ingredients || '').split(',').length - 1 ? '1px solid #f5f5f5' : 'none'
                                }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '6px',
                                        border: '2px solid #FFD180',
                                        marginRight: '12px',
                                        marginTop: '2px',
                                        flexShrink: 0
                                    }} />
                                    <span style={{
                                        fontSize: '15px',
                                        lineHeight: '1.6',
                                        color: '#4E342E',
                                        fontWeight: '500'
                                    }}>
                                        {trimmed}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Instructions - Step by Step */}
                <div className="section">
                    <h3 style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#FF8A65',
                        marginBottom: '16px',
                        fontSize: '1.3rem',
                        fontWeight: '700'
                    }}>
                        <CheckCircle size={22} /> 조리 방법
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {(recipe.instructions || "조리법 정보가 없습니다.")
                            .split(/\n/)
                            .filter(line => line.trim())
                            .map((step, idx) => {
                                // Remove step numbers if they exist (1., 2., etc.)
                                const cleanStep = step.replace(/^\d+\.\s*/, '').trim()
                                if (!cleanStep) return null

                                return (
                                    <div key={idx} style={{
                                        background: 'white',
                                        padding: '20px',
                                        borderRadius: '16px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        border: '2px solid #FFF3E0',
                                        display: 'flex',
                                        gap: '16px',
                                        alignItems: 'flex-start'
                                    }}>
                                        {/* Step Number */}
                                        <div style={{
                                            background: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
                                            color: 'white',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            flexShrink: 0,
                                            boxShadow: '0 2px 8px rgba(255, 112, 67, 0.3)'
                                        }}>
                                            {idx + 1}
                                        </div>

                                        {/* Step Content */}
                                        <div style={{ flex: 1 }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '15px',
                                                lineHeight: '1.7',
                                                color: '#4E342E',
                                                fontWeight: '500'
                                            }}>
                                                {cleanStep}
                                            </p>

                                            {/* Tip Detection */}
                                            {cleanStep.includes('💡') && (
                                                <div style={{
                                                    marginTop: '12px',
                                                    padding: '12px',
                                                    background: '#FFF9E6',
                                                    borderRadius: '8px',
                                                    borderLeft: '4px solid #FFD180',
                                                    fontSize: '14px',
                                                    color: '#8D6E63'
                                                }}>
                                                    {cleanStep.split('💡')[1]?.trim()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>

            {/* FIXED BOTTOM ACTION BAR */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                padding: '20px 24px calc(20px + env(safe-area-inset-bottom))',
                background: 'linear-gradient(to top, rgba(255,255,255,1) 80%, rgba(255,255,255,0))',
                zIndex: 100
            }}>
                <button
                    onClick={() => setShowMealSelector(true)}
                    style={{
                        width: '100%', padding: '18px', borderRadius: '25px',
                        background: '#4E342E', color: 'white',
                        border: 'none', fontSize: '1.1rem', fontWeight: 'bold',
                        boxShadow: '0 10px 20px rgba(78, 52, 46, 0.3)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}
                >
                    <span>🥄</span> 오늘 먹였어요
                </button>
            </div>

            {/* Meal Selection Modal (Bottom Sheet style) */}
            {showMealSelector && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 2000,
                    display: 'flex', alignItems: 'flex-end'
                }} onClick={() => setShowMealSelector(false)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: '100%', background: 'white',
                            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                            padding: '30px 24px calc(30px + env(safe-area-inset-bottom))',
                            animation: 'slideUp 0.3s ease-out'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#4E342E' }}>언제 먹였나요? 🕒</h3>
                            <button onClick={() => setShowMealSelector(false)} style={{ background: 'none', border: 'none' }}><X color="#BCAAA4" /></button>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['아침', '점심', '저녁'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => handleRecord(type)}
                                    style={{
                                        flex: 1, padding: '20px', borderRadius: '16px',
                                        border: '2px solid #EEE', background: 'white',
                                        fontSize: '1.1rem', color: '#5D4037', fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.8)', color: 'white', padding: '15px 30px',
                    borderRadius: '30px', zIndex: 3000, display: 'flex', alignItems: 'center', gap: '10px',
                    animation: 'fadeIn 0.3s'
                }}>
                    <Check size={20} color="#69F0AE" />
                    <span>식단에 기록되었어요!</span>
                </div>
            )}

            <style>{`
          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
        </div>
    )
}

export default RecipeDetail
