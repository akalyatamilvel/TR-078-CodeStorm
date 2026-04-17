import React, { createContext, useContext, useState, useCallback } from 'react'
import type { AuthUser, UserRole } from '../types'

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, _password: string, role: UserRole) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('court_user')
    return stored ? (JSON.parse(stored) as AuthUser) : null
  })

  const login = useCallback((email: string, _password: string, role: UserRole) => {
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    const authUser: AuthUser = { email, role, name }
    setUser(authUser)
    localStorage.setItem('court_user', JSON.stringify(authUser))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('court_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
