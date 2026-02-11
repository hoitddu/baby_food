import { useState } from 'react'

/**
 * Recipe Image Component with lazy loading and fallback
 * Displays recipe images with placeholder support
 */

// Category-specific emoji icons
const categoryIcons = {
  '한그릇덮밥': '🍲',
  '초기 이유식': '🥣',
  '중기 이유식': '🍚',
  '간식': '🍪',
  '유아식 반찬': '🥘',
  '주먹밥': '🍙',
  'default': '🍽️'
}

// Category-specific gradient colors
const categoryColors = {
  '한그릇덮밥': 'linear-gradient(135deg, #FFD180 0%, #FFAB40 100%)',
  '초기 이유식': 'linear-gradient(135deg, #B2DFDB 0%, #80CBC4 100%)',
  '중기 이유식': 'linear-gradient(135deg, #C5CAE9 0%, #9FA8DA 100%)',
  '간식': 'linear-gradient(135deg, #F8BBD0 0%, #F48FB1 100%)',
  '유아식 반찬': 'linear-gradient(135deg, #FFCCBC 0%, #FFAB91 100%)',
  '주먹밥': 'linear-gradient(135deg, #FFF9C4 0%, #FFF176 100%)',
  'default': 'linear-gradient(135deg, #FFE0B2 0%, #FFD180 100%)'
}

/**
 * Generate placeholder SVG
 */
function PlaceholderImage({ category, recipeName, width, height }) {
  const icon = categoryIcons[category] || categoryIcons.default
  const gradient = categoryColors[category] || categoryColors.default

  return (
    <div
      style={{
        width: width || '100%',
        height: height || '180px',
        background: gradient,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'inherit',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }} />

      {/* Icon */}
      <div style={{
        fontSize: '64px',
        marginBottom: '8px',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
        position: 'relative',
        zIndex: 1
      }}>
        {icon}
      </div>

      {/* Recipe Name */}
      <div style={{
        fontSize: '12px',
        fontWeight: '600',
        color: 'rgba(78, 52, 46, 0.7)',
        textAlign: 'center',
        padding: '0 20px',
        maxWidth: '80%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        position: 'relative',
        zIndex: 1
      }}>
        {recipeName}
      </div>
    </div>
  )
}

/**
 * Main RecipeImage Component
 */
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

  // Construct image URL
  const imageUrl = imagePath
    ? `/images/recipes/${imagePath}`
    : null

  // If no image path or image failed to load, show placeholder
  if (!imageUrl || imageError) {
    return (
      <div style={{ borderRadius }} className={className}>
        <PlaceholderImage
          category={category}
          recipeName={recipeName}
          width={width}
          height={height}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        width: width || '100%',
        height,
        borderRadius,
        position: 'relative',
        overflow: 'hidden',
        background: '#f0f0f0'
      }}
      className={className}
    >
      {/* Show placeholder while loading */}
      {!imageLoaded && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <PlaceholderImage
            category={category}
            recipeName={recipeName}
            width={width}
            height={height}
          />
        </div>
      )}

      {/* Actual Image */}
      <img
        src={imageUrl}
        alt={alt || recipeName}
        loading={loading}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </div>
  )
}

export default RecipeImage
