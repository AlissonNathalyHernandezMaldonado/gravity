import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    // Prueba simple de conexión
    const result = await query("SELECT 1 as test")

    return NextResponse.json({
      success: true,
      message: "Conexión a la base de datos exitosa",
      result,
    })
  } catch (error) {
    console.error("Error testing database connection:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error de conexión a la base de datos",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
