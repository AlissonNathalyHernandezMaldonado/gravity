"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Shield, Edit, Save, X, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Usuario } from "@/lib/auth-service"

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [userRole, setUserRole] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [editData, setEditData] = useState<Partial<Usuario>>({})
  const router = useRouter()

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("usuario")
          router.push("/login")
          return
        }
        throw new Error("Error al cargar perfil")
      }

      const data = await response.json()
      setUsuario(data.usuario)
      setEditData(data.usuario)

      // Determinar el rol del usuario
      if (data.usuario.id_rol === 1) {
        setUserRole("Administrador")
      } else {
        setUserRole("Usuario")
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      setError("Error al cargar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError("")

      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar perfil")
      }

      const data = await response.json()
      setUsuario(data.usuario)
      setIsEditing(false)

      // Actualizar localStorage
      localStorage.setItem("usuario", JSON.stringify(data.usuario))
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Error al actualizar el perfil")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditData(usuario || {})
    setIsEditing(false)
    setError("")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    router.push("/login")
  }

  const handleInputChange = (field: keyof Usuario, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Error al cargar el perfil</p>
          <Button onClick={() => router.push("/login")} className="mt-4">
            Volver al login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Mi Perfil
                </span>
              </h1>
              <p className="text-gray-400">Gestiona tu información personal</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Personal */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-400" />
                  Información Personal
                </CardTitle>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-gray-300">Nombre Completo</Label>
                    {isEditing ? (
                      <Input
                        value={editData.nombre || ""}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Ingresa tu nombre completo"
                      />
                    ) : (
                      <p className="text-white bg-slate-700 px-3 py-2 rounded-md">{usuario.nombre}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-300">Correo Electrónico</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editData.correo_usuario || ""}
                        onChange={(e) => handleInputChange("correo_usuario", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="tu@email.com"
                      />
                    ) : (
                      <p className="text-white bg-slate-700 px-3 py-2 rounded-md">{usuario.correo_usuario}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-300">Dirección</Label>
                    {isEditing ? (
                      <Input
                        value={editData.direccion_usuario || ""}
                        onChange={(e) => handleInputChange("direccion_usuario", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Tu dirección completa"
                      />
                    ) : (
                      <p className="text-white bg-slate-700 px-3 py-2 rounded-md">
                        {usuario.direccion_usuario || "No especificada"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información de la cuenta */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  Información de la Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">ID de Usuario</Label>
                  <p className="text-white bg-slate-700 px-3 py-2 rounded-md">#{usuario.id_usuario}</p>
                </div>

                <div>
                  <Label className="text-gray-300">Rol</Label>
                  <div className="flex items-center gap-2">
                    <p className="text-white bg-slate-700 px-3 py-2 rounded-md flex-1">{userRole}</p>
                    {usuario.id_rol === 1 && (
                      <div className="w-3 h-3 bg-green-500 rounded-full" title="Administrador"></div>
                    )}
                  </div>
                </div>

                {usuario.id_rol === 1 && (
                  <div className="pt-4">
                    <Button
                      onClick={() => router.push("/admin")}
                      className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                    >
                      Ir al Panel Admin
                    </Button>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    className="w-full border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                  >
                    Volver al Inicio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
