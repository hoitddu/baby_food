import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, AlertTriangle, Heart, X } from 'lucide-react'
import { recipes } from '../data/recipes'
import mascotImg from '../assets/mascot.png'
import { RecipeListSkeleton } from '../components/SkeletonLoader'

function Home({ preferences, profile, favorites, toggleFavorite }) {
    const navigate = useNavigate()
    const [activeCategory, setActiveCategory] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // Simulate initial loading (for better UX and future API integration)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 300) // Short delay for smooth transition
        return () => clearTimeout(timer)
    }, [])

    const babyName = profile?.name || '우리 아기'
    const categories = ['All', ...new Set(recipes.map(r => r.category))]

    const allergyKeywords = {
        dairy: ['우유', '치즈', '요거트', '버터', '크림', '분유'],
        eggs: ['계란', '달걀', '노른자', '흰자'],
        peanuts: ['땅콩'],
        treeNuts: ['호두', '아몬드', '잣', '캐슈넛', '밤'],
        wheat: ['밀가루', '빵', '국수', '면', '파스타', '소면'],
        soy: ['콩', '두부', '두유', '간장', '된장', '나또'],
        fish: ['생선', '대구', '가자미', '조기', '멸치', '연어']
    }

    const checkAllergy = (recipe) => {
        let risks = []
        const ingredientText = (recipe.ingredients || "").toLowerCase()
        Object.keys(preferences).forEach(key => {
            if (preferences[key]) {
                const keywords = allergyKeywords[key] || []
                if (keywords.some(k => ingredientText.includes(k))) risks.push(key)
            }
        })
        return risks
    }

    const filteredRecipes = recipes.filter(recipe => {
        // 1. Category Filter
        let categoryMatch = activeCategory === 'All' || recipe.category === activeCategory

        // 2. Search Text Filter
        const searchMatch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (recipe.ingredients && recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase()))

        return categoryMatch && searchMatch
    })



    return (
        <div className="page-content">
            <header className="app-header" style={{ paddingBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <p style={{ fontSize: '0.9rem', color: '#8D6E63', marginBottom: '4px' }}>오늘도 맛있게! 🥄</p>
                    <h1 style={{ fontSize: '1.6rem' }}>{babyName} 맘,<br />어서오세요!</h1>
                </div>
                <img src={mascotImg} alt="Mascot" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            </header>



            <div className="search-bar">
                {/* Text Search Input */}
                <div style={{ position: 'relative' }}>
                    <Search size={20} color="#BCAAA4" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="재료나 메뉴를 검색해보세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '45px' }}
                    />
                    {searchTerm && (
                        <X
                            size={18} color="#BCAAA4"
                            onClick={() => setSearchTerm('')}
                            style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        />
                    )}
                </div>
            </div>

            {/* Categories (Still useful for filtering by Age/Type) */}
            <div className="category-tabs" style={{ marginTop: '10px' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={activeCategory === cat ? 'active' : ''}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="recipe-list">
                {isLoading ? (
                    <RecipeListSkeleton count={6} />
                ) : filteredRecipes.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🤔</div>
                        <p>
                            검색 결과가 없어요.<br />
                            다른 검색어로 찾아보세요!
                        </p>
                    </div>
                ) : (
                    filteredRecipes.map((recipe, index) => {
                        const risks = checkAllergy(recipe)
                        const isSafe = risks.length === 0
                        const isFavorite = favorites[recipe.name]

                        return (
                            <div
                                key={index}
                                className="recipe-card fade-in"
                                onClick={() => navigate(`/recipe/${index}`, { state: { recipe } })}
                                style={{ opacity: isSafe ? 1 : 0.6, position: 'relative' }}
                            >
                                {/* Recipe Content */}
                                <div className="recipe-header">
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {recipe.name}
                                            {!isSafe && <AlertTriangle size={16} color="#FF5252" />}
                                        </h3>

                                        {!isSafe && (
                                            <div style={{ fontSize: '0.75rem', color: '#FF5252', marginTop: '2px' }}>
                                                ⚠️ 알레르기 주의 ({risks.join(', ')})
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleFavorite(recipe.name)
                                        }}
                                        style={{ padding: '10px', marginRight: '-10px' }}
                                    >
                                        <Heart
                                            size={22}
                                            color={isFavorite ? '#FF5252' : '#D7CCC8'}
                                            fill={isFavorite ? '#FF5252' : 'none'}
                                            style={{ transition: 'all 0.2s' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
            <div style={{ height: '80px' }}></div>
        </div>
    )
}

export default Home
