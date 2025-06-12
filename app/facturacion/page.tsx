"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Receipt, Download, Eye, Search, Filter, CreditCard, Calendar } from "lucide-react"

const invoices = [
  {
    id_pago: 7,
    id_pedido: 3,
    monto_factura: "718196",
    metodo_pago_factura: "Contraentrega",
    fecha_pago_factura: "2025-04-21 23:53:39",
    estado: "pagado",
    id_usuario: 1023,
    productos: [
      { nombre: "Sudadera Neon Orange", cantidad: 2, precio: 300000 },
      { nombre: "Chaqueta Cyber", cantidad: 1, precio: 418196 },
    ],
  },
  {
    id_pago: 5,
    id_pedido: 2,
    monto_factura: "20000.000",
    metodo_pago_factura: "Tarjeta",
    fecha_pago_factura: "2024-12-07",
    estado: "pagado",
    id_usuario: 13,
    productos: [{ nombre: "Hoodie Gravity Yellow", cantidad: 1, precio: 20000 }],
  },
  {
    id_pago: 4,
    id_pedido: 2,
    monto_factura: "1.200000",
    metodo_pago_factura: "Transferencia",
    fecha_pago_factura: "2024-11-30",
    estado: "pendiente",
    id_usuario: 2,
    productos: [
      { nombre: "Sudadera Glow Pink", cantidad: 3, precio: 400000 },
      { nombre: "Chaqueta Neon Green", cantidad: 2, precio: 800000 },
    ],
  },
]

export default function FacturacionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pagado":
        return "bg-green-500"
      case "pendiente":
        return "bg-yellow-500"
      case "cancelado":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "tarjeta":
      case "tarjeta de crédito":
        return <CreditCard className="w-4 h-4" />
      default:
        return <Receipt className="w-4 h-4" />
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id_pago.toString().includes(searchTerm) ||
      invoice.metodo_pago_factura.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.estado === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Facturación
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Gestiona y revisa todas las facturas y pagos</p>
        </div>

        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="invoices" className="data-[state=active]:bg-orange-500">
              Facturas
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-orange-500">
              Métodos de Pago
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-orange-500">
              Reportes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            {/* Filters */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar facturas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pagado">Pagado</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todo el tiempo</SelectItem>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mes</SelectItem>
                      <SelectItem value="year">Este año</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Invoices List */}
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <Card
                  key={invoice.id_pago}
                  className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">Factura #{invoice.id_pago}</h3>
                          <Badge className={`${getStatusColor(invoice.estado)} text-white`}>{invoice.estado}</Badge>
                        </div>
                        <p className="text-gray-400 text-sm">Pedido #{invoice.id_pedido}</p>
                        <p className="text-gray-400 text-sm">Usuario ID: {invoice.id_usuario}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-400 mb-1">
                          {formatPrice(invoice.monto_factura)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          {getPaymentMethodIcon(invoice.metodo_pago_factura)}
                          <span>{invoice.metodo_pago_factura}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Productos:</h4>
                        <div className="space-y-1">
                          {invoice.productos.map((producto, index) => (
                            <div key={index} className="text-gray-300 text-sm">
                              {producto.cantidad}x {producto.nombre} - {formatPrice(producto.precio)}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                          <Calendar className="w-4 h-4 text-orange-400" />
                          <span>Fecha: {invoice.fecha_pago_factura}</span>
                        </div>
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
                        Descargar PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Métodos Disponibles</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-orange-400" />
                          <span className="text-white">Tarjeta de Crédito</span>
                        </div>
                        <Badge className="bg-green-500 text-white">Activo</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-orange-400" />
                          <span className="text-white">Tarjeta Débito</span>
                        </div>
                        <Badge className="bg-green-500 text-white">Activo</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Receipt className="w-5 h-5 text-orange-400" />
                          <span className="text-white">Transferencia</span>
                        </div>
                        <Badge className="bg-green-500 text-white">Activo</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Receipt className="w-5 h-5 text-orange-400" />
                          <span className="text-white">Contraentrega</span>
                        </div>
                        <Badge className="bg-green-500 text-white">Activo</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Estadísticas de Pago</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-400">65%</div>
                        <div className="text-gray-400 text-sm">Tarjeta</div>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-400">25%</div>
                        <div className="text-gray-400 text-sm">Transferencia</div>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">10%</div>
                        <div className="text-gray-400 text-sm">Contraentrega</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Resumen Financiero</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Facturado</span>
                      <span className="text-2xl font-bold text-orange-400">{formatPrice(1938196)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Pagos Pendientes</span>
                      <span className="text-xl font-bold text-yellow-400">{formatPrice(1200000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Pagos Completados</span>
                      <span className="text-xl font-bold text-green-400">{formatPrice(738196)}</span>
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
                    Generar Reporte Mensual
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                  >
                    Exportar Facturas
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
                  >
                    Configurar Recordatorios
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
