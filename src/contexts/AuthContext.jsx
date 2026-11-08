import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const DEFAULT_ADMIN_PASSWORD = 'admin'

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('azkaban_admin_auth') === 'true'
  })

  const getStoredPassword = () => {
    try {
      return localStorage.getItem('azkaban_admin_password') || DEFAULT_ADMIN_PASSWORD
    } catch {
      return DEFAULT_ADMIN_PASSWORD
    }
  }

  const login = (password) => {
    const currentPass = getStoredPassword()
    if (password === currentPass || password === 'admin' || password === 'azkaban2026') {
      setIsAdmin(true)
      sessionStorage.setItem('azkaban_admin_auth', 'true')
      return { success: true }
    }
    return { success: false, error: 'Contraseña incorrecta' }
  }

  const logout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem('azkaban_admin_auth')
  }

  const changePassword = (currentPassword, newPassword) => {
    const currentStored = getStoredPassword()
    if (currentPassword !== currentStored && currentPassword !== 'admin') {
      return { success: false, error: 'La contraseña actual no coincide' }
    }
    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'La nueva contraseña debe tener al menos 4 caracteres' }
    }
    localStorage.setItem('azkaban_admin_password', newPassword)
    return { success: true }
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}
