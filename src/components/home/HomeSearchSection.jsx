import { Search, X, Clock } from 'lucide-react'
import HighlightText from '../HighlightText'

function HomeSearchSection({
  searchTerm,
  setSearchTerm,
  showRecentSearches,
  setShowRecentSearches,
  handleSearchSubmit,
  recentSearches,
  applyRecentSearch,
  clearSearches,
  removeSearch,
  suggestions
}) {
  return (
    <div className="search-bar">
      <div className="home-search-input-wrap">
        <Search size={20} color="#BCAAA4" className="home-search-icon-left" />
        <input
          type="text"
          placeholder="재료나 메뉴를 검색해보세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowRecentSearches(true)}
          onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchSubmit()
              e.target.blur()
            }
          }}
          className="home-search-input"
        />

        {searchTerm && (
          <X
            size={18}
            color="#BCAAA4"
            onClick={() => {
              setSearchTerm('')
              setShowRecentSearches(false)
            }}
            className="home-search-icon-right"
          />
        )}

        {showRecentSearches && recentSearches.length > 0 && !searchTerm && (
          <div className="home-dropdown">
            <div className="home-dropdown-header">
              <div className="home-dropdown-title">
                <Clock size={14} />
                <span>최근 검색어</span>
              </div>
              <button
                onClick={() => clearSearches()}
                className="home-dropdown-clear"
              >
                전체삭제
              </button>
            </div>

            {recentSearches.map((term, index) => (
              <div
                key={index}
                onClick={() => applyRecentSearch(term)}
                className="home-dropdown-item"
              >
                <div className="home-dropdown-item-text">{term}</div>
                <X
                  size={14}
                  color="#999"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSearch(term)
                  }}
                  className="home-remove-search"
                />
              </div>
            ))}
          </div>
        )}

        {showRecentSearches && suggestions.length > 0 && searchTerm && searchTerm.length >= 2 && (
          <div className="home-dropdown">
            <div className="home-dropdown-header">
              <div className="home-dropdown-title">
                <Search size={14} />
                <span>추천 검색어</span>
              </div>
            </div>

            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => {
                  setSearchTerm(suggestion)
                  setShowRecentSearches(false)
                }}
                className="home-dropdown-item"
              >
                <div className="home-dropdown-item-left">
                  <Search size={16} color="#BCAAA4" />
                  <div className="home-dropdown-item-text">
                    <HighlightText text={suggestion} searchTerm={searchTerm} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeSearchSection
