import { Component } from 'react'

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Displays a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo)

    // Update state with error details
    this.setState({
      error,
      errorInfo
    })

    // Optionally: Send error to logging service (e.g., Sentry)
    // logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })

    // Optionally: Navigate to home
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  handleClearData = () => {
    // Clear all localStorage data
    if (window.confirm('모든 저장된 데이터를 삭제하고 앱을 초기화하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
      try {
        localStorage.clear()
        alert('데이터가 삭제되었습니다. 페이지를 새로고침합니다.')
        window.location.href = '/'
      } catch (error) {
        alert('데이터 삭제 중 오류가 발생했습니다.')
        console.error('Failed to clear localStorage:', error)
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>앗! 문제가 발생했어요</h1>
            <p style={styles.message}>
              일시적인 오류로 앱이 정상적으로 작동하지 않습니다.
            </p>

            {/* Development mode: Show error details */}
            {import.meta.env.DEV && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>오류 상세 정보 (개발자용)</summary>
                <pre style={styles.errorStack}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={styles.actions}>
              <button
                onClick={this.handleReset}
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                다시 시도
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{ ...styles.button, ...styles.secondaryButton }}
              >
                새로고침
              </button>
              <button
                onClick={this.handleClearData}
                style={{ ...styles.button, ...styles.dangerButton }}
              >
                데이터 초기화
              </button>
            </div>

            <p style={styles.helpText}>
              문제가 계속되면 브라우저 캐시를 삭제해보세요.
            </p>
          </div>
        </div>
      )
    }

    // No error, render children normally
    return this.props.children
  }
}

// Inline styles for error UI
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #FDFBF7 0%, #FFF3E0 100%)',
    padding: '20px',
    fontFamily: 'Pretendard, -apple-system, sans-serif'
  },
  content: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  icon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '12px'
  },
  message: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '24px'
  },
  details: {
    textAlign: 'left',
    marginBottom: '24px',
    background: '#f8f8f8',
    borderRadius: '8px',
    padding: '12px'
  },
  summary: {
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  errorStack: {
    fontSize: '12px',
    color: '#d32f2f',
    overflow: 'auto',
    maxHeight: '200px',
    background: 'white',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ffcdd2'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  button: {
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit'
  },
  primaryButton: {
    background: '#FF8A65',
    color: 'white'
  },
  secondaryButton: {
    background: '#f0f0f0',
    color: '#333'
  },
  dangerButton: {
    background: 'white',
    color: '#d32f2f',
    border: '2px solid #d32f2f'
  },
  helpText: {
    fontSize: '14px',
    color: '#999',
    marginTop: '12px'
  }
}

export default ErrorBoundary
