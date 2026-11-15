import { createContext, useContext, useState, useCallback, useRef } from 'react'
import ToastContainer from '../components/ToastContainer'
import ConfirmModal from '../components/ConfirmModal'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  // Toasts list: [{ id, type, title, message, duration }]
  const [toasts, setToasts] = useState([])

  // Confirm dialog state: { isOpen, title, message, confirmText, cancelText, type }
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Konfirmasi',
    cancelText: 'Batal',
    type: 'danger',
  })

  // Ref to store the resolve function of the current confirm promise
  const confirmResolveRef = useRef(null)

  // ── TOAST METHODS ──
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({ type = 'info', title = '', message = '', duration = 4000 }) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 6)
      const newToast = { id, type, title, message, duration }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    [removeToast]
  )

  const toast = {
    success: (message, title = 'Berhasil') =>
      showToast({ type: 'success', title, message }),
    error: (message, title = 'Terjadi Kendala') =>
      showToast({ type: 'error', title, message }),
    warning: (message, title = 'Perhatian') =>
      showToast({ type: 'warning', title, message }),
    info: (message, title = 'Informasi') =>
      showToast({ type: 'info', title, message }),
  }

  // ── CONFIRM MODAL METHOD ──
  const confirm = useCallback(
    ({
      title = 'Konfirmasi Tindakan',
      message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
      confirmText = 'Lanjutkan',
      cancelText = 'Batal',
      type = 'danger',
    }) => {
      return new Promise((resolve) => {
        confirmResolveRef.current = resolve
        setConfirmState({
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          type,
        })
      })
    },
    []
  )

  const handleConfirmAction = useCallback(() => {
    if (confirmResolveRef.current) {
      confirmResolveRef.current(true)
      confirmResolveRef.current = null
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const handleCancelAction = useCallback(() => {
    if (confirmResolveRef.current) {
      confirmResolveRef.current(false)
      confirmResolveRef.current = null
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  return (
    <NotificationContext.Provider value={{ showToast, toast, confirm }}>
      {children}

      {/* RENDER TOAST STACK */}
      <ToastContainer toasts={toasts} onCloseToast={removeToast} />

      {/* RENDER CONFIRM MODAL */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        type={confirmState.type}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification harus digunakan di dalam NotificationProvider')
  }
  return context
}

export function useToast() {
  const { toast } = useNotification()
  return toast
}

export function useConfirm() {
  const { confirm } = useNotification()
  return confirm
}

