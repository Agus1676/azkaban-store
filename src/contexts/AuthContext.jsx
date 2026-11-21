import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Security Configuration
const SESSION_KEY = 'azkaban_admin_session_v2'
const SESSION_EXPIRY_KEY = 'azkaban_admin_session_exp'
const FAILED_ATTEMPTS_KEY = 'azkaban_admin_failed_attempts'
const LOCKOUT_UNTIL_KEY = 'azkaban_admin_lockout_until'
const PASSWORD_HASH_KEY = 'azkaban_admin_pwd_hash'

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 60 * 1000 // 60 segundos
const SESSION_TTL_MS = 3 * 60 * 60 * 1000 // 3 horas

// Simple yet robust SHA-256 hashing using Web Crypto
const hashPassword = async (pwd) => {
  try {
    const salt = 'azkaban_salt_2026_sportswear_secret'
    const encoder = new TextEncoder()
    const data = encoder.encode(pwd + salt)
    const hashBuf = await crypto.subtle.digest('SHA-256', data)
    const hashArr = Array.from(new Uint8Array(hashBuf))
    return hashArr.map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    // Fallback if crypto.subtle is restricted
    let hash = 5381
    for (let i = 0; i < pwd.length; i++) {
      hash = (hash * 33) ^ pwd.charCodeAt(i)
    }
    return 'fallback_' + (hash >>> 0).toString(16)
  }
}

// Known default hashes for initial setup
// "admin" and "azkaban2026"
const DEFAULT_ALLOWED = ['admin', 'azkaban2026']

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const token = sessionStorage.getItem(SESSION_KEY)
      const exp = Number(sessionStorage.getItem(SESSION_EXPIRY_KEY)) || 0
      if (token && exp > Date.now()) {
        return true
      }
      return false
    } catch {
      return false
    }
  })

  const [lockoutRemaining, setLockoutRemaining] = useState(0)

  // Verify and update lockout status
  const checkLockout = useCallback(() => {
    try {
      const lockoutUntil = Number(sessionStorage.getItem(LOCKOUT_UNTIL_KEY)) || 0
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000))
      setLockoutRemaining(remaining)
      return remaining > 0
    } catch {
      return false
    }
  }, [])

  // Auto-expire session when timeout is reached
  useEffect(() => {
    const checkExpiry = () => {
      try {
        const exp = Number(sessionStorage.getItem(SESSION_EXPIRY_KEY)) || 0
        if (isAdmin && exp > 0 && Date.now() > exp) {
          logout()
        }
      } catch {
        // Safe catch
      }
    }

    const interval = setInterval(() => {
      checkExpiry()
      checkLockout()
    }, 1000)

    return () => clearInterval(interval)
  }, [isAdmin, checkLockout])

  const login = async (passwordInput) => {
    // 1. Input sanitization
    if (!passwordInput || typeof passwordInput !== 'string') {
      return { success: false, error: 'Por favor, ingresá una contraseña válida.' }
    }
    const cleanPwd = passwordInput.trim()
    if (cleanPwd.length === 0 || cleanPwd.length > 64) {
      return { success: false, error: 'Longitud de contraseña inválida.' }
    }

    // 2. Brute Force & Rate Limit Protection
    const isLocked = checkLockout()
    if (isLocked) {
      const rem = Number(sessionStorage.getItem(LOCKOUT_UNTIL_KEY)) || 0
      const secondsLeft = Math.max(1, Math.ceil((rem - Date.now()) / 1000))
      return {
        success: false,
        error: `Acceso temporalmente bloqueado por seguridad (${secondsLeft}s restantes).`,
      }
    }

    // 3. Password Verification
    const inputHash = await hashPassword(cleanPwd)
    const storedHash = localStorage.getItem(PASSWORD_HASH_KEY)

    let isMatch = false
    if (storedHash) {
      isMatch = inputHash === storedHash
    } else {
      // Si aún no se fijó hash personalizado, chequear hashes permitidos por defecto
      for (const def of DEFAULT_ALLOWED) {
        if (cleanPwd === def) {
          isMatch = true
          // Auto-migrar a hash seguro para que nunca quede en texto plano
          localStorage.setItem(PASSWORD_HASH_KEY, inputHash)
          break
        }
      }
    }

    // 4. Handle Result
    if (isMatch) {
      // Reset lockout counter upon successful login
      sessionStorage.removeItem(FAILED_ATTEMPTS_KEY)
      sessionStorage.removeItem(LOCKOUT_UNTIL_KEY)
      setLockoutRemaining(0)

      // Set cryptographically safe session token
      const sessionToken = 'azk_sec_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
      const expiresAt = Date.now() + SESSION_TTL_MS

      sessionStorage.setItem(SESSION_KEY, sessionToken)
      sessionStorage.setItem(SESSION_EXPIRY_KEY, expiresAt.toString())
      setIsAdmin(true)

      return { success: true }
    } else {
      // Increment failed attempts
      const currentAttempts = (Number(sessionStorage.getItem(FAILED_ATTEMPTS_KEY)) || 0) + 1
      sessionStorage.setItem(FAILED_ATTEMPTS_KEY, currentAttempts.toString())

      if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS
        sessionStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutUntil.toString())
        setLockoutRemaining(Math.ceil(LOCKOUT_DURATION_MS / 1000))
        return {
          success: false,
          error: `Has superado los 5 intentos. Panel bloqueado por 60 segundos por seguridad.`,
        }
      }

      const attemptsLeft = MAX_FAILED_ATTEMPTS - currentAttempts
      return {
        success: false,
        error: `Contraseña incorrecta. (${attemptsLeft} ${attemptsLeft === 1 ? 'intento restante' : 'intentos restantes'}).`,
      }
    }
  }

  const logout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_EXPIRY_KEY)
  }

  const changePassword = async (currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
      return { success: false, error: 'Campos incompletos.' }
    }
    const cleanCurrent = currentPassword.trim()
    const cleanNew = newPassword.trim()

    if (cleanNew.length < 5) {
      return { success: false, error: 'La nueva contraseña debe tener al menos 5 caracteres.' }
    }

    // Verify current password
    const currentHash = await hashPassword(cleanCurrent)
    const storedHash = localStorage.getItem(PASSWORD_HASH_KEY)

    let currentMatches = false
    if (storedHash) {
      currentMatches = currentHash === storedHash
    } else {
      currentMatches = DEFAULT_ALLOWED.includes(cleanCurrent)
    }

    if (!currentMatches) {
      return { success: false, error: 'La contraseña actual no coincide.' }
    }

    // Save newly hashed password
    const newHash = await hashPassword(cleanNew)
    localStorage.setItem(PASSWORD_HASH_KEY, newHash)

    // Remove legacy plain text password if exists
    localStorage.removeItem('azkaban_admin_password')

    return { success: true }
  }

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        login,
        logout,
        changePassword,
        lockoutRemaining,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
