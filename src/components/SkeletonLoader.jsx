/**
 * Skeleton Loader Components
 * Provides loading placeholders for content
 */

import './skeletonLoader.css'

export function Skeleton({ width = '100%', height = '20px', borderRadius = '8px', className = '', style }) {
  return (
    <div
      className={`skeleton-base ${className}`.trim()}
      style={{ width, height, borderRadius, ...style }}
    />
  )
}

export function RecipeCardSkeleton() {
  return (
    <div className="skeleton-card">
      <Skeleton height="180px" borderRadius="12px" />
      <div className="skeleton-card-content">
        <Skeleton width="70%" height="24px" />
        <Skeleton width="100%" height="16px" className="skeleton-mt-8" />
        <Skeleton width="90%" height="16px" className="skeleton-mt-4" />
        <div className="skeleton-card-footer">
          <Skeleton width="80px" height="28px" borderRadius="20px" />
          <Skeleton width="32px" height="32px" borderRadius="50%" />
        </div>
      </div>
    </div>
  )
}

export function RecipeListSkeleton({ count = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function RecipeDetailSkeleton() {
  return (
    <div className="skeleton-detail">
      <Skeleton height="300px" borderRadius="0" />
      <div className="skeleton-detail-content">
        <Skeleton width="80%" height="32px" />
        <Skeleton width="120px" height="24px" borderRadius="20px" className="skeleton-mt-12" />

        <div className="skeleton-section">
          <Skeleton width="100px" height="24px" />
          <Skeleton width="100%" height="16px" className="skeleton-mt-12" />
          <Skeleton width="95%" height="16px" className="skeleton-mt-8" />
          <Skeleton width="90%" height="16px" className="skeleton-mt-8" />
        </div>

        <div className="skeleton-section">
          <Skeleton width="100px" height="24px" />
          <Skeleton width="100%" height="16px" className="skeleton-mt-12" />
          <Skeleton width="100%" height="16px" className="skeleton-mt-8" />
          <Skeleton width="95%" height="16px" className="skeleton-mt-8" />
          <Skeleton width="100%" height="16px" className="skeleton-mt-8" />
        </div>
      </div>
    </div>
  )
}

export function MealPlanItemSkeleton() {
  return (
    <div className="skeleton-meal-item">
      <Skeleton width="100px" height="20px" />
      <div className="skeleton-mt-8">
        <Skeleton width="100%" height="16px" />
        <Skeleton width="80%" height="16px" className="skeleton-mt-4" />
      </div>
    </div>
  )
}

export function MealPlanListSkeleton({ count = 5 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, index) => (
        <MealPlanItemSkeleton key={index} />
      ))}
    </div>
  )
}

export const skeletonStyles = `
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-base {
  animation: shimmer 1.5s infinite;
}
`
