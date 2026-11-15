import { useEffect } from 'react'
import {
  FiAlertTriangle,
  FiTrash2,
  FiAlertCircle,
  FiInfo,
  FiX,
  FiCheck,
} from 'react-icons/fi'
import './ConfirmModal.css'

export default function ConfirmModal({
  isOpen,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Lanjutkan',
  cancelText = 'Batal',
  type = 'danger',
  onConfirm,
  onCancel,
}) {
  // Listen to Escape key to dismiss
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const icon =
    type === 'danger' ? (
      <FiTrash2 className="confirm-icon text-danger" />
    ) : type === 'warning' ? (
      <FiAlertTriangle className="confirm-icon text-warning" />
    ) : (
      <FiInfo className="confirm-icon text-blue" />
    )

  return (
    <div
      className="confirm-backdrop"
      onClick={onCancel}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      <div className="confirm-dialog-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="confirm-close-icon-btn"
          onClick={onCancel}
          aria-label="Tutup dialog"
          title="Tutup dialog"
        >
          <FiX />
        </button>

        <div className="confirm-dialog-content">
          <div className={`confirm-icon-badge confirm-badge-${type}`}>
            {icon}
          </div>

          <div className="confirm-text-block">
            <h3 id="confirm-dialog-title" className="confirm-title">
              {title}
            </h3>
            <p id="confirm-dialog-desc" className="confirm-message">
              {message}
            </p>
          </div>
        </div>

        <div className="confirm-actions-row">
          <button
            type="button"
            className="btn-confirm-cancel"
            onClick={onCancel}
            autoFocus
          >
            <span>{cancelText}</span>
          </button>

          <button
            type="button"
            className={`btn-confirm-submit btn-submit-${type}`}
            onClick={onConfirm}
          >
            {type === 'danger' ? (
              <FiTrash2 className="btn-icon" />
            ) : (
              <FiCheck className="btn-icon" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

