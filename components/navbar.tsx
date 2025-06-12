"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Menu, X, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [cartItems] = useState(3) // Mock cart items
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm("")
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-sm border-b border-orange-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/images/gravity-logo.png" alt="Gravity Logo" width={40} height={40} className="w-10 h-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              GRAVITY
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-orange-400 transition-colors">
                Inicio
              </Link>
              <Link href="/productos" className="text-white hover:text-orange-400 transition-colors">
                Productos
              </Link>
              <Link href="/categorias" className="text-white hover:text-orange-400 transition-colors">
                Categorías
              </Link>
            </div>
          </div>

          {/* Desktop Search & Actions */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-slate-800 border-slate-600 text-white placeholder-gray-400 pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full text-orange-400 hover:text-orange-300"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <Link href="/perfil">
              <Button variant="ghost" size="icon" className="text-white hover:text-orange-400">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/carrito">
              <Button variant="ghost" size="icon" className="text-white hover:text-orange-400 relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs">{cartItems}</Badge>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-orange-500/20">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border-slate-600 text-white placeholder-gray-400 pr-10"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full text-orange-400 hover:text-orange-300"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <Link href="/" className="text-white hover:text-orange-400 transition-colors">
                Inicio
              </Link>
              <Link href="/productos" className="text-white hover:text-orange-400 transition-colors">
                Productos
              </Link>
              <Link href="/categorias" className="text-white hover:text-orange-400 transition-colors">
                Categorías
              </Link>

              <div className="flex items-center space-x-4 pt-4 border-t border-orange-500/20">
                <Link href="/perfil">
                  <Button variant="ghost" size="icon" className="text-white hover:text-orange-400">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/carrito">
                  <Button variant="ghost" size="icon" className="text-white hover:text-orange-400 relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs">{cartItems}</Badge>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
