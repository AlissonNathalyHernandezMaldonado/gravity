"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Building } from "lucide-react"

interface ProviderFormProps {
  provider?: {
    id: number
    nombre: string
    contacto: string
    telefono?: string
    direccion?: string
    activo: boolean
  }
  onSave: (provider: any) => void
  trigger?: React.ReactNode
}

export function ProviderForm({ provider, onSave, trigger }: ProviderFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: provider?.nombre || "",
    contacto: provider?.contacto || "",
    telefono: provider?.telefono || "",
    direccion: provider?.direccion || "",
    activo: provider?.activo ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre.trim()) {
      alert("El nombre del proveedor es obligatorio")
      return
    }

    if (!formData.contacto.trim()) {
      alert("El contacto del proveedor es obligatorio")
      return
    }

    const providerData = {
      ...provider,
      ...formData,
      id: provider?.id || Date.now(),
      productos: provider?.productos || 0,
    }

    onSave(providerData)
    setOpen(false)

    // Mostrar mensaje de éxito
    if (provider) {
      alert("Proveedor actualizado exitosamente")
    } else {
      alert("Proveedor creado exitosamente")
    }

    // Limpiar formulario si es nuevo proveedor
    if (!provider) {
      setFormData({ nombre: "", contacto: "", telefono: "", direccion: "", activo: true })
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && provider) {
      // Recargar datos cuando se abre para editar
      setFormData({
        nombre: provider.nombre,
        contacto: provider.contacto,
        telefono: provider.telefono || "",
        direccion: provider.direccion || "",
        activo: provider.activo,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proveedor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            {provider ? (
              <>
                <Edit className="w-5 h-5 text-orange-400" />
                Editar Proveedor
              </>
            ) : (
              <>
                <Building className="w-5 h-5 text-orange-400" />
                Nuevo Proveedor
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre" className="text-gray-300">
              Nombre del Proveedor *
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Ej: Nike Colombia, Adidas..."
              required
            />
          </div>
          <div>
            <Label htmlFor="contacto" className="text-gray-300">
              Email de Contacto *
            </Label>
            <Input
              id="contacto"
              type="email"
              value={formData.contacto}
              onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="contacto@proveedor.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="telefono" className="text-gray-300">
              Teléfono
            </Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Ej: +57 300 123 4567"
            />
          </div>
          <div>
            <Label htmlFor="direccion" className="text-gray-300">
              Dirección
            </Label>
            <Textarea
              id="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Dirección del proveedor..."
              rows={2}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={formData.activo}
              onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
            />
            <Label htmlFor="activo" className="text-gray-300">
              Proveedor activo
            </Label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              {provider ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
