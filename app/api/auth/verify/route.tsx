import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Token no proporcionado" }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remover "Bearer "
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ success: false, message: "Token inválido" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      },
    })
  } catch (error) {
    console.error("Error verifying token:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
