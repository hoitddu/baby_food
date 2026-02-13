import { ChevronRight, RotateCcw } from 'lucide-react'
import './settings.css'

function Settings({ preferences, setPreferences, resetProfile }) {
  const togglePref = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const allergies = [
    { key: 'dairy', label: 'Dairy', icon: '🥛', desc: '우유, 치즈, 요거트' },
    { key: 'eggs', label: 'Eggs', icon: '🥚', desc: '계란, 난황, 난백' },
    { key: 'peanuts', label: 'Peanuts', icon: '🥜', desc: '땅콩' },
    { key: 'treeNuts', label: 'Tree Nuts', icon: '🌰', desc: '호두, 아몬드, 잣' },
    { key: 'wheat', label: 'Wheat', icon: '🌾', desc: '밀가루, 빵, 국수' },
    { key: 'soy', label: 'Soy', icon: '🫘', desc: '콩류, 간장, 두유' },
    { key: 'fish', label: 'Fish', icon: '🐟', desc: '생선류' }
  ]

  return (
    <div className="page-content settings-page">
      <header className="app-header">
        <h2>알레르기 설정</h2>
        <p className="settings-header-desc">우리 아기 맞춤 식단을 위해 선택해주세요.</p>
      </header>

      <div className="section settings-section">
        <h3 className="settings-section-title">Food Allergies (제외할 재료)</h3>

        <div className="settings-card">
          {allergies.map((item, index) => {
            const active = !!preferences[item.key]
            const withDivider = index < allergies.length - 1

            return (
              <div key={item.key} className={`settings-item ${withDivider ? 'with-divider' : ''}`}>
                <div className="settings-item-main">
                  <span className="settings-item-label">
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="settings-item-desc">{item.desc} 포함</span>
                </div>

                <div onClick={() => togglePref(item.key)} className={`settings-toggle ${active ? 'active' : ''}`}>
                  <div className={`settings-toggle-knob ${active ? 'active' : ''}`} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="section settings-section settings-reset-section">
        <div className="settings-reset-card">
          <div className="settings-reset-head">
            <h3 className="settings-reset-title">온보딩 다시 시작</h3>
            <span className="settings-reset-badge">초기화</span>
          </div>
          <p className="settings-reset-desc">
            아기 이름과 알레르기 설정을 초기화하고 첫 화면부터 다시 시작해요.
          </p>
          <button
            type="button"
            className="settings-reset-btn"
            onClick={resetProfile}
          >
            <span className="settings-reset-btn-label">
              <RotateCcw size={16} />
              온보딩 다시 시작하기
            </span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
