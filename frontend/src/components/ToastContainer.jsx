import {
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
} from 'react-icons/fi'
import './Toast.css'

export default function ToastContainer({ toasts, onCloseToast }) {
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="toast-portal-container" aria-live="polite">
      {toasts.map((item) => {
        const icon =
          item.type === 'success' ? (
            <FiCheckCircle className="toast-lead-icon text-success" />
          ) : item.type === 'error' ? (
            <FiAlertCircle className="toast-lead-icon text-danger" />
          ) : item.type === 'warning' ? (
            <FiAlertTriangle className="toast-lead-icon text-warning" />
          ) : (
            <FiInfo className="toast-lead-icon text-blue" />
          )

        return (
          <div
            key={item.id}
            className={`toast-item-card toast-${item.type}`}
            role="status"
          >
            <div className="toast-icon-circle">{icon}</div>
            <div className="toast-text-wrap">
              {item.title && <h5 className="toast-title-text">{item.title}</h5>}
              <p className="toast-message-text">{item.message}</p>
            </div>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => onCloseToast(item.id)}
              aria-label="Tutup notifikasi"
            >
              <FiX />
            </button>
          </div>
        )
      })}
    </div>
  )
}

