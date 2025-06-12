import { NextResponse } from "next/server"
import { ProductsService } from "@/lib/products-service"

export async function GET() {
  try {
    const stats = await ProductsService.getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
