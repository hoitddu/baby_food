/**
 * Loading Spinner Components
 * Provides various loading indicators
 */

import './loadingSpinner.css'

function sizeClass(size) {
  return size >= 60 ? 'lg' : ''
}

export function LoadingSpinner({ size = 40, centered = false }) {
  return (
    <div className={centered ? 'loading-centered' : ''}>
      <div className={`loading-spinner ${sizeClass(size)}`.trim()} />
    </div>
  )
}

export function LoadingOverlay({ message = '로딩 중...' }) {
  return (
    <div className="loading-overlay">
      <div className="loading-overlay-content">
        <LoadingSpinner size={60} />
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  )
}

export function InlineLoading({ text = '로딩 중...' }) {
  return (
    <div className="loading-inline">
      <div className="loading-dots">
        <span className="loading-dot">•</span>
        <span className="loading-dot delay-1">•</span>
        <span className="loading-dot delay-2">•</span>
      </div>
      {text && <span className="loading-inline-text">{text}</span>}
    </div>
  )
}

export function BabyBottleSpinner({ centered = false }) {
  return (
    <div className={centered ? 'loading-centered' : ''}>
      <div className="loading-bottle-wrap">
        <div className="loading-bottle">🍼</div>
        <p className="loading-bottle-text">준비 중...</p>
      </div>
    </div>
  )
}

export const loadingStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}
`

export default LoadingSpinner
