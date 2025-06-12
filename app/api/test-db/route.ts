import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    // Probar conexión simple
    const result = await executeQuery("SELECT 1 as test")

    return NextResponse.json({
      status: "success",
      message: "Conexión a base de datos exitosa",
      result: result,
    })
  } catch (error) {
    console.error("Database connection error:", error)

    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Error desconocido",
        details: "Verifica la configuración de la base de datos en .env.local",
      },
      { status: 500 },
    )
  }
}
