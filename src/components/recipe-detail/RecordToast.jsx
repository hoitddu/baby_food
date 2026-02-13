import { Check } from 'lucide-react'

function RecordToast({ show }) {
  if (!show) return null

  return (
    <div className="recipe-record-toast">
      <Check size={20} color="#69F0AE" />
      <span>식단에 기록했어요!</span>
    </div>
  )
}

export default RecordToast
