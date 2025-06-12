"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle, Search, Filter } from "lucide-react"

const shipments = [
  {
    id_envio: 4,
    id_pedido: 3,
    metodo_envio: "Servientrega",
    direccion_envio: "carrera 8",
    estado_envio: "pendiente",
    fecha_envio: "2025-04-21",
    fecha_estimada: "2025-04-25",
    codigo_seguimiento: "SER123456789",
    costo_envio: 15000,
    peso: "0.8 kg",
    dimensiones: "30x25x10 cm",
  },
  {
    id_envio: 3,
    id_pedido: 2,
    metodo_envio: "efectivo",
    direccion_envio: "calle 124 #12-21",
    estado_envio: "en_transito",
    fecha_envio: "2024-11-13",
    fecha_estimada: "2024-11-16",
    codigo_seguimiento: "EFE987654321",
    costo_envio: 12000,
    peso: "1.2 kg",
    dimensiones: "35x30x15 cm",
  },
  {
    id_envio: 2,
    id_pedido: 1,
    metodo_envio: "efectivo",
    direccion_envio: "calle 35 sur",
    estado_envio: "entregado",
    fecha_envio: "2024-11-10",
    fecha_estimada: "2024-11-13",
    fecha_entrega: "2024-11-13",
    codigo_seguimiento: "EFE456789123",
    costo_envio: 10000,
    peso: "0.6 kg",
    dimensiones: "25x20x8 cm",
  },
]

const shippingMethods = [
  {
    id: 1,
    nombre: "Servientrega",
    descripcion: "Envío estándar a nivel nacional",
    tiempo_estimado: "3-5 días hábiles",
    costo_base: 15000,
    activo: true,
  },
  {
    id: 2,
    nombre: "Coordinadora",
    descripcion: "Envío express",
    tiempo_estimado: "1-2 días hábiles",
    costo_base: 25000,
    activo: true,
  },
  {
    id: 3,
    nombre: "Contraentrega",
    descripcion: "Pago al recibir",
    tiempo_estimado: "2-4 días hábiles",
    costo_base: 12000,
    activo: true,
  },
]

