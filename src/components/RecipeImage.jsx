import { useState } from 'react'
import './recipeImage.css'

const categoryIcons = {
  한그릇: '🍲',
  '죽/리조또': '🥣',
  단백질: '🍗',
  '국/탕': '🍜',
  반찬: '🥗',
  주먹밥: '🍙',
  면: '🍝',
  '토스트/팬케이크': '🥞',
  '퓨레/소스': '🫙',
  '간식': '🍪',
  default: '📸'
}

const categoryColors = {
  한그릇: 'linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)',
  '죽/리조또': 'linear-gradient(135deg, #FFF8E1 0%, #FFE082 100%)',
  단백질: 'linear-gradient(135deg, #FFE8E0 0%, #FFCCBC 100%)',
  '국/탕': 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
  반찬: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
  주먹밥: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
  면: 'linear-gradient(135deg, #FFF3E0 0%, #FFCC80 100%)',
  '토스트/팬케이크': 'linear-gradient(135deg, #FFFDE7 0%, #FFF59D 100%)',
  '퓨레/소스': 'linear-gradient(135deg, #EDE7F6 0%, #D1C4E9 100%)',
  '간식': 'linear-gradient(135deg, #F8BBD0 0%, #F48FB1 100%)',
  default: 'linear-gradient(135deg, #FFE0B2 0%, #FFD180 100%)'
}

function PlaceholderImage({ category, recipeName, width, height }) {
  const icon = categoryIcons[category] || categoryIcons.default
  const gradient = categoryColors[category] || categoryColors.default

  return (
    <div
      className="recipe-image-placeholder"
      style={{ width: width || '100%', height: height || '180px', background: gradient }}
    >
      <div className="recipe-image-pattern" />
      <div className="recipe-image-content">
        <div className="recipe-image-icon-wrap">
          <div className="recipe-image-icon">{icon}</div>
        </div>
        <div className="recipe-image-status">이미지 준비중</div>
        <div className="recipe-image-status-sub">카테고리 일러스트를 준비하고 있어요</div>
        <div className="recipe-image-name">{recipeName}</div>
      </div>
    </div>
  )
}

function RecipeImage({
  recipeName,
  category,
  imagePath,
  alt,
  width,
  height = '180px',
  borderRadius = '12px',
  className = '',
  loading = 'lazy'
}) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const imageUrl = imagePath ? `/images/recipes/${imagePath}` : null

  if (!imageUrl || imageError) {
    return (
      <div className={className} style={{ borderRadius }}>
        <PlaceholderImage category={category} recipeName={recipeName} width={width} height={height} />
      </div>
    )
  }

  return (
    <div
      className={`recipe-image-shell ${className}`.trim()}
      style={{ width: width || '100%', height, borderRadius }}
    >
      {!imageLoaded && (
        <div className="recipe-image-loading-overlay">
          <PlaceholderImage category={category} recipeName={recipeName} width={width} height={height} />
        </div>
      )}

      <img
        src={imageUrl}
        alt={alt || recipeName}
        loading={loading}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        className={`recipe-image-tag ${imageLoaded ? 'loaded' : ''}`}
      />
    </div>
  )
}

export default RecipeImage
