"use client"

import { useState } from "react"
import { ProductsProvider, useProducts } from "@/hooks/use-products"
import { ProductList } from "@/components/admin/product-list"
import { ProductForm } from "@/components/admin/product-form"
import { StatsDashboard } from "@/components/admin/stats-dashboard"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products-service"

type ViewMode = "list" | "create" | "edit"

function AdminContent() {
  const {
    products,
    categories,
    loading,
    actionLoading, // Nuevo
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    refreshProducts,
  } = useProducts()

  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleAdd = () => {
    setEditingProduct(null)
    setViewMode("create")
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setViewMode("edit")
  }

  const handleSubmit = async (productData: any, details: any[]) => {
    if (viewMode === "edit" && editingProduct) {
      await updateProduct({ ...productData, id_producto: editingProduct.id_producto }, details)
    } else {
      await createProduct(productData, details)
    }
    setViewMode("list")
    setEditingProduct(null)
  }

  const handleCancel = () => {
    setViewMode("list")
    setEditingProduct(null)
  }

  return (
    <div className="relative min-h-screen">
      {/* Animated Background - Same as Hero */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,53,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,212,63,0.1),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-orange-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-yellow-500 rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  GRAVITY
                </span>
                <span className="text-white ml-2">ADMIN</span>
              </h1>
              <p className="text-gray-400">Panel de administración</p>
            </div>
          </div>

          {viewMode !== "list" && (
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la lista
            </Button>
          )}
        </div>

        {/* Content */}
        {viewMode === "list" && (
          <>
            <StatsDashboard />
            <ProductList
              products={products}
              categories={categories}
              onEdit={handleEdit}
              onDelete={deleteProduct}
              onAdd={handleAdd}
              onSearch={searchProducts}
              onRefresh={refreshProducts}
              loading={loading}
              error={error}
            />
          </>
        )}

        {(viewMode === "create" || viewMode === "edit") && (
          <ProductForm
            product={editingProduct || undefined}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={actionLoading} // Usar actionLoading aquí
          />
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProductsProvider>
      <AdminContent />
    </ProductsProvider>
  )
}
