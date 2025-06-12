"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    correo_usuario: "",
    contraseña: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validación básica en el cliente
    if (!formData.correo_usuario || !formData.contraseña) {
      setError("Por favor completa todos los campos")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión")
      }

      // Guardar el token en localStorage
      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      // Guardar la información del usuario si viene en la respuesta
      if (data.usuario) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario))
      }

      // Redirigir al perfil
      router.push("/perfil")
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Credenciales inválidas")
      } else {
        setError("Error desconocido al iniciar sesión")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Iniciar Sesión
              </span>
            </h1>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5 text-orange-400" />
                Bienvenido de vuelta
              </CardTitle>
              <p className="text-gray-400">Ingresa tus credenciales para continuar</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="correo" className="text-gray-300">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="correo"
                    type="email"
                    value={formData.correo_usuario}
                    onChange={(e) => handleInputChange("correo_usuario", e.target.value)}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contraseña" className="text-gray-300">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="contraseña"
                      type={showPassword ? "text" : "password"}
                      value={formData.contraseña}
                      onChange={(e) => handleInputChange("contraseña", e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600 text-white pr-10"
                      placeholder="Tu contraseña"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full text-gray-400 hover:text-orange-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-gray-300">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Recordarme</span>
                  </label>
                  <Link href="/recuperar-password" className="text-orange-400 hover:text-orange-300 text-sm">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3"
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  ¿No tienes cuenta?{" "}
                  <Link href="/registro" className="text-orange-400 hover:text-orange-300 font-medium">
                    Regístrate aquí
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-500 text-xs">
                  Al iniciar sesión, aceptas nuestros{" "}
                  <Link href="/terminos" className="text-orange-400 hover:text-orange-300">
                    Términos de Servicio
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
