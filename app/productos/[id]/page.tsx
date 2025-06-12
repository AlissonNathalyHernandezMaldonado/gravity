"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Heart, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react"
import Link from "next/link"
import type { ProductWithDetails } from "@/lib/products-service"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<ProductWithDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/productos/${productId}`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: ProductWithDetails = await response.json()
        setProduct(data)

        // Seleccionar automáticamente la primera talla y color disponibles
        if (data.detalles && data.detalles.length > 0) {
          const availableSizes = [...new Set(data.detalles.map((d) => d.talla))]
          const availableColors = [...new Set(data.detalles.map((d) => d.color))]

          if (availableSizes.length > 0) setSelectedSize(availableSizes[0])
          if (availableColors.length > 0) setSelectedColor(availableColors[0])
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(err instanceof Error ? err.message : "Error al cargar el producto")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice)
  }

  const getAvailableStock = (): number => {
    if (!product?.detalles) return 0

    const matchingDetails = product.detalles.filter((d) => d.talla === selectedSize && d.color === selectedColor)

    return matchingDetails.reduce((total, detail) => total + detail.stock, 0)
  }

  const getAvailableSizes = (): string[] => {
    if (!product?.detalles) return []
    return [...new Set(product.detalles.map((d) => d.talla))]
  }

  const getAvailableColors = (): string[] => {
    if (!product?.detalles) return []
    return [...new Set(product.detalles.map((d) => d.color))]
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget
    target.src = "/placeholder.svg?height=600&width=600"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando producto...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-lg text-center max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-2">Error al cargar producto</h2>
            <p className="mb-4">{error || "Producto no encontrado"}</p>
            <Link href="/productos">
              <Button className="bg-red-500 hover:bg-red-600 text-white">Volver a productos</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const availableStock = getAvailableStock()
  const availableSizes = getAvailableSizes()
  const availableColors = getAvailableColors()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/productos"
            className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a productos
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={`/${product.img}` || "/placeholder.svg"}
                  alt={product.nombre_producto}
                  className="w-full h-96 lg:h-[600px] object-cover"
                  onError={handleImageError}
                />
              </CardContent>
            </Card>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="text-orange-400 border-orange-400 mb-3">
                {product.categoria}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">{product.nombre_producto}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{product.descripcion_producto}</p>
            </div>

            {/* Precio */}
            <div className="border-t border-slate-700 pt-6">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {formatPrice(Number(product.precio_producto))}
              </div>
              <p className="text-gray-400">Precio incluye IVA</p>
            </div>

            {/* Selección de talla y color */}
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Talla</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecciona una talla" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Color</label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecciona un color" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stock disponible */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Stock disponible:</span>
                <Badge
                  className={`${
                    availableStock > 10 ? "bg-green-500" : availableStock > 0 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                >
                  {availableStock} unidades
                </Badge>
              </div>
            </div>

            {/* Cantidad y botones */}
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Cantidad</label>
                <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number(value))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: Math.min(availableStock, 10) }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3"
                  disabled={availableStock === 0 || !selectedSize || !selectedColor}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {availableStock === 0 ? "Agotado" : "Agregar al Carrito"}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Información adicional */}
            <div className="border-t border-slate-700 pt-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Truck className="w-5 h-5 text-orange-400" />
                <span>Envío gratis en compras superiores a $150.000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Shield className="w-5 h-5 text-orange-400" />
                <span>Garantía de calidad</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <RotateCcw className="w-5 h-5 text-orange-400" />
                <span>Devoluciones hasta 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
