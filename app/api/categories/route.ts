import { NextResponse } from "next/server"
import { ProductsService } from "@/lib/products-service"

export async function GET() {
  try {
    const categories = await ProductsService.getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
  }
}
