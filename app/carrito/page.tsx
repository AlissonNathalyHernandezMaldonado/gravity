"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Definición de tipos
interface CartItem {
  id_carrito: number
  id_usuario: number
  id_producto: number
  nombre_producto: string
  precio_producto: number
  cantidad: number
  talla: string
  color: string
  marca: string
  img: string
  stock_disponible: number
  fecha_agregado: string
}

interface ClienteData {
  nombre: string
  email: string
  telefono: string
  direccion: string
}

interface InvoiceData {
  numero_factura: string
  fecha: string
  hora: string
  cliente: ClienteData
  items: CartItem[]
  subtotal: number
  envio: number
  descuento: number
  total: number
  metodo_pago: string
  codigo_promo: string
}

// Datos del carrito basados en la estructura real de la BD
const cartItems: CartItem[] = [
  {
    id_carrito: 1,
    id_usuario: 1023,
    id_producto: 7,
    nombre_producto: "Sudadera negra sin capota",
    precio_producto: 104682,
    cantidad: 2,
    talla: "M",
    color: "negro",
    marca: "nike",
    img: "img/sudaderah3.png",
    stock_disponible: 20,
    fecha_agregado: "2024-04-21",
  },
  {
    id_carrito: 2,
    id_usuario: 1023,
    id_producto: 19,
    nombre_producto: "Sudadera Balenciaga 3 piezas",
    precio_producto: 75000,
    cantidad: 1,
    talla: "L",
    color: "rosado",
    marca: "balenciaga",
    img: "img/sudaderad8.png",
    stock_disponible: 5,
    fecha_agregado: "2024-04-20",
  },
  {
    id_carrito: 3,
    id_usuario: 1023,
    id_producto: 20,
    nombre_producto: "Chaqueta brillante dama",
    precio_producto: 198142,
    cantidad: 1,
    talla: "S",
    color: "verde",
    marca: "N/A",
    img: "img/chaquetad1.png",
    stock_disponible: 6,
    fecha_agregado: "2024-04-19",
  },
]

