"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Heart, Eye, Filter, Search } from "lucide-react"
import Link from "next/link"
import type { ProductWithDetails, ProductDetail } from "@/lib/products-service"

export default function ProductosPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [favorites, setFavorites] = useState<number[]>([])
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(null)

        // Construir URL con parámetros de búsqueda
        const params = new URLSearchParams()
        if (searchTerm) params.append("q", searchTerm)
        if (selectedCategory !== "all") params.append("categoria", selectedCategory)

        const response = await fetch(`/api/productos?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: ProductWithDetails[] = await response.json()
        setProducts(data)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err instanceof Error ? err.message : "Error al cargar productos")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchTerm, selectedCategory])

  // Get search term from URL params
  useEffect(() => {
    const urlSearch = searchParams.get("search")
    const urlCategory = searchParams.get("categoria")

    if (urlSearch) {
      setSearchTerm(urlSearch)
    }
    if (urlCategory) {
      setSelectedCategory(urlCategory)
    }
  }, [searchParams])

  const toggleFavorite = (productId: number | undefined): void => {
    if (!productId) return
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice)
  }

  const getTotalStock = (detalles: ProductDetail[] = []): number => {
    return detalles.reduce((total, detalle) => total + detalle.stock, 0)
  }

  const getAvailableSizes = (detalles: ProductDetail[] = []): string[] => {
    return [...new Set(detalles.map((d) => d.talla))]
  }

  const getAvailableColors = (detalles: ProductDetail[] = []): string[] => {
    return [...new Set(detalles.map((d) => d.color))]
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.currentTarget
    target.src = "/placeholder.svg?height=400&width=400"
  }

  // Ordenar productos
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Number(a.precio_producto) - Number(b.precio_producto)
      case "price-high":
        return Number(b.precio_producto) - Number(a.precio_producto)
      case "stock":
        return getTotalStock(b.detalles) - getTotalStock(a.detalles)
      default:
        return a.nombre_producto.localeCompare(b.nombre_producto)
    }
  })

  // Mostrar pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando productos...</p>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-lg text-center max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-2">Error al cargar productos</h2>
            <p className="mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Productos
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Descubre nuestra colección completa de moda urbana neón</p>
          {searchTerm && (
            <p className="text-orange-400 mt-2">
              Resultados para: "{searchTerm}" ({sortedProducts.length} productos encontrados)
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="1">Sudadera Mujer</SelectItem>
                <SelectItem value="2">Sudadera Hombre</SelectItem>
                <SelectItem value="3">Chaquetas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const totalStock = getTotalStock(product.detalles)
            const availableSizes = getAvailableSizes(product.detalles)
            const availableColors = getAvailableColors(product.detalles)
            const mainBrand = (product.detalles && product.detalles[0]?.marca) || "N/A"

            return (
              <Link href={`/productos/${product.id_producto}`} key={product.id_producto}>
                <Card className="group bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden cursor-pointer">
                  <div className="relative">
                    <img
                      src={`/${product.img}` || "/placeholder.svg"}
                      alt={product.nombre_producto}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                    />

                    {/* Stock Badge */}
                    <Badge
                      className={`absolute top-3 left-3 ${
                        totalStock > 20
                          ? "bg-green-500"
                          : totalStock > 10
                            ? "bg-yellow-500"
                            : totalStock > 0
                              ? "bg-orange-500"
                              : "bg-red-500"
                      }`}
                    >
                      Stock: {totalStock}
                    </Badge>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleFavorite(product.id_producto)
                        }}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            product.id_producto && favorites.includes(product.id_producto)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs mb-2 capitalize">
                      {product.categoria}
                    </Badge>

                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                      {product.nombre_producto}
                    </h3>

                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.descripcion_producto}</p>

                    <div className="mb-3">
                      <p className="text-xs text-gray-400 mb-1">Marca: {mainBrand}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {availableSizes.slice(0, 4).map((talla, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {talla.toUpperCase()}
                          </Badge>
                        ))}
                        {availableSizes.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{availableSizes.length - 4}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {availableColors.slice(0, 3).map((color, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                            {color}
                          </Badge>
                        ))}
                        {availableColors.length > 3 && (
                          <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                            +{availableColors.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-orange-400">
                        {formatPrice(Number(product.precio_producto))}
                      </span>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold transition-all duration-300"
                      disabled={totalStock === 0}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // Aquí iría la lógica para agregar al carrito
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {totalStock === 0 ? "Agotado" : "Agregar al Carrito"}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* No Results */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
              className="mt-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              Limpiar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
