"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id_producto: 7,
    nombre_producto: "Sudadera negra sin capota",
    precio_producto: 104682,
    img: "img/sudaderah3.png",
    categoria: "sudadera hombre",
    isNew: true,
    stock: 42,
  },
  {
    id_producto: 9,
    nombre_producto: "Sudadera verde basica",
    precio_producto: 175302,
    img: "img/sudaderah8.png",
    categoria: "sudadera hombre",
    isNew: false,
    stock: 43,
  },
  {
    id_producto: 13,
    nombre_producto: "Sudadera beige sin capota",
    precio_producto: 195158,
    img: "img/sudaderah5.png",
    categoria: "sudadera mujer",
    isNew: true,
    stock: 24,
  },
  {
    id_producto: 19,
    nombre_producto: "Sudadera Balenciaga 3 piezas",
    precio_producto: 75000,
    img: "img/sudaderad8.png",
    categoria: "sudadera mujer",
    isNew: false,
    stock: 22,
  },
]

export function FeaturedProducts() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Productos Destacados
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Descubre nuestros productos más populares con diseños únicos y colores que brillan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/productos/${product.id_producto}`} key={product.id_producto}>
              <Card className="group bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden cursor-pointer">
                <div className="relative">
                  <img
                    src={`/${product.img}` || "/placeholder.svg"}
                    alt={product.nombre_producto}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && <Badge className="bg-orange-500 text-white">Nuevo</Badge>}
                    <Badge
                      className={`${
                        product.stock > 20 ? "bg-green-500" : product.stock > 10 ? "bg-yellow-500" : "bg-red-500"
                      } text-white`}
                    >
                      Stock: {product.stock}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white"
                      onClick={() => toggleFavorite(product.id_producto)}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.includes(product.id_producto) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                      />
                    </Button>
                    <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs capitalize">
                      {product.categoria}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                    {product.nombre_producto}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-orange-400">{formatPrice(product.precio_producto)}</span>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold transition-all duration-300"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // Aquí iría la lógica para agregar al carrito
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Agregar al Carrito
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-full transition-all duration-300"
          >
            <Link href="/productos">Ver Todos los Productos</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
