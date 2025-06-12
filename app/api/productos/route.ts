import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import type { ProductWithDetails, ProductDetail } from "@/lib/products-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get("q")
    const categoria = searchParams.get("categoria")

    // Construir la consulta SQL base
    let sql = `
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.descripcion_producto,
        p.precio_producto,
        p.id_categoria,
        p.img,
        c.nombre_categoria as categoria
      FROM producto p
      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE 1=1
    `

    const params: any[] = []

    // Agregar filtros
    if (searchTerm) {
      sql += ` AND (p.nombre_producto LIKE ? OR p.descripcion_producto LIKE ?)`
      params.push(`%${searchTerm}%`, `%${searchTerm}%`)
    }

    if (categoria && categoria !== "all") {
      sql += ` AND p.id_categoria = ?`
      params.push(categoria)
    }

    sql += ` ORDER BY p.nombre_producto ASC`

    // Ejecutar consulta principal
    const productos = (await query(sql, params)) as ProductWithDetails[]

    // Obtener detalles para cada producto
    const productosConDetalles = await Promise.all(
      productos.map(async (producto) => {
        const detallesSql = `
          SELECT 
            id_detalle_producto,
            stock,
            marca,
            talla,
            color,
            id_producto
          FROM detalle_producto 
          WHERE id_producto = ?
        `

        const detalles = (await query(detallesSql, [producto.id_producto])) as ProductDetail[]

        return {
          ...producto,
          detalles,
        }
      }),
    )

    return NextResponse.json(productosConDetalles)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
