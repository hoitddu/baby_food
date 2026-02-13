import { CheckCircle, Lightbulb } from 'lucide-react'

function RecipeInstructionsSection({ recipe }) {
  const lines = (recipe.instructions || '')
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const parsedSteps = []
  let inferredTip = ''

  lines.forEach((line) => {
    const cleanLine = line.replace(/^\d+\.\s*/, '').trim()
    if (!cleanLine) return

    const tipMatch = cleanLine.match(/^(?:팁|Tip)\s*[:：]\s*(.+)$/i)
    if (tipMatch) {
      if (!inferredTip) inferredTip = tipMatch[1].trim()
      return
    }

    parsedSteps.push(cleanLine)
  })

  const instructions = parsedSteps.length > 0 ? parsedSteps : ['조리법 정보가 없습니다.']
  const tipText = (recipe.tip || inferredTip || '').trim()

  return (
    <div className="recipe-section">
      <h3 className="recipe-section-title">
        <CheckCircle size={22} /> 조리 방법
      </h3>
      <div className="recipe-instructions-list">
        {instructions.map((step, idx) => {
          const cleanStep = step.trim()
          if (!cleanStep) return null

          return (
            <div key={idx} className="recipe-step-card">
              <div className="recipe-step-number">{idx + 1}</div>
              <div className="recipe-step-main">
                <p className="recipe-step-text">{cleanStep}</p>
              </div>
            </div>
          )
        })}
      </div>

      {tipText && (
        <div className="recipe-tip-highlight" role="note" aria-label="요리 팁">
          <div className="recipe-tip-highlight-label">
            <Lightbulb size={18} />
            Tip
          </div>
          <p className="recipe-tip-highlight-text">{tipText}</p>
        </div>
      )}
    </div>
  )
}

export default RecipeInstructionsSection