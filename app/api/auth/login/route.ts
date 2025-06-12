import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { correo_usuario, contraseña } = body

    // Validación básica
    if (!correo_usuario || !contraseña) {
      return NextResponse.json({ message: "Correo y contraseña son requeridos" }, { status: 400 })
    }

    // Intentar login
    const result = await AuthService.login({ correo_usuario, contraseña })

    return NextResponse.json({
      message: "Inicio de sesión exitoso",
      usuario: result.usuario,
      token: result.token,
    })
  } catch (error) {
    console.error("Login error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 })
    }

    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
