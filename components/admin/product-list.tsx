"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Search, Plus, RefreshCw, AlertCircle } from "lucide-react"
import Image from "next/image"
import { DeleteProductDialog } from "@/components/admin/delete-product-dialog"
import type { Product, Category } from "@/lib/products-service"

interface ProductListProps {
  products: Product[]
  categories: Category[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => Promise<void>
  onAdd: () => void
  onSearch: (query: string, categoryId?: number) => Promise<void>
  onRefresh: () => Promise<void>
  loading?: boolean
  error?: string | null
}

export function ProductList({
  products,
  categories,
  onEdit,
  onDelete,
  onAdd,
  onSearch,
  onRefresh,
  loading = false,
  error = null,
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(undefined)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  // Efecto para búsqueda en tiempo real
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm, categoryFilter)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, categoryFilter, onSearch])

  const handleDeleteConfirm = async () => {
    if (deleteProduct) {
      await onDelete(deleteProduct.id_producto)
      setDeleteProduct(null)
    }
  }

  // Calcular stock total para cada producto
  const getProductTotalStock = (product: Product) => {
    if (!product.detalles || product.detalles.length === 0) return 0
    return product.detalles.reduce((sum, detail) => sum + detail.stock, 0)
  }

  // Obtener tallas disponibles para cada producto
  const getProductSizes = (product: Product) => {
    if (!product.detalles || product.detalles.length === 0) return []
    return [...new Set(product.detalles.map((detail) => detail.talla.toUpperCase()))]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Productos</h2>
          <p className="text-gray-400">Gestiona tu inventario de productos ({products.length} productos)</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onRefresh}
            variant="outline"
            disabled={loading}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button
            onClick={onAdd}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white"
          />
        </div>
        <select
          value={categoryFilter || ""}
          onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full sm:w-48 px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id_categoria} value={category.id_categoria}>
              {category.nombre_categoria}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-slate-700 rounded w-16"></div>
                  <div className="h-6 bg-slate-700 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id_producto}
              className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <div className="w-full h-48 relative">
                    <Image
                      src={`/${product.img}`}
                      alt={product.nombre_producto}
                      fill
                      className="object-contain rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=200&width=300"
                      }}
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <span className="px-2 py-1 text-xs rounded-full bg-orange-500 text-white">
                      {product.categoria || "Sin categoría"}
                    </span>
                    {getProductTotalStock(product) <= 5 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-500 text-white">Stock bajo</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-white truncate">{product.nombre_producto}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{product.descripcion_producto}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-orange-400 font-bold">
                      ${Number(product.precio_producto).toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-sm">Stock: {getProductTotalStock(product)}</span>
                  </div>

                  {/* Tallas disponibles */}
                  {product.detalles && product.detalles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getProductSizes(product).map((size, i) => (
                        <span key={i} className="px-2 py-1 text-xs border border-yellow-500 text-yellow-400 rounded">
                          {size}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(product)}
                      className="flex-1 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteProduct(product)}
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 text-lg">No se encontraron productos</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchTerm || categoryFilter
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agregando tu primer producto"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <DeleteProductDialog
        product={deleteProduct}
        open={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
