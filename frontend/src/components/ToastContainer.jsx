import Toast from './Toast'
import { useToastContext } from '../context/ToastContext'
import '../styles/styles.css'

function ToastContainer() {
  const { toasts, closeToast } = useToastContext()

  return (
    <div className="app-toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => closeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default ToastContainer
