import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import type { ProductWithDetails, ProductDetail } from "@/lib/products-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    if (!productId || isNaN(Number(productId))) {
      return NextResponse.json({ error: "ID de producto inválido" }, { status: 400 })
    }

    // Obtener información del producto
    const productSql = `
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
      WHERE p.id_producto = ?
      LIMIT 1
    `

    const productos = (await query(productSql, [productId])) as ProductWithDetails[]

    if (productos.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    const producto = productos[0]

    // Obtener detalles del producto
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
      ORDER BY talla, color
    `

    const detalles = (await query(detallesSql, [productId])) as ProductDetail[]

    const productoCompleto = {
      ...producto,
      detalles,
    }

    return NextResponse.json(productoCompleto)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
