/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import { useToast } from '../hooks/useToast'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const { toasts, showToast, closeToast } = useToast()

  return (
    <ToastContext.Provider value={{ toasts, showToast, closeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext debe ser usado dentro de ToastProvider')
  }
  return context
}
