import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { recipes } from '../data/recipes'
import mascotImg from '../assets/mascot-chatgpt.png'
import { useRecentSearches, useRecipeSearch } from '../hooks'
import { getCategoryTheme } from '../domain/categoryTheme'
import HomeSearchSection from '../components/home/HomeSearchSection'
import HomeRecipeList from '../components/home/HomeRecipeList'
import '../components/home/home.css'

const MAX_VISIBLE_RECIPES = 15

function Home({ preferences, profile, favorites, toggleFavorite }) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('추천')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showRecentSearches, setShowRecentSearches] = useState(false)
  const [expandedContextKey, setExpandedContextKey] = useState('')
  const sortBy = 'relevance'

  const { recentSearches, addSearch, removeSearch, clearSearches } = useRecentSearches(5)
  const {
    categories,
    debouncedSearchTerm,
    filteredRecipes,
    suggestions
  } = useRecipeSearch({
    recipes,
    searchTerm,
    activeCategory,
    sortBy,
    debounceMs: 300
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const babyName = profile?.name || '우리 아기'

  const handleSearchSubmit = (term = searchTerm) => {
    const trimmedTerm = term.trim()
    if (trimmedTerm.length > 0) {
      addSearch(trimmedTerm)
      setShowRecentSearches(false)
    }
  }

  const applyRecentSearch = (term) => {
    setSearchTerm(term)
    setShowRecentSearches(false)
  }

  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 0) {
      addSearch(debouncedSearchTerm.trim())
    }
  }, [debouncedSearchTerm, addSearch])

  const currentContextKey = `${activeCategory}::${debouncedSearchTerm.trim().toLowerCase()}`
  const showAllRecipes = expandedContextKey === currentContextKey

  const visibleRecipes = showAllRecipes
    ? filteredRecipes
    : filteredRecipes.slice(0, MAX_VISIBLE_RECIPES)
  const canShowMore = filteredRecipes.length > MAX_VISIBLE_RECIPES && !showAllRecipes
  const remainingRecipeCount = Math.max(filteredRecipes.length - MAX_VISIBLE_RECIPES, 0)

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } })
  }

  return (
    <div className="page-content">
      <header className="app-header home-header">
        <div>
          <p className="home-header-subtitle">오늘도 맛있게 냠냠</p>
          <h1 className="home-header-title">{babyName} 맘을<br />사로잡을 메뉴</h1>
        </div>
        <div className="home-header-mascot-shell">
          <img src={mascotImg} alt="Mascot" className="home-header-mascot" />
        </div>
      </header>

      <HomeSearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showRecentSearches={showRecentSearches}
        setShowRecentSearches={setShowRecentSearches}
        handleSearchSubmit={handleSearchSubmit}
        recentSearches={recentSearches}
        applyRecentSearch={applyRecentSearch}
        clearSearches={clearSearches}
        removeSearch={removeSearch}
        suggestions={suggestions}
      />

      <div className="category-tabs home-category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? 'active' : ''}
            onClick={() => setActiveCategory(cat)}
            style={{
              '--category-bg': getCategoryTheme(cat).bg,
              '--category-border': getCategoryTheme(cat).border,
              '--category-text': getCategoryTheme(cat).text
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {(debouncedSearchTerm.trim() || activeCategory !== '추천') && !isLoading && (
        <div className="home-results-info">
          <div className="home-results-label">
            {debouncedSearchTerm.trim() && (
              <>
                '<strong>{debouncedSearchTerm}</strong>' 검색 결과
              </>
            )}
            {!debouncedSearchTerm.trim() && activeCategory !== '추천' && (
              <>'{activeCategory}' 카테고리</>
            )}
          </div>
          <div className={`home-results-count ${filteredRecipes.length > 0 ? '' : 'empty'}`.trim()}>
            {filteredRecipes.length}개
          </div>
        </div>
      )}

      <HomeRecipeList
        isLoading={isLoading}
        filteredRecipes={visibleRecipes}
        preferences={preferences}
        favorites={favorites}
        debouncedSearchTerm={debouncedSearchTerm}
        onRecipeClick={handleRecipeClick}
        onToggleFavorite={toggleFavorite}
      />

      {canShowMore && (
        <div className="home-show-more-wrap">
          <button
            type="button"
            className="home-show-more-btn"
            onClick={() => setExpandedContextKey(currentContextKey)}
          >
            더 보기 {remainingRecipeCount > 0 ? `(${remainingRecipeCount}개)` : ''}
          </button>
        </div>
      )}

      <div className="home-bottom-space"></div>
    </div>
  )
}

export default Home
