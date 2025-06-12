import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import type { Category } from "@/lib/products-service"

export async function GET() {
  try {
    const sql = `
      SELECT id_categoria, nombre_categoria 
      FROM categoria 
      ORDER BY nombre_categoria ASC
    `

    const categorias = (await query(sql)) as Category[]

    return NextResponse.json(categorias)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
