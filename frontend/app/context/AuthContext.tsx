'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

interface User {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'ADMIN'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/auth/me')
        setUser(response.data.data)
      } catch {
        localStorage.removeItem('accessToken')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    const { user, accessToken } = response.data.data
    localStorage.setItem('accessToken', accessToken)
    setUser(user)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('accessToken')
      setUser(null)
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === 'ADMIN',
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}