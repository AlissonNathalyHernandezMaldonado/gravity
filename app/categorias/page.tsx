"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    id_categoria: 1,
    nombre_categoria: "Sudaderas Mujer",
    descripcion: "Sudaderas cómodas y modernas para mujer con diseños únicos",
    total_productos: 45,
    imagen: "/placeholder.svg?height=300&width=400",
    color_tema: "from-pink-500 to-orange-500",
  },
  {
    id_categoria: 2,
    nombre_categoria: "Sudaderas Hombre",
    descripcion: "Sudaderas urbanas para hombre con estilo contemporáneo",
    total_productos: 38,
    imagen: "/placeholder.svg?height=300&width=400",
    color_tema: "from-blue-500 to-cyan-500",
  },
  {
    id_categoria: 3,
    nombre_categoria: "Chaquetas",
    descripcion: "Chaquetas deportivas y casuales para todas las ocasiones",
    total_productos: 22,
    imagen: "/placeholder.svg?height=300&width=400",
    color_tema: "from-green-500 to-yellow-500",
  },
]

export default function CategoriasPage() {
  const [isAdmin] = useState(true) // Mock admin status

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Categorías
              </span>
            </h1>
            <p className="text-gray-300 text-lg">Gestiona las categorías de productos de tu tienda</p>
          </div>

          {isAdmin && (
            <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </Button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => (
            <Card
              key={category.id_categoria}
              className="group bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={category.imagen || "/placeholder.svg"}
                  alt={category.nombre_categoria}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.color_tema} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                />

                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Edit className="h-4 w-4 text-gray-600" />
                    </Button>
                    <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    {category.nombre_categoria}
                  </h3>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    ID: {category.id_categoria}
                  </Badge>
                </div>

                <p className="text-gray-400 mb-4">{category.descripcion}</p>

                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 font-semibold">{category.total_productos} productos</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
                  >
                    <Link href={`/productos?categoria=${category.id_categoria}`}>Ver Productos</Link>
                  </Button>

                  {isAdmin && (
                    <Button
                      variant="outline"
                      className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white transition-all duration-300"
                    >
                      Gestionar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Estadísticas de Categorías</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">3</div>
              <div className="text-gray-400">Total Categorías</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">105</div>
              <div className="text-gray-400">Total Productos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">45</div>
              <div className="text-gray-400">Más Popular</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">22</div>
              <div className="text-gray-400">Menos Popular</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
