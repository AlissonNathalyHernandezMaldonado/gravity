"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import type { Product } from "@/lib/products-service"

interface DeleteProductDialogProps {
  product: Product | null
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteProductDialog({ product, open, onClose, onConfirm }: DeleteProductDialogProps) {
  if (!open || !product) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">¿Eliminar producto?</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400">
            Esta acción no se puede deshacer. El producto "{product.nombre_producto}" será eliminado permanentemente.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} className="border-slate-600 text-gray-300 hover:bg-slate-700">
              Cancelar
            </Button>
            <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white">
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
