import './confirmDialog.css'

function ConfirmDialog({
  open,
  title = '확인',
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  danger = false
}) {
  if (!open) return null

  return (
    <div className="confirm-dialog-overlay" role="dialog" aria-modal="true">
      <div className="confirm-dialog-card">
        <h3 className="confirm-dialog-title">{title}</h3>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button type="button" className="confirm-dialog-btn cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`confirm-dialog-btn ${danger ? 'danger' : 'confirm'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
