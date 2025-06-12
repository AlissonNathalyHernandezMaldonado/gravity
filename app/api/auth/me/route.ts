import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth-service"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Token de autorización requerido" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = AuthService.verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 })
    }

    // Obtener información actualizada del usuario
    const usuario = await AuthService.getUserById(decoded.id_usuario)

    if (!usuario) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ usuario })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Token de autorización requerido" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = AuthService.verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 })
    }

    const body = await request.json()

    // Actualizar usuario
    const updatedUser = await AuthService.updateUser(decoded.id_usuario, body)

    return NextResponse.json({
      message: "Perfil actualizado exitosamente",
      usuario: updatedUser,
    })
  } catch (error) {
    console.error("Profile update error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