export default function EnvioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [trackingCode, setTrackingCode] = useState("")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "entregado":
        return "bg-green-500"
      case "en_transito":
        return "bg-blue-500"
      case "pendiente":
        return "bg-yellow-500"
      case "cancelado":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "entregado":
        return <CheckCircle className="w-4 h-4" />
      case "en_transito":
        return <Truck className="w-4 h-4" />
      case "pendiente":
        return <Clock className="w-4 h-4" />
      case "cancelado":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.codigo_seguimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.direccion_envio.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || shipment.estado_envio === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Gestión de Envíos
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Administra y rastrea todos los envíos de tu tienda</p>
        </div>

        <Tabs defaultValue="shipments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="shipments" className="data-[state=active]:bg-orange-500">
              Envíos
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-orange-500">
              Rastreo
            </TabsTrigger>
            <TabsTrigger value="methods" className="data-[state=active]:bg-orange-500">
              Métodos
            </TabsTrigger>
            <TabsTrigger value="zones" className="data-[state=active]:bg-orange-500">
              Zonas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shipments">
            {/* Filters */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar envíos..."
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
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en_transito">En Tránsito</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Método de Envío" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los métodos</SelectItem>
                      <SelectItem value="servientrega">Servientrega</SelectItem>
                      <SelectItem value="coordinadora">Coordinadora</SelectItem>
                      <SelectItem value="efectivo">Contraentrega</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipments List */}
            <div className="space-y-4">
              {filteredShipments.map((shipment) => (
                <Card
                  key={shipment.id_envio}
                  className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Shipment Info */}
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-white">Envío #{shipment.id_envio}</h3>
                          <Badge
                            className={`${getStatusColor(shipment.estado_envio)} text-white flex items-center gap-1`}
                          >
                            {getStatusIcon(shipment.estado_envio)}
                            {shipment.estado_envio.replace("_", " ")}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Package className="w-4 h-4 text-orange-400" />
                            <span>Pedido #{shipment.id_pedido}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Truck className="w-4 h-4 text-orange-400" />
                            <span>{shipment.metodo_envio}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <MapPin className="w-4 h-4 text-orange-400" />
                            <span>{shipment.direccion_envio}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tracking Info */}
                      <div>
                        <h4 className="text-white font-medium mb-3">Información de Rastreo</h4>
                        <div className="space-y-2 text-sm">
                          <div className="text-gray-300">
                            <span className="text-orange-400">Código:</span> {shipment.codigo_seguimiento}
                          </div>
                          <div className="text-gray-300">
                            <span className="text-orange-400">Enviado:</span> {shipment.fecha_envio}
                          </div>
                          <div className="text-gray-300">
                            <span className="text-orange-400">Estimado:</span> {shipment.fecha_estimada}
                          </div>
                          {shipment.fecha_entrega && (
                            <div className="text-gray-300">
                              <span className="text-green-400">Entregado:</span> {shipment.fecha_entrega}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Package Details */}
                      <div>
                        <h4 className="text-white font-medium mb-3">Detalles del Paquete</h4>
                        <div className="space-y-2 text-sm">
                          <div className="text-gray-300">
                            <span className="text-orange-400">Peso:</span> {shipment.peso}
                          </div>
                          <div className="text-gray-300">
                            <span className="text-orange-400">Dimensiones:</span> {shipment.dimensiones}
                          </div>
                          <div className="text-gray-300">
                            <span className="text-orange-400">Costo:</span> {formatPrice(shipment.costo_envio)}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                          >
                            Rastrear
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
                          >
                            Editar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tracking">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Rastrear Envío</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <Label htmlFor="tracking" className="text-gray-300">
                      Código de Seguimiento
                    </Label>
                    <Input
                      id="tracking"
                      placeholder="Ingresa el código de seguimiento"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    <Search className="w-4 h-4 mr-2" />
                    Rastrear Envío
                  </Button>
                </div>

                {trackingCode && (
                  <div className="mt-8 p-6 bg-slate-700/50 rounded-lg">
                    <h3 className="text-white font-semibold mb-4">Estado del Envío</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="text-white font-medium">Paquete Entregado</div>
                          <div className="text-gray-400 text-sm">2024-11-13 14:30</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="text-white font-medium">En Reparto</div>
                          <div className="text-gray-400 text-sm">2024-11-13 08:00</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <div className="text-white font-medium">En Centro de Distribución</div>
                          <div className="text-gray-400 text-sm">2024-11-12 16:45</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <div>
                          <div className="text-white font-medium">Paquete Despachado</div>
                          <div className="text-gray-400 text-sm">2024-11-10 10:00</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Métodos de Envío</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shippingMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{method.nombre}</h4>
                          <p className="text-gray-400 text-sm">{method.descripcion}</p>
                          <p className="text-orange-400 text-sm">{method.tiempo_estimado}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{formatPrice(method.costo_base)}</div>
                          <Badge className={method.activo ? "bg-green-500" : "bg-red-500"}>
                            {method.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Estadísticas de Envío</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">85%</div>
                      <div className="text-gray-400 text-sm">Entregados</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">10%</div>
                      <div className="text-gray-400 text-sm">En Tránsito</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">5%</div>
                      <div className="text-gray-400 text-sm">Pendientes</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400">3.2</div>
                      <div className="text-gray-400 text-sm">Días Promedio</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="zones">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Zonas de Envío</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Zona 1 - Bogotá</h4>
                    <p className="text-gray-400 text-sm mb-2">Envío local</p>
                    <p className="text-orange-400 font-semibold">{formatPrice(8000)}</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Zona 2 - Cundinamarca</h4>
                    <p className="text-gray-400 text-sm mb-2">Envío regional</p>
                    <p className="text-orange-400 font-semibold">{formatPrice(12000)}</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Zona 3 - Nacional</h4>
                    <p className="text-gray-400 text-sm mb-2">Envío nacional</p>
                    <p className="text-orange-400 font-semibold">{formatPrice(15000)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
