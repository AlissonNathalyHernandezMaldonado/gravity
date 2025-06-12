import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const categories = [
  {
    id_categoria: 1,
    nombre_categoria: "sudadera mujer",
    descripcion: "Diseños únicos y cómodos para mujer",
    image: "/placeholder.svg?height=300&width=400",
    count: "12+ productos",
    color: "from-pink-500 to-orange-500",
  },
  {
    id_categoria: 2,
    nombre_categoria: "sudadera hombre",
    descripcion: "Estilo urbano y comodidad masculina",
    image: "/placeholder.svg?height=300&width=400",
    count: "18+ productos",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id_categoria: 3,
    nombre_categoria: "chaquetas",
    descripcion: "Protección con estilo para todas las ocasiones",
    image: "/placeholder.svg?height=300&width=400",
    count: "4+ productos",
    color: "from-green-500 to-yellow-500",
  },
]

export function Categories() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Categorías
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explora nuestra colección organizada por categorías para encontrar exactamente lo que buscas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card
              key={category.id_categoria}
              className="group bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.nombre_categoria}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                />
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 capitalize">{category.nombre_categoria}</h3>
                <p className="text-gray-400 mb-3">{category.descripcion}</p>
                <p className="text-orange-400 text-sm mb-4">{category.count}</p>

                <Button
                  variant="outline"
                  className="w-full border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  <Link href={`/productos?categoria=${category.id_categoria}`}>Ver Productos</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
