import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, UserPlus, Settings } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,53,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,212,63,0.1),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-orange-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-yellow-500 rounded-full animate-pulse" />
      </div>

      {/* Admin Access Button - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <Link href="/admin-login">
          <Button
            variant="outline"
            size="sm"
            className="border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white backdrop-blur-sm bg-slate-800/50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </Link>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-4xl">G</span>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Nueva Colección Neón</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              GRAVITY
            </span>
            <br />
            <span className="text-white">FASHION</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Descubre la nueva era de la moda urbana con diseños únicos y colores que brillan en la oscuridad
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
            >
              <Link href="/productos" className="flex items-center space-x-2">
                <span>Explorar Colección</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-full transition-all duration-300"
            >
              <Link href="/registro" className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Registrarse</span>
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">34+</div>
              <div className="text-gray-400 text-sm">Productos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">15+</div>
              <div className="text-gray-400 text-sm">Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">4.9★</div>
              <div className="text-gray-400 text-sm">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-orange-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-orange-400 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
