"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/lib/products-service"

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity: number, size: string, color: string) => void
  removeFromCart: (productId: number, size: string, color: string) => void
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
  isLoaded: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("gravity_cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      }
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error)
      localStorage.removeItem("gravity_cart") // Limpiar localStorage corrupto
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Guardar carrito en localStorage cuando cambia (solo después de cargar)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("gravity_cart", JSON.stringify(items))
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [items, isLoaded])

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    setItems((prevItems) => {
      // Verificar si el producto ya está en el carrito con la misma talla y color
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.product.id_producto === product.id_producto &&
          item.selectedSize === size &&
          item.selectedColor === color,
      )

      if (existingItemIndex >= 0) {
        // Si ya existe, actualizar la cantidad
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // Si no existe, agregar nuevo item
        return [...prevItems, { product, quantity, selectedSize: size, selectedColor: color }]
      }
    })
  }

  const removeFromCart = (productId: number, size: string, color: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.product.id_producto === productId && item.selectedSize === size && item.selectedColor === color),
      ),
    )
  }

  const updateQuantity = (productId: number, size: string, color: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id_producto === productId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  // Calcular el número total de items en el carrito
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  // Calcular el total del carrito
  const total = items.reduce((sum, item) => sum + Number(item.product.precio_producto) * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
