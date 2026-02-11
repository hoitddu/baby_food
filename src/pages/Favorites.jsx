import { useNavigate } from 'react-router-dom'
import { Heart, AlertTriangle } from 'lucide-react'
import { recipes } from '../data/recipes'
import RecipeImage from '../components/RecipeImage'

function Favorites({ favorites, toggleFavorite, preferences }) {
    const navigate = useNavigate()

    // Filter only favorited recipes
    const favoriteRecipes = recipes.filter(recipe => favorites[recipe.name])

    // Reuse allergy check logic (could actully be a utility function)
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

    return (
        <div className="page-content">
            <header className="app-header" style={{ paddingBottom: '10px' }}>
                <h1 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Heart fill="#FF5252" color="#FF5252" size={28} />
                    찜한 레시피
                </h1>
                <p style={{ fontSize: '0.9rem', color: '#8D6E63', opacity: 0.9 }}>
                    아기가 좋아하는 메뉴만 모았어요!
                </p>
            </header>

            <div className="recipe-list">
                {favoriteRecipes.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💝</div>
                        <p>아직 찜한 레시피가 없어요.<br />마음에 드는 메뉴에 하트를 눌러보세요!</p>
                    </div>
                ) : (
                    favoriteRecipes.map((recipe, index) => {
                        // Find original index to navigate correctly
                        const originalIndex = recipes.findIndex(r => r.name === recipe.name)
                        const risks = checkAllergy(recipe)
                        const isSafe = risks.length === 0

                        return (
                            <div
                                key={index}
                                className="recipe-card fade-in"
                                onClick={() => navigate(`/recipe/${originalIndex}`, { state: { recipe } })}
                            >
                                {/* Recipe Image */}
                                <RecipeImage
                                    recipeName={recipe.name}
                                    category={recipe.category}
                                    imagePath={recipe.image}
                                    height="180px"
                                    borderRadius="12px 12px 0 0"
                                />

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
                                        <Heart size={22} color="#FF5252" fill="#FF5252" />
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

export default Favorites
