import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Image src="/images/gravity-logo.png" alt="Gravity Logo" width={40} height={40} className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                GRAVITY
              </span>
            </div>
            <p className="text-gray-400 mb-4">Moda urbana con diseños únicos y colores que brillan en la oscuridad.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              {/* <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </Link> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos?categoria=1" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Sudaderas Mujer
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=2" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Sudaderas Hombre
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=3" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Chaquetas
                </Link>
              </li>
              <li>
                <Link href="/accesorios" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Accesorios
                </Link>
              </li>
              <li>
                <Link href="/nuevos" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Nuevos Productos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Calle Principal 123, Ciudad</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4 text-orange-400" />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4 text-orange-400" />
                <span>info@gravity.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 Gravity Fashion. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacidad" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
              Términos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
