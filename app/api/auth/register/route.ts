import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, direccion_usuario, correo_usuario, contraseña } = body

    // Validación básica
    if (!nombre || !correo_usuario || !contraseña) {
      return NextResponse.json({ message: "Nombre, correo y contraseña son requeridos" }, { status: 400 })
    }

    // Intentar registro
    const result = await AuthService.register({
      nombre,
      direccion_usuario: direccion_usuario || "",
      correo_usuario,
      contraseña,
    })

    return NextResponse.json(
      {
        message: "Registro exitoso",
        usuario: result.usuario,
        token: result.token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
