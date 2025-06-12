import { type NextRequest, NextResponse } from "next/server"
import { ProductsService } from "@/lib/products-service"

// GET - Obtener producto por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await ProductsService.getProduct(Number(params.id))
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 })
  }
}

// PUT - Actualizar producto
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const { product, details } = data

    // Actualizar el producto
    const updatedProduct = await ProductsService.updateProduct({
      ...product,
      id_producto: Number(params.id),
    })

    // Actualizar o crear detalles
    if (details && details.length > 0) {
      for (const detail of details) {
        if (detail.id_detalle_producto && !detail.isNew) {
          // Actualizar detalle existente
          await ProductsService.updateProductDetail(detail.id_detalle_producto, {
            stock: detail.stock,
            marca: detail.marca,
            talla: detail.talla,
            color: detail.color,
          })
        } else if (detail.isNew) {
          // Crear nuevo detalle
          await ProductsService.createProductDetail({
            stock: detail.stock,
            marca: detail.marca,
            talla: detail.talla,
            color: detail.color,
            id_producto: Number(params.id),
          })
        }
      }
    }

    // Obtener el producto actualizado con detalles
    const completeProduct = await ProductsService.getProduct(Number(params.id))

    return NextResponse.json(completeProduct)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

// DELETE - Eliminar producto
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ProductsService.deleteProduct(Number(params.id))
    return NextResponse.json({ message: "Producto eliminado correctamente" })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
