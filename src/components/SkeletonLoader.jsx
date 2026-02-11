/**
 * Skeleton Loader Components
 * Provides loading placeholders for content
 */

// Base Skeleton Component
export function Skeleton({ width = '100%', height = '20px', borderRadius = '8px', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }}
    />
  )
}

// Recipe Card Skeleton
export function RecipeCardSkeleton() {
  return (
    <div style={styles.card}>
      <Skeleton height="180px" borderRadius="12px" />
      <div style={styles.cardContent}>
        <Skeleton width="70%" height="24px" />
        <Skeleton width="100%" height="16px" style={{ marginTop: '8px' }} />
        <Skeleton width="90%" height="16px" style={{ marginTop: '4px' }} />
        <div style={styles.cardFooter}>
          <Skeleton width="80px" height="28px" borderRadius="20px" />
          <Skeleton width="32px" height="32px" borderRadius="50%" />
        </div>
      </div>
    </div>
  )
}

// Recipe List Skeleton
export function RecipeListSkeleton({ count = 6 }) {
  return (
    <div style={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Recipe Detail Skeleton
export function RecipeDetailSkeleton() {
  return (
    <div style={styles.detail}>
      <Skeleton height="300px" borderRadius="0" />
      <div style={styles.detailContent}>
        <Skeleton width="80%" height="32px" />
        <Skeleton width="120px" height="24px" style={{ marginTop: '12px' }} borderRadius="20px" />

        <div style={{ marginTop: '24px' }}>
          <Skeleton width="100px" height="24px" />
          <Skeleton width="100%" height="16px" style={{ marginTop: '12px' }} />
          <Skeleton width="95%" height="16px" style={{ marginTop: '8px' }} />
          <Skeleton width="90%" height="16px" style={{ marginTop: '8px' }} />
        </div>

        <div style={{ marginTop: '24px' }}>
          <Skeleton width="100px" height="24px" />
          <Skeleton width="100%" height="16px" style={{ marginTop: '12px' }} />
          <Skeleton width="100%" height="16px" style={{ marginTop: '8px' }} />
          <Skeleton width="95%" height="16px" style={{ marginTop: '8px' }} />
          <Skeleton width="100%" height="16px" style={{ marginTop: '8px' }} />
        </div>
      </div>
    </div>
  )
}

// Meal Plan Item Skeleton
export function MealPlanItemSkeleton() {
  return (
    <div style={styles.mealItem}>
      <Skeleton width="100px" height="20px" />
      <div style={{ marginTop: '8px' }}>
        <Skeleton width="100%" height="16px" />
        <Skeleton width="80%" height="16px" style={{ marginTop: '4px' }} />
      </div>
    </div>
  )
}

// Meal Plan List Skeleton
export function MealPlanListSkeleton({ count = 5 }) {
  return (
    <div style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <MealPlanItemSkeleton key={index} />
      ))}
    </div>
  )
}

// Inline styles
const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  cardContent: {
    padding: '16px'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    padding: '16px'
  },
  detail: {
    background: 'white',
    minHeight: '100vh'
  },
  detailContent: {
    padding: '24px'
  },
  mealItem: {
    background: 'white',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '12px'
  },
  list: {
    padding: '16px'
  }
}

// CSS Animation (should be added to global CSS)
export const skeletonStyles = `
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton {
  animation: shimmer 1.5s infinite;
}
`