export default function CarritoPage() {
  const [items, setItems] = useState<CartItem[]>(cartItems)
  const [promoCode, setPromoCode] = useState<string>("")
  const [metodo_pago, setMetodoPago] = useState<string>("tarjeta")
  const [showInvoice, setShowInvoice] = useState<boolean>(false)
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)

  const updateQuantity = (id: number, newQuantity: number): void => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setItems(
      items.map((item) =>
        item.id_carrito === id ? { ...item, cantidad: Math.min(newQuantity, item.stock_disponible) } : item,
      ),
    )
  }

  const removeItem = (id: number): void => {
    setItems(items.filter((item) => item.id_carrito !== id))
  }

  const subtotal: number = items.reduce((sum, item) => sum + item.precio_producto * item.cantidad, 0)
  const shipping: number = 15000 // Costo fijo de envío
  const discount: number = promoCode === "GRAVITY10" ? subtotal * 0.1 : 0
  const total: number = subtotal + shipping - discount

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleProceedToPayment = (): void => {
    const invoice: InvoiceData = {
      numero_factura: `FAC-${Date.now()}`,
      fecha: new Date().toLocaleDateString("es-CO"),
      hora: new Date().toLocaleTimeString("es-CO"),
      cliente: {
        nombre: "Juan Pérez",
        email: "juan.perez@email.com",
        telefono: "+57 300 123 4567",
        direccion: "Calle 123 #45-67, Bogotá, Colombia",
      },
      items: items,
      subtotal: subtotal,
      envio: shipping,
      descuento: discount,
      total: total,
      metodo_pago: metodo_pago,
      codigo_promo: promoCode,
    }
    setInvoiceData(invoice)
    setShowInvoice(true)
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.currentTarget
    target.src = "/placeholder.svg?height=200&width=200"
  }

  const handlePrint = (): void => {
    window.print()
  }

  const handleNewPurchase = (): void => {
    setShowInvoice(false)
    setItems([])
  }

  if (showInvoice && invoiceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-400 mb-2">¡Compra Exitosa!</h1>
            <p className="text-gray-300">Tu pedido ha sido procesado correctamente</p>
          </div>

          {/* Invoice */}
          <Card className="bg-white text-black">
            <CardContent className="p-8">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">GRAVITY STORE</h2>
                  <p className="text-gray-600">Tienda de Ropa y Accesorios</p>
                  <p className="text-gray-600">NIT: 900.123.456-7</p>
                  <p className="text-gray-600">Bogotá, Colombia</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">FACTURA DE VENTA</h3>
                  <p className="text-gray-600">No. {invoiceData.numero_factura}</p>
                  <p className="text-gray-600">Fecha: {invoiceData.fecha}</p>
                  <p className="text-gray-600">Hora: {invoiceData.hora}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-3">DATOS DEL CLIENTE</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <span className="font-semibold">Nombre:</span> {invoiceData.cliente.nombre}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {invoiceData.cliente.email}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Teléfono:</span> {invoiceData.cliente.telefono}
                    </p>
                    <p>
                      <span className="font-semibold">Dirección:</span> {invoiceData.cliente.direccion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-800 mb-4">PRODUCTOS COMPRADOS</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left">Producto</th>
                        <th className="border border-gray-300 p-3 text-center">Talla</th>
                        <th className="border border-gray-300 p-3 text-center">Color</th>
                        <th className="border border-gray-300 p-3 text-center">Cant.</th>
                        <th className="border border-gray-300 p-3 text-right">Precio Unit.</th>
                        <th className="border border-gray-300 p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map((item) => (
                        <tr key={item.id_carrito}>
                          <td className="border border-gray-300 p-3">
                            <div>
                              <p className="font-semibold">{item.nombre_producto}</p>
                              <p className="text-sm text-gray-600">{item.marca}</p>
                            </div>
                          </td>
                          <td className="border border-gray-300 p-3 text-center">{item.talla}</td>
                          <td className="border border-gray-300 p-3 text-center">{item.color}</td>
                          <td className="border border-gray-300 p-3 text-center">{item.cantidad}</td>
                          <td className="border border-gray-300 p-3 text-right">{formatPrice(item.precio_producto)}</td>
                          <td className="border border-gray-300 p-3 text-right font-semibold">
                            {formatPrice(item.precio_producto * item.cantidad)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-full max-w-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(invoiceData.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío:</span>
                      <span>{formatPrice(invoiceData.envio)}</span>
                    </div>
                    {invoiceData.descuento > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento ({invoiceData.codigo_promo}):</span>
                        <span>-{formatPrice(invoiceData.descuento)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-xl font-bold">
                        <span>TOTAL:</span>
                        <span>{formatPrice(invoiceData.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">INFORMACIÓN DE PAGO</h4>
                <p>
                  <span className="font-semibold">Método de pago:</span>{" "}
                  {invoiceData.metodo_pago === "tarjeta"
                    ? "Tarjeta de Crédito"
                    : invoiceData.metodo_pago === "transferencia"
                      ? "Transferencia Bancaria"
                      : invoiceData.metodo_pago === "contraentrega"
                        ? "Pago Contraentrega"
                        : "Efectivo"}
                </p>
                <p>
                  <span className="font-semibold">Estado:</span>{" "}
                  <span className="text-green-600 font-semibold">PAGADO</span>
                </p>
              </div>

              {/* Footer */}
              <div className="text-center text-gray-600 text-sm border-t pt-4">
                <p>¡Gracias por tu compra en Gravity Store!</p>
                <p>Para cualquier consulta, contáctanos al: info@gravitystore.com | +57 1 234 5678</p>
                <p className="mt-2">Esta es una factura electrónica válida según la DIAN</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
              Imprimir Factura
            </Button>
            <Button
              onClick={handleNewPurchase}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            >
              Nueva Compra
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Tu carrito está vacío</h1>
            <p className="text-gray-400 mb-8">¡Descubre nuestros increíbles productos y comienza a comprar!</p>
            <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
              <Link href="/productos">Explorar Productos</Link>
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
        <div className="flex items-center gap-4 mb-8">
          <Link href="/productos">
            <Button variant="ghost" size="icon" className="text-orange-400 hover:text-orange-300">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Mi Carrito
              </span>
            </h1>
            <p className="text-gray-300 text-lg">Revisa tus productos antes de finalizar la compra</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id_carrito} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={`/${item.img}` || "/placeholder.svg"}
                      alt={item.nombre_producto}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={handleImageError}
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white">{item.nombre_producto}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id_carrito)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex gap-2 mb-3">
                        <Badge variant="outline" className="text-orange-400 border-orange-400">
                          {item.marca}
                        </Badge>
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                          Talla: {item.talla}
                        </Badge>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          {item.color}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id_carrito, item.cantidad - 1)}
                            className="h-8 w-8 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="text-white font-semibold w-8 text-center">{item.cantidad}</span>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id_carrito, item.cantidad + 1)}
                            disabled={item.cantidad >= item.stock_disponible}
                            className="h-8 w-8 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-400">
                            {formatPrice(item.precio_producto * item.cantidad)}
                          </div>
                          <div className="text-sm text-gray-400">{formatPrice(item.precio_producto)} c/u</div>
                        </div>
                      </div>

                      {item.stock_disponible <= 5 && (
                        <div className="mt-2">
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                            ¡Solo quedan {item.stock_disponible} en stock!
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="text-gray-300 text-sm mb-2 block">Código de Descuento</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="GRAVITY10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      variant="outline"
                      className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                    >
                      Aplicar
                    </Button>
                  </div>
                  {promoCode === "GRAVITY10" && (
                    <p className="text-green-400 text-sm mt-1">¡Descuento del 10% aplicado!</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({items.length} productos)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Envío
                    </span>
                    <span>{formatPrice(shipping)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Descuento</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-600 pt-3">
                    <div className="flex justify-between text-xl font-bold text-orange-400">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="text-gray-300 text-sm mb-2 block">Método de Pago</label>
                  <Select value={metodo_pago} onValueChange={setMetodoPago}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="contraentrega">Contraentrega</SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleProceedToPayment}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 mb-4"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceder al Pago
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                >
                  <Link href="/productos">Continuar Comprando</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
