import { Component } from 'react'
import { safeRemoveItem } from '../utils/safeLocalStorage'
import './errorBoundary.css'

const APP_STORAGE_KEYS = [
  'baby_profile',
  'baby_preferences',
  'baby_favorites',
  'baby_favorites_v2',
  'baby_meal_plan',
  'recentSearches'
]

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })

    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  handleClearData = () => {
    if (window.confirm('모든 저장된 데이터를 삭제하고 앱을 초기화하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
      try {
        APP_STORAGE_KEYS.forEach((key) => safeRemoveItem(key))
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
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h1 className="error-boundary-title">문제가 발생했어요</h1>
            <p className="error-boundary-message">
              일시적인 오류로 앱이 정상적으로 동작하지 않습니다.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="error-boundary-details">
                <summary className="error-boundary-summary">오류 상세 정보 (개발자용)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button onClick={this.handleReset} className="error-boundary-button primary">
                다시 시도
              </button>
              <button onClick={() => window.location.reload()} className="error-boundary-button secondary">
                새로고침
              </button>
              <button onClick={this.handleClearData} className="error-boundary-button danger">
                데이터 초기화
              </button>
            </div>

            <p className="error-boundary-help">문제가 계속되면 브라우저 캐시를 삭제해보세요.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
