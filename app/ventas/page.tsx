"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, DollarSign, ShoppingCart, Users, Calendar, Download, Eye, Search, Filter } from "lucide-react"

// Ventas reales de la base de datos
const sales = [
  {
    id_venta: 3,
    fecha: "2025-04-19 01:08:30",
    total: 190594.0,
    productos: [{ producto_nombre: "For one raya azul", precio: 190594.0, cantidad: 1, subtotal: 190594.0 }],
    cliente: "Cliente #1023",
    metodo_pago: "Contraentrega",
  },
  {
    id_venta: 2,
    fecha: "2025-04-18 06:13:03",
    total: 2654750.0,
    productos: [
      { producto_nombre: "For one negros", precio: 159980.0, cantidad: 1, subtotal: 159980.0 },
      { producto_nombre: "For one raya azul", precio: 190594.0, cantidad: 11, subtotal: 2096534.0 },
      { producto_nombre: "For one raya azul oscuro", precio: 99559.0, cantidad: 4, subtotal: 398236.0 },
    ],
    cliente: "Cliente #1024",
    metodo_pago: "Transferencia",
  },
  {
    id_venta: 1,
    fecha: "2025-04-18 04:53:54",
    total: 320260.0,
    productos: [
      { producto_nombre: "Camiseta Negra", precio: 25.0, cantidad: 12, subtotal: 300.0 },
      { producto_nombre: "For one negros", precio: 159980.0, cantidad: 2, subtotal: 319960.0 },
    ],
    cliente: "Cliente #1025",
    metodo_pago: "Efectivo",
  },
]

const salesStats = {
  totalVentas: 3165604.0,
  ventasHoy: 190594.0,
  ventasEsteMes: 3165604.0,
  clientesUnicos: 3,
  productosMasVendidos: [
    { nombre: "For one raya azul", cantidad: 12, ingresos: 2287128.0 },
    { nombre: "For one negros", cantidad: 3, ingresos: 479940.0 },
    { nombre: "For one raya azul oscuro", cantidad: 4, ingresos: 398236.0 },
    { nombre: "Camiseta Negra", cantidad: 12, ingresos: 300.0 },
  ],
}

export default function VentasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.id_venta.toString().includes(searchTerm) || sale.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPayment = paymentFilter === "all" || sale.metodo_pago.toLowerCase() === paymentFilter.toLowerCase()
    return matchesSearch && matchesPayment
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Ventas</span>
          </h1>
          <p className="text-gray-300 text-lg">Analiza el rendimiento de ventas y gestiona transacciones</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Ventas Totales</p>
                  <p className="text-2xl font-bold text-orange-400">{formatPrice(salesStats.totalVentas)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Ventas Hoy</p>
                  <p className="text-2xl font-bold text-green-400">{formatPrice(salesStats.ventasHoy)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Transacciones</p>
                  <p className="text-2xl font-bold text-blue-400">{sales.length}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Clientes Únicos</p>
                  <p className="text-2xl font-bold text-yellow-400">{salesStats.clientesUnicos}</p>
                </div>
                <Users className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="sales" className="data-[state=active]:bg-orange-500">
              Ventas
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-orange-500">
              Productos Top
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-orange-500">
              Reportes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            {/* Filters */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar ventas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todo el tiempo</SelectItem>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mes</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Método de Pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los métodos</SelectItem>
                      <SelectItem value="contraentrega">Contraentrega</SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sales List */}
            <div className="space-y-4">
              {filteredSales.map((sale) => (
                <Card
                  key={sale.id_venta}
                  className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">Venta #{sale.id_venta}</h3>
                          <Badge className="bg-green-500 text-white">Completada</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(sale.fecha)}</span>
                          </div>
                          <span>{sale.cliente}</span>
                          <span>{sale.metodo_pago}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-400 mb-1">{formatPrice(sale.total)}</div>
                        <div className="text-gray-400 text-sm">{sale.productos.length} producto(s)</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2">Productos vendidos:</h4>
                      <div className="space-y-2">
                        {sale.productos.map((producto, index) => (
                          <div key={index} className="flex justify-between items-center bg-slate-700/50 rounded p-3">
                            <div>
                              <span className="text-white">{producto.producto_nombre}</span>
                              <span className="text-gray-400 text-sm ml-2">x{producto.cantidad}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-orange-400 font-semibold">{formatPrice(producto.subtotal)}</div>
                              <div className="text-gray-400 text-sm">{formatPrice(producto.precio)} c/u</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Factura
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Productos Más Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesStats.productosMasVendidos.map((producto, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{producto.nombre}</h4>
                          <p className="text-gray-400 text-sm">{producto.cantidad} unidades vendidas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-400 font-semibold">{formatPrice(producto.ingresos)}</div>
                        <div className="text-gray-400 text-sm">Ingresos totales</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Resumen del Período</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Ventas del Mes</span>
                      <span className="text-xl font-bold text-orange-400">{formatPrice(salesStats.ventasEsteMes)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Promedio por Venta</span>
                      <span className="text-xl font-bold text-yellow-400">
                        {formatPrice(salesStats.totalVentas / sales.length)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Crecimiento</span>
                      <span className="text-xl font-bold text-green-400">+25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Reporte Mensual
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Programar Reporte
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Análisis Avanzado
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
