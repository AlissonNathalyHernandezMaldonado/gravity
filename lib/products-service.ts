import { executeQuery } from "./database"

export interface Product {
  id_producto: number
  nombre_producto: string
  descripcion_producto: string
  precio_producto: number
  id_categoria: number
  img: string
  categoria?: string
  detalles?: ProductDetail[]
}

export interface ProductDetail {
  id_detalle_producto: number
  stock: number
  marca: string
  talla: string
  color: string
  id_producto: number
}

export interface Category {
  id_categoria: number
  nombre_categoria: string
}

export interface CreateProductData {
  nombre_producto: string
  descripcion_producto: string
  precio_producto: number
  id_categoria: number
  img: string
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id_producto: number
}

export interface CreateProductDetailData {
  stock: number
  marca: string
  talla: string
  color: string
  id_producto: number
}

export class ProductsService {
  // Obtener todos los productos con su categoría
  static async getProducts(): Promise<Product[]> {
    try {
      const query = `
        SELECT p.*, c.nombre_categoria as categoria
        FROM producto p
        LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
        ORDER BY p.id_producto DESC
      `
      const products = (await executeQuery(query)) as Product[]

      // Obtener detalles para cada producto
      for (const product of products) {
        product.detalles = await this.getProductDetails(product.id_producto)
      }

      return products
    } catch (error) {
      console.error("Error fetching products:", error)
      throw new Error("Error al cargar productos")
    }
  }

  // Obtener detalles de un producto
  static async getProductDetails(productId: number): Promise<ProductDetail[]> {
    try {
      const query = `
        SELECT * FROM detalle_producto
        WHERE id_producto = ?
        ORDER BY talla
      `
      return (await executeQuery(query, [productId])) as ProductDetail[]
    } catch (error) {
      console.error("Error fetching product details:", error)
      return []
    }
  }

  // Obtener un producto por ID
  static async getProduct(id: number): Promise<Product | null> {
    try {
      const query = `
        SELECT p.*, c.nombre_categoria as categoria
        FROM producto p
        LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
        WHERE p.id_producto = ?
      `
      const results = (await executeQuery(query, [id])) as Product[]

      if (results.length === 0) {
        return null
      }

      const product = results[0]
      product.detalles = await this.getProductDetails(product.id_producto)

      return product
    } catch (error) {
      console.error("Error fetching product:", error)
      return null
    }
  }

  // Obtener todas las categorías
  static async getCategories(): Promise<Category[]> {
    try {
      const query = "SELECT * FROM categoria ORDER BY nombre_categoria"
      return (await executeQuery(query)) as Category[]
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw new Error("Error al cargar categorías")
    }
  }

  // Crear un nuevo producto
  static async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      const query = `
        INSERT INTO producto (nombre_producto, descripcion_producto, precio_producto, id_categoria, img)
        VALUES (?, ?, ?, ?, ?)
      `

      const params = [
        productData.nombre_producto,
        productData.descripcion_producto,
        productData.precio_producto,
        productData.id_categoria,
        productData.img,
      ]

      const result = (await executeQuery(query, params)) as any
      const newProductId = result.insertId

      // Obtener el producto recién creado
      const newProduct = await this.getProduct(newProductId)
      if (!newProduct) {
        throw new Error("Error al crear producto")
      }

