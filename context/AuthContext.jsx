"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/authService"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setUser(null)
        return
      }

      try {
        const userData = await authService.verifyToken(token)
        setUser(userData.data)
      } catch (verifyError) {
        const refresh = await authService.refreshToken(token)
        if (refresh.success) {
          localStorage.setItem("token", refresh.token)
          const verifiedUser = await authService.verifyToken(refresh.token)
          setUser(verifiedUser)
        } else {
          localStorage.removeItem("token")
          setUser(null)
          toast.error("Tu sesión ha expirado")
        }
      }
    } catch (error) {
      console.error("Error al verificar o refrescar token:", error)
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await authService.login(credentials.email, credentials.clave)

      if (response.success) {
        localStorage.setItem("token", response.data.token)
        setUser(response.data.user)
        toast.success("¡Bienvenido!")
        return { success: true, user: response.data.user }
      } else {
        toast.error(response.error || "Error al iniciar sesión")
        return { success: false, message: response.error }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Error de conexión"
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)

      if (response.success) {
        toast.success("Registro exitoso. Revisa tu correo para activar tu cuenta.")
        return { success: true }
      } else {
        toast.error(response.message || "Error en el registro")
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Error de conexión"
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    toast.success("Sesión cerrada")
  }

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
