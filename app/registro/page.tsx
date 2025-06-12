"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion_usuario: "",
    correo_usuario: "",
    contraseña: "",
    confirmarContraseña: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validación básica en el cliente
    if (!formData.nombre || !formData.correo_usuario || !formData.contraseña) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (formData.contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          direccion_usuario: formData.direccion_usuario,
          correo_usuario: formData.correo_usuario,
          contraseña: formData.contraseña,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al registrarse")
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
        setError(error.message || "Error al registrarse")
      } else {
        setError("Error desconocido al registrarse")
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
                Crear Cuenta
              </span>
            </h1>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-400" />
                Únete a Gravity
              </CardTitle>
              <p className="text-gray-400">Crea tu cuenta para comenzar</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="nombre" className="text-gray-300">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <Label htmlFor="correo" className="text-gray-300">
                    Correo Electrónico *
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
                  <Label htmlFor="direccion" className="text-gray-300">
                    Dirección
                  </Label>
                  <Input
                    id="direccion"
                    type="text"
                    value={formData.direccion_usuario}
                    onChange={(e) => handleInputChange("direccion_usuario", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Tu dirección (opcional)"
                  />
                </div>

                <div>
                  <Label htmlFor="contraseña" className="text-gray-300">
                    Contraseña *
                  </Label>
                  <div className="relative">
                    <Input
                      id="contraseña"
                      type={showPassword ? "text" : "password"}
                      value={formData.contraseña}
                      onChange={(e) => handleInputChange("contraseña", e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600 text-white pr-10"
                      placeholder="Mínimo 6 caracteres"
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

                <div>
                  <Label htmlFor="confirmarContraseña" className="text-gray-300">
                    Confirmar Contraseña *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmarContraseña"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmarContraseña}
                      onChange={(e) => handleInputChange("confirmarContraseña", e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600 text-white pr-10"
                      placeholder="Repite tu contraseña"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full text-gray-400 hover:text-orange-400"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3"
                >
                  {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-500 text-xs">
                  Al registrarte, aceptas nuestros{" "}
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
