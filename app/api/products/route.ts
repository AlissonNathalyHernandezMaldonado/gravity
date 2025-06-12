import { type NextRequest, NextResponse } from "next/server"
import { ProductsService } from "@/lib/products-service"

// GET - Obtener todos los productos o buscar
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const categoryId = searchParams.get("category") ? Number(searchParams.get("category")) : undefined

    let products
    if (query || categoryId) {
      products = await ProductsService.searchProducts(query, categoryId)
    } else {
      products = await ProductsService.getProducts()
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { product, details } = data

    // Crear el producto
    const newProduct = await ProductsService.createProduct(product)

    // Crear los detalles del producto
    if (details && details.length > 0) {
      for (const detail of details) {
        await ProductsService.createProductDetail({
          ...detail,
          id_producto: newProduct.id_producto,
        })
      }
    }

    // Obtener el producto completo con detalles
    const completeProduct = await ProductsService.getProduct(newProduct.id_producto)

    return NextResponse.json(completeProduct, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
