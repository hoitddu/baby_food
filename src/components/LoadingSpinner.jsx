/**
 * Loading Spinner Components
 * Provides various loading indicators
 */

// Default Spinner
export function LoadingSpinner({ size = 40, color = '#FF8A65', centered = false }) {
  const containerStyle = centered ? styles.centeredContainer : {}

  return (
    <div style={containerStyle}>
      <div
        style={{
          ...styles.spinner,
          width: size,
          height: size,
          borderColor: `${color}20`,
          borderTopColor: color
        }}
      />
    </div>
  )
}

// Full Page Loading Overlay
export function LoadingOverlay({ message = '로딩 중...' }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.overlayContent}>
        <LoadingSpinner size={60} />
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  )
}

// Inline Loading (for buttons, small areas)
export function InlineLoading({ text = '로딩 중...' }) {
  return (
    <div style={styles.inline}>
      <div style={styles.dots}>
        <span style={styles.dot}>•</span>
        <span style={{ ...styles.dot, animationDelay: '0.2s' }}>•</span>
        <span style={{ ...styles.dot, animationDelay: '0.4s' }}>•</span>
      </div>
      {text && <span style={styles.inlineText}>{text}</span>}
    </div>
  )
}

// Cute Baby Bottle Spinner
export function BabyBottleSpinner({ centered = false }) {
  const containerStyle = centered ? styles.centeredContainer : {}

  return (
    <div style={containerStyle}>
      <div style={styles.bottleContainer}>
        <div style={styles.bottle}>🍼</div>
        <p style={styles.bottleText}>준비 중...</p>
      </div>
    </div>
  )
}

const styles = {
  spinner: {
    border: '4px solid #f3f3f3',
    borderRadius: '50%',
    borderTop: '4px solid #FF8A65',
    animation: 'spin 1s linear infinite'
  },
  centeredContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    width: '100%'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(4px)'
  },
  overlayContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },
  message: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#666',
    margin: 0
  },
  inline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  dots: {
    display: 'flex',
    gap: '4px'
  },
  dot: {
    fontSize: '20px',
    color: '#FF8A65',
    animation: 'bounce 1.4s infinite ease-in-out both'
  },
  inlineText: {
    fontSize: '14px',
    color: '#666'
  },
  bottleContainer: {
    textAlign: 'center'
  },
  bottle: {
    fontSize: '64px',
    animation: 'shake 0.8s infinite'
  },
  bottleText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#666',
    marginTop: '8px'
  }
}

// CSS Animations (should be added to global CSS)
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
