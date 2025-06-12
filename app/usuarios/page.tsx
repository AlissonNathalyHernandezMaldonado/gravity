"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, MapPin, Shield, Edit, Trash2, Plus, Search, Filter, UserCheck, UserX } from "lucide-react"

// Usuarios reales de la base de datos
const users = [
  {
    id_usuario: 1023,
    nombre: "Alisson Nathaly Hernandez Rodriguez",
    correo_usuario: "alissonhernandez@gmail.com",
    direccion_usuario: "carrera 8",
    id_rol: 1,
    nombre_rol: "admin",
    estado: "activo",
    pedidos_totales: 1,
    compras_totales: 718196,
  },
  {
    id_usuario: 1027,
    nombre: "karen liliana",
    correo_usuario: "karen.rivera8887@gmail.com",
    direccion_usuario: "calle 13",
    id_rol: 2,
    nombre_rol: "user",
    estado: "activo",
    pedidos_totales: 0,
    compras_totales: 0,
  },
  {
    id_usuario: 1032,
    nombre: "Carlos Perez",
    correo_usuario: "carlosperez@gmail.com",
    direccion_usuario: "carrera 4 #12-23",
    id_rol: 2,
    nombre_rol: "user",
    estado: "activo",
    pedidos_totales: 0,
    compras_totales: 0,
  },
  {
    id_usuario: 1034,
    nombre: "Nicolas Hernandez",
    correo_usuario: "nicolashernandez123@gmail.com",
    direccion_usuario: "carrera 12 #12-21 sur",
    id_rol: 2,
    nombre_rol: "user",
    estado: "activo",
    pedidos_totales: 0,
    compras_totales: 0,
  },
  {
    id_usuario: 13,
    nombre: "pirazan",
    correo_usuario: "pirazan@gmail.com",
    direccion_usuario: "calle 34",
    id_rol: 2,
    nombre_rol: "user",
    estado: "activo",
    pedidos_totales: 2,
    compras_totales: 20000,
  },
]

const userStats = {
  totalUsuarios: users.length,
  usuariosActivos: users.filter((u) => u.estado === "activo").length,
  administradores: users.filter((u) => u.id_rol === 1).length,
  nuevosEsteMes: 2,
}

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddingUser, setIsAddingUser] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-orange-500"
      case "user":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activo":
        return "bg-green-500"
      case "inactivo":
        return "bg-red-500"
      case "suspendido":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo_usuario.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.nombre_rol === roleFilter
    const matchesStatus = statusFilter === "all" || user.estado === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Usuarios
              </span>
            </h1>
            <p className="text-gray-300 text-lg">Gestiona usuarios, roles y permisos del sistema</p>
          </div>

          <Button
            onClick={() => setIsAddingUser(true)}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Usuarios</p>
                  <p className="text-2xl font-bold text-orange-400">{userStats.totalUsuarios}</p>
                </div>
                <User className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-green-400">{userStats.usuariosActivos}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Administradores</p>
                  <p className="text-2xl font-bold text-yellow-400">{userStats.administradores}</p>
                </div>
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Nuevos Este Mes</p>
                  <p className="text-2xl font-bold text-blue-400">{userStats.nuevosEsteMes}</p>
                </div>
                <UserX className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="users" className="data-[state=active]:bg-orange-500">
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-orange-500">
              Roles
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-orange-500">
              Actividad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            {/* Filters */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los roles</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="user">Usuario</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card
                  key={user.id_usuario}
                  className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{user.nombre}</h3>
                          <p className="text-gray-400 text-sm">ID: {user.id_usuario}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={`${getRoleColor(user.nombre_rol)} text-white`}>{user.nombre_rol}</Badge>
                        <Badge className={`${getStatusColor(user.estado)} text-white`}>{user.estado}</Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Información de Contacto</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Mail className="w-4 h-4 text-orange-400" />
                            <span>{user.correo_usuario}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <MapPin className="w-4 h-4 text-orange-400" />
                            <span>{user.direccion_usuario}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2">Rol y Permisos</h4>
                        <div className="space-y-2 text-sm">
                          <div className="text-gray-300">
                            <span className="text-orange-400">Rol ID:</span> {user.id_rol}
                          </div>
                          <div className="text-gray-300">
                            <span className="text-orange-400">Tipo:</span> {user.nombre_rol}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2">Estadísticas</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-center p-2 bg-slate-700/50 rounded">
                            <div className="text-orange-400 font-semibold">{user.pedidos_totales}</div>
                            <div className="text-gray-400 text-xs">Pedidos</div>
                          </div>
                          <div className="text-center p-2 bg-slate-700/50 rounded">
                            <div className="text-yellow-400 font-semibold">{formatPrice(user.compras_totales)}</div>
                            <div className="text-gray-400 text-xs">Compras</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
                      >
                        Ver Perfil
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roles">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Roles del Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-orange-400" />
                        <div>
                          <h4 className="text-white font-medium">Administrador (ID: 1)</h4>
                          <p className="text-gray-400 text-sm">Acceso completo al sistema</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-500 text-white">
                        {users.filter((u) => u.nombre_rol === "admin").length} usuarios
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-400" />
                        <div>
                          <h4 className="text-white font-medium">Usuario (ID: 2)</h4>
                          <p className="text-gray-400 text-sm">Acceso limitado para compras</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500 text-white">
                        {users.filter((u) => u.nombre_rol === "user").length} usuarios
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Permisos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <h4 className="text-orange-400 font-medium mb-2">Administrador</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Gestionar usuarios</li>
                        <li>• Gestionar productos</li>
                        <li>• Ver reportes</li>
                        <li>• Configurar sistema</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <h4 className="text-blue-400 font-medium mb-2">Usuario</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Realizar compras</li>
                        <li>• Ver historial</li>
                        <li>• Actualizar perfil</li>
                        <li>• Contactar soporte</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white">Alisson Nathaly realizó una compra</p>
                      <p className="text-gray-400 text-sm">Hace 2 horas - $718,196</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white">Nicolas Hernandez se registró</p>
                      <p className="text-gray-400 text-sm">Hace 1 día</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white">Carlos Perez se registró</p>
                      <p className="text-gray-400 text-sm">Hace 2 días</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white">Karen Liliana se registró</p>
                      <p className="text-gray-400 text-sm">Hace 3 días</p>
                    </div>
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
