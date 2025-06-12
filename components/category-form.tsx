"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit } from "lucide-react"

interface CategoryFormProps {
  category?: {
    id: number
    nombre: string
    descripcion?: string
    activa: boolean
  }
  onSave: (category: any) => void
  trigger?: React.ReactNode
}

export function CategoryForm({ category, onSave, trigger }: CategoryFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: category?.nombre || "",
    descripcion: category?.descripcion || "",
    activa: category?.activa ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre.trim()) {
      alert("El nombre de la categoría es obligatorio")
      return
    }

    const categoryData = {
      ...category,
      ...formData,
      id: category?.id || Date.now(),
    }

    onSave(categoryData)
    setOpen(false)

    // Mostrar mensaje de éxito
    if (category) {
      alert("Categoría actualizada exitosamente")
    } else {
      alert("Categoría creada exitosamente")
    }

    // Limpiar formulario si es nueva categoría
    if (!category) {
      setFormData({ nombre: "", descripcion: "", activa: true })
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && category) {
      // Recargar datos cuando se abre para editar
      setFormData({
        nombre: category.nombre,
        descripcion: category.descripcion || "",
        activa: category.activa,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Categoría
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            {category ? (
              <>
                <Edit className="w-5 h-5 text-orange-400" />
                Editar Categoría
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-orange-400" />
                Nueva Categoría
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre" className="text-gray-300">
              Nombre de la Categoría *
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Ej: Sudaderas, Chaquetas..."
              required
            />
          </div>
          <div>
            <Label htmlFor="descripcion" className="text-gray-300">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Descripción opcional de la categoría..."
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="activa"
              checked={formData.activa}
              onCheckedChange={(checked) => setFormData({ ...formData, activa: checked })}
            />
            <Label htmlFor="activa" className="text-gray-300">
              Categoría activa
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
              {category ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
