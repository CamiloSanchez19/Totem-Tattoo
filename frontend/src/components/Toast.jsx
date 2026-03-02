import '../styles/styles.css'

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  return (
    <div className={`app-toast app-toast-${type}`}>
      <div className="app-toast-content">
        <div className="app-toast-icon">
          {type === 'success' && <i className="fa fa-check-circle"></i>}
          {type === 'error' && <i className="fa fa-exclamation-circle"></i>}
          {type === 'warning' && <i className="fa fa-warning"></i>}
          {type === 'info' && <i className="fa fa-info-circle"></i>}
        </div>
        <div className="app-toast-message">
          {message}
        </div>
        <button onClick={onClose} className="app-toast-close">
          <i className="fa fa-times"></i>
        </button>
      </div>
      <div className="app-toast-progress" style={{ animation: `progress ${duration}ms linear forwards` }}></div>
    </div>
  )
}

export default Toast