      return newProduct
    } catch (error) {
      console.error("Error creating product:", error)
      throw new Error("Error al crear producto")
    }
  }

  // Crear detalle de producto
  static async createProductDetail(detailData: CreateProductDetailData): Promise<ProductDetail> {
    try {
      const query = `
        INSERT INTO detalle_producto (stock, marca, talla, color, id_producto)
        VALUES (?, ?, ?, ?, ?)
      `

      const params = [detailData.stock, detailData.marca, detailData.talla, detailData.color, detailData.id_producto]

      const result = (await executeQuery(query, params)) as any
      const newDetailId = result.insertId

      // Obtener el detalle recién creado
      const query2 = "SELECT * FROM detalle_producto WHERE id_detalle_producto = ?"
      const details = (await executeQuery(query2, [newDetailId])) as ProductDetail[]

      return details[0]
    } catch (error) {
      console.error("Error creating product detail:", error)
      throw new Error("Error al crear detalle de producto")
    }
  }

  // Actualizar un producto
  static async updateProduct(productData: UpdateProductData): Promise<Product> {
    try {
      const { id_producto, ...updateData } = productData

      // Construir query dinámicamente basado en los campos a actualizar
      const fields = Object.keys(updateData).filter((key) => updateData[key as keyof typeof updateData] !== undefined)
      const setClause = fields.map((field) => `${field} = ?`).join(", ")
      const values = fields.map((field) => updateData[field as keyof typeof updateData])

      if (fields.length === 0) {
        throw new Error("No hay campos para actualizar")
      }

      const query = `UPDATE producto SET ${setClause} WHERE id_producto = ?`
      values.push(id_producto)

      await executeQuery(query, values)

      // Obtener el producto actualizado
      const updatedProduct = await this.getProduct(id_producto)
      if (!updatedProduct) {
        throw new Error("Error al actualizar producto")
      }

      return updatedProduct
    } catch (error) {
      console.error("Error updating product:", error)
      throw new Error("Error al actualizar producto")
    }
  }

  // Actualizar detalle de producto
  static async updateProductDetail(id: number, detailData: Partial<ProductDetail>): Promise<ProductDetail> {
    try {
      const { id_detalle_producto, ...updateData } = detailData as any

      // Construir query dinámicamente basado en los campos a actualizar
      const fields = Object.keys(updateData).filter((key) => updateData[key] !== undefined)
      const setClause = fields.map((field) => `${field} = ?`).join(", ")
      const values = fields.map((field) => updateData[field])

      if (fields.length === 0) {
        throw new Error("No hay campos para actualizar")
      }

      const query = `UPDATE detalle_producto SET ${setClause} WHERE id_detalle_producto = ?`
      values.push(id)

      await executeQuery(query, values)

      // Obtener el detalle actualizado
      const query2 = "SELECT * FROM detalle_producto WHERE id_detalle_producto = ?"
      const details = (await executeQuery(query2, [id])) as ProductDetail[]

      return details[0]
    } catch (error) {
      console.error("Error updating product detail:", error)
      throw new Error("Error al actualizar detalle de producto")
    }
  }

  // Eliminar un producto
  static async deleteProduct(id: number): Promise<void> {
    try {
      // Primero eliminamos los detalles del producto (la restricción de clave foránea se encargará de esto)
      const query = "DELETE FROM producto WHERE id_producto = ?"
      await executeQuery(query, [id])
    } catch (error) {
      console.error("Error deleting product:", error)
      throw new Error("Error al eliminar producto")
    }
  }

  // Eliminar un detalle de producto
  static async deleteProductDetail(id: number): Promise<void> {
    try {
      const query = "DELETE FROM detalle_producto WHERE id_detalle_producto = ?"
      await executeQuery(query, [id])
    } catch (error) {
      console.error("Error deleting product detail:", error)
      throw new Error("Error al eliminar detalle de producto")
    }
  }

  // Buscar productos
  static async searchProducts(query: string, categoryId?: number): Promise<Product[]> {
    try {
      let sqlQuery = `
        SELECT p.*, c.nombre_categoria as categoria
        FROM producto p
        LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
        WHERE 1=1
      `
      const params: any[] = []

      if (query && query.trim() !== "") {
        sqlQuery += " AND (p.nombre_producto LIKE ? OR p.descripcion_producto LIKE ?)"
        const searchTerm = `%${query}%`
        params.push(searchTerm, searchTerm)
      }

      if (categoryId) {
        sqlQuery += " AND p.id_categoria = ?"
        params.push(categoryId)
      }

      sqlQuery += " ORDER BY p.id_producto DESC"

      const products = (await executeQuery(sqlQuery, params)) as Product[]

      // Obtener detalles para cada producto
      for (const product of products) {
        product.detalles = await this.getProductDetails(product.id_producto)
      }

      return products
    } catch (error) {
      console.error("Error searching products:", error)
      throw new Error("Error al buscar productos")
    }
  }

  // Obtener estadísticas
  static async getStats(): Promise<{
    totalProducts: number
    totalCategories: number
    totalStock: number
    lowStockProducts: number
  }> {
    try {
      const queries = [
        "SELECT COUNT(*) as total FROM producto",
        "SELECT COUNT(*) as total FROM categoria",
        "SELECT SUM(stock) as total FROM detalle_producto",
        "SELECT COUNT(DISTINCT id_producto) as total FROM detalle_producto WHERE stock <= 5",
      ]

      const [totalProductsResult, totalCategoriesResult, totalStockResult, lowStockResult] = (await Promise.all(
        queries.map((query) => executeQuery(query)),
      )) as any[]

      return {
        totalProducts: totalProductsResult[0]?.total || 0,
        totalCategories: totalCategoriesResult[0]?.total || 0,
        totalStock: totalStockResult[0]?.total || 0,
        lowStockProducts: lowStockResult[0]?.total || 0,
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      throw new Error("Error al obtener estadísticas")
    }
  }
}
