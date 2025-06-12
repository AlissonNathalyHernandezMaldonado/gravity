"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Phone, Mail, MapPin, Package, Plus, Edit, Trash2, Search, Filter } from "lucide-react"

const suppliers = [
  {
    id_proveedor: 1,
    nombre_proveedor: "Nike Colombia",
    telefono_proveedor: "3001234567",
    direccion_proveedor: "Calle 100 #15-20, Bogotá",
    email: "ventas@nike.com.co",
    productos_suministrados: 25,
    estado: "activo",
    calificacion: 4.8,
    tiempo_entrega: "5-7 días",
    productos: ["Sudaderas", "Chaquetas", "Accesorios"],
  },
  {
    id_proveedor: 2,
    nombre_proveedor: "Adidas Distribution",
    telefono_proveedor: "3009876543",
    direccion_proveedor: "Carrera 7 #32-45, Medellín",
    email: "colombia@adidas.com",
    productos_suministrados: 18,
    estado: "activo",
    calificacion: 4.6,
    tiempo_entrega: "3-5 días",
    productos: ["Sudaderas", "Ropa Deportiva"],
  },
  {
    id_proveedor: 3,
    nombre_proveedor: "Jordan Supplies",
    telefono_proveedor: "3005555555",
    direccion_proveedor: "Zona Franca, Cali",
    email: "info@jordansupplies.co",
    productos_suministrados: 12,
    estado: "inactivo",
    calificacion: 4.2,
    tiempo_entrega: "7-10 días",
    productos: ["Sudaderas Premium", "Ediciones Limitadas"],
  },
]

const supplierOrders = [
  {
    id: 1,
    proveedor: "Nike Colombia",
    fecha_pedido: "2024-04-20",
    productos: "Sudaderas Neon x50",
    total: 7500000,
    estado: "pendiente",
    fecha_entrega: "2024-04-27",
  },
  {
    id: 2,
    proveedor: "Adidas Distribution",
    fecha_pedido: "2024-04-18",
    productos: "Chaquetas x30",
    total: 4500000,
    estado: "entregado",
    fecha_entrega: "2024-04-23",
  },
]

export default function ProveedorPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddingSupplier, setIsAddingSupplier] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activo":
        return "bg-green-500"
      case "inactivo":
        return "bg-red-500"
      case "pendiente":
        return "bg-yellow-500"
      case "entregado":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.nombre_proveedor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || supplier.estado === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Proveedores
              </span>
            </h1>
            <p className="text-gray-300 text-lg">Gestiona tus proveedores y pedidos de inventario</p>
          </div>

          <Button
            onClick={() => setIsAddingSupplier(true)}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </div>

        <Tabs defaultValue="suppliers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="suppliers" className="data-[state=active]:bg-orange-500">
              Proveedores
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-orange-500">
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-500">
              Análisis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers">
            {/* Filters */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar proveedores..."
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
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      <SelectItem value="sudaderas">Sudaderas</SelectItem>
                      <SelectItem value="chaquetas">Chaquetas</SelectItem>
                      <SelectItem value="accesorios">Accesorios</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Suppliers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.map((supplier) => (
                <Card
                  key={supplier.id_proveedor}
                  className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{supplier.nombre_proveedor}</CardTitle>
                          <Badge className={`${getStatusColor(supplier.estado)} text-white mt-1`}>
                            {supplier.estado}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="text-orange-400 hover:text-orange-300">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Phone className="w-4 h-4 text-orange-400" />
                        <span>{supplier.telefono_proveedor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Mail className="w-4 h-4 text-orange-400" />
                        <span>{supplier.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span>{supplier.direccion_proveedor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Package className="w-4 h-4 text-orange-400" />
                        <span>{supplier.productos_suministrados} productos</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-400">★ {supplier.calificacion}</div>
                        <div className="text-gray-400 text-xs">Calificación</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">{supplier.tiempo_entrega}</div>
                        <div className="text-gray-400 text-xs">Entrega</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white font-medium text-sm mb-2">Productos:</h4>
                      <div className="flex flex-wrap gap-1">
                        {supplier.productos.map((producto, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-orange-400 border-orange-400">
                            {producto}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white text-sm"
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white text-sm"
                      >
                        Hacer Pedido
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Pedidos a Proveedores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplierOrders.map((order) => (
                    <div key={order.id} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-semibold">Pedido #{order.id}</h4>
                          <p className="text-gray-400 text-sm">{order.proveedor}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.estado)} text-white`}>{order.estado}</Badge>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-orange-400">Productos:</span>
                          <div className="text-gray-300">{order.productos}</div>
                        </div>
                        <div>
                          <span className="text-orange-400">Fecha Pedido:</span>
                          <div className="text-gray-300">{order.fecha_pedido}</div>
                        </div>
                        <div>
                          <span className="text-orange-400">Entrega:</span>
                          <div className="text-gray-300">{order.fecha_entrega}</div>
                        </div>
                        <div>
                          <span className="text-orange-400">Total:</span>
                          <div className="text-white font-semibold">{formatPrice(order.total)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Estadísticas de Proveedores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400">3</div>
                      <div className="text-gray-400 text-sm">Total Proveedores</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">2</div>
                      <div className="text-gray-400 text-sm">Activos</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">4.5★</div>
                      <div className="text-gray-400 text-sm">Calificación Promedio</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">55</div>
                      <div className="text-gray-400 text-sm">Productos Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Resumen Financiero</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Pedidos Mes</span>
                      <span className="text-2xl font-bold text-orange-400">{formatPrice(12000000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Pedidos Pendientes</span>
                      <span className="text-xl font-bold text-yellow-400">{formatPrice(7500000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Ahorro Promedio</span>
                      <span className="text-xl font-bold text-green-400">15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
