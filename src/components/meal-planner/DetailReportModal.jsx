import { X, Award, LayoutGrid, PieChart } from 'lucide-react'

function DetailReportModal({ show, onClose, analysis }) {
  if (!show) return null

  return (
    <div className="planner-detail-overlay">
      <div className="planner-detail-body">
        <div className="planner-detail-head">
          <h2 className="planner-detail-title">상세 분석 리포트</h2>
          <button onClick={onClose} className="planner-detail-close">
            <X color="#5D4037" />
          </button>
        </div>

        <div className="planner-detail-section">
          <h3 className="planner-detail-heading iron">
            <Award size={24} /> 철분 섭취 진단
          </h3>
          <div className="planner-detail-card center">
            <p className="planner-detail-muted mb-10">소고기 섭취 횟수</p>
            <div className="planner-detail-big-number">
              {analysis.beefCount}<span className="planner-detail-unit">회</span>
            </div>
            <div className="planner-detail-progress-track">
              <div className="planner-detail-progress-fill" style={{ width: `${analysis.beefScore}%` }} />
            </div>
            <p className="planner-detail-note">
              {analysis.beefScore >= 100 ? '좋아요! 철분 섭취가 충분해요.' : '조금만 더 철분 식단을 채워주세요.'}
            </p>
          </div>
        </div>

        <div className="planner-detail-section">
          <h3 className="planner-detail-heading variety">
            <LayoutGrid size={24} /> 재료 다양성
          </h3>
          <div className="planner-detail-card">
            <p className="planner-detail-muted mb-15">
              총 <b>{analysis.uniqueIngredients.length}가지</b> 재료를 먹었어요
            </p>
            <div className="planner-tag-list">
              {analysis.uniqueIngredients.length > 0
                ? analysis.uniqueIngredients.map((ing, i) => (
                  <span key={i} className="planner-tag">{ing}</span>
                ))
                : <div className="planner-no-record">아직 기록이 없어요</div>}
            </div>
          </div>
        </div>

        <div>
          <h3 className="planner-detail-heading balance">
            <PieChart size={24} /> 영양 밸런스
          </h3>
          <div className="planner-detail-card">
            <div className="planner-balance-row divider">
              <span>단백질(고기/콩류)</span>
              <b>{analysis.balance.protein}회</b>
            </div>
            <div className="planner-balance-row divider">
              <span>채소(비타민)</span>
              <b>{analysis.balance.veggies}회</b>
            </div>
            <div className="planner-balance-row">
              <span>탄수화물(에너지)</span>
              <b>{analysis.balance.carbs}회</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailReportModal
