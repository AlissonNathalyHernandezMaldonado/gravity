"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, X, Plus, Trash } from "lucide-react"
import Image from "next/image"
import type { Product, Category } from "@/lib/products-service"

interface ProductFormProps {
  product?: Product
  categories: Category[]
  onSubmit: (data: any, details: any[]) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function ProductForm({ product, categories, onSubmit, onCancel, loading = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    precio_producto: 0,
    id_categoria: 0,
    img: "img/placeholder.png",
  })

  const [details, setDetails] = useState<any[]>([])
  const [newDetail, setNewDetail] = useState({
    stock: 1,
    marca: "",
    talla: "",
    color: "",
  })

  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    if (product) {
      setFormData({
        nombre_producto: product.nombre_producto,
        descripcion_producto: product.descripcion_producto,
        precio_producto: Number(product.precio_producto),
        id_categoria: product.id_categoria,
        img: product.img,
      })
      setImagePreview(`/${product.img}`)

      if (product.detalles && product.detalles.length > 0) {
        setDetails(
          product.detalles.map((detail) => ({
            ...detail,
            isExisting: true,
          })),
        )
      }
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData, details)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Actualizar preview de imagen
    if (field === "img") {
      setImagePreview(`/${value}`)
    }
  }

  const handleDetailChange = (index: number, field: string, value: any) => {
    const newDetails = [...details]
    newDetails[index] = { ...newDetails[index], [field]: value }
    setDetails(newDetails)
  }

  const handleNewDetailChange = (field: string, value: any) => {
    setNewDetail((prev) => ({ ...prev, [field]: value }))
  }

  const addDetail = () => {
    if (newDetail.talla && newDetail.color) {
      setDetails([...details, { ...newDetail, isNew: true }])
      setNewDetail({
        stock: 1,
        marca: newDetail.marca, // Mantener la marca para facilitar la entrada de datos
        talla: "",
        color: "",
      })
    }
  }

  const removeDetail = (index: number) => {
    const newDetails = [...details]
    newDetails.splice(index, 1)
    setDetails(newDetails)
  }

  const tallas = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42"]

  return (
    <Card className="bg-slate-800/50 border-orange-500/20">
      <CardHeader>
        <CardTitle className="text-orange-400">{product ? "Editar Producto" : "Nuevo Producto"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda - Formulario */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_producto" className="text-gray-300">
                    Nombre
                  </Label>
                  <Input
                    id="nombre_producto"
                    value={formData.nombre_producto}
                    onChange={(e) => handleChange("nombre_producto", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_categoria" className="text-gray-300">
                    Categoría
                  </Label>
                  <select
                    value={formData.id_categoria}
                    onChange={(e) => handleChange("id_categoria", Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((category) => (
                      <option key={category.id_categoria} value={category.id_categoria}>
                        {category.nombre_categoria}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precio_producto" className="text-gray-300">
                    Precio ($)
                  </Label>
                  <Input
                    id="precio_producto"
                    type="number"
                    value={formData.precio_producto}
                    onChange={(e) => handleChange("precio_producto", Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="img" className="text-gray-300">
                    Ruta de Imagen
                  </Label>
                  <Input
                    id="img"
                    value={formData.img}
                    onChange={(e) => handleChange("img", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="img/producto.png"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion_producto" className="text-gray-300">
                  Descripción
                </Label>
                <textarea
                  id="descripcion_producto"
                  value={formData.descripcion_producto}
                  onChange={(e) => handleChange("descripcion_producto", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px] resize-vertical"
                  required
                />
              </div>

              {/* Detalles del producto */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-300 text-lg">Detalles del Producto</Label>
                </div>

                {/* Lista de detalles existentes */}
                {details.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2 text-sm text-gray-400 border-b border-slate-700 pb-2">
                      <div>Talla</div>
                      <div>Color</div>
                      <div>Marca</div>
                      <div>Stock</div>
                      <div></div>
                    </div>
                    {details.map((detail, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 items-center">
                        <Input
                          value={detail.talla}
                          onChange={(e) => handleDetailChange(index, "talla", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Input
                          value={detail.color}
                          onChange={(e) => handleDetailChange(index, "color", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Input
                          value={detail.marca}
                          onChange={(e) => handleDetailChange(index, "marca", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Input
                          type="number"
                          value={detail.stock}
                          onChange={(e) => handleDetailChange(index, "stock", Number(e.target.value))}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeDetail(index)}
                          className="w-8 h-8 p-0"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulario para agregar nuevo detalle */}
                <div className="bg-slate-700/50 p-4 rounded-md space-y-4">
                  <h4 className="text-sm font-medium text-gray-300">Agregar nuevo detalle</h4>
                  <div className="grid grid-cols-5 gap-2 items-end">
                    <div>
                      <Label htmlFor="talla" className="text-xs text-gray-400">
                        Talla
                      </Label>
                      <select
                        id="talla"
                        value={newDetail.talla}
                        onChange={(e) => handleNewDetailChange("talla", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Seleccionar</option>
                        {tallas.map((talla) => (
                          <option key={talla} value={talla.toLowerCase()}>
                            {talla}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="color" className="text-xs text-gray-400">
                        Color
                      </Label>
                      <Input
                        id="color"
                        value={newDetail.color}
                        onChange={(e) => handleNewDetailChange("color", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="negro"
                      />
                    </div>
                    <div>
                      <Label htmlFor="marca" className="text-xs text-gray-400">
                        Marca
                      </Label>
                      <Input
                        id="marca"
                        value={newDetail.marca}
                        onChange={(e) => handleNewDetailChange("marca", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="nike"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock" className="text-xs text-gray-400">
                        Stock
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newDetail.stock}
                        onChange={(e) => handleNewDetailChange("stock", Number(e.target.value))}
                        className="bg-slate-700 border-slate-600 text-white"
                        min="1"
                      />
                    </div>
                    <Button type="button" onClick={addDetail} className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Preview de imagen */}
            <div className="space-y-4">
              <Label className="text-gray-300">Vista previa</Label>
              <div className="bg-slate-700 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                {imagePreview ? (
                  <div className="w-full max-w-sm">
                    <div className="relative w-full h-64">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Vista previa"
                        fill
                        className="object-contain rounded-lg"
                        onError={() => setImagePreview("")}
                      />
                    </div>
                    <div className="mt-2 p-2 bg-slate-800 rounded text-xs text-gray-400">
                      <p className="font-semibold text-white">{formData.nombre_producto || "Nombre del producto"}</p>
                      <p className="text-orange-400">${formData.precio_producto.toLocaleString() || "0"}</p>
                      <p className="text-yellow-400">
                        {categories.find((c) => c.id_categoria === formData.id_categoria)?.nombre_categoria ||
                          "Categoría"}
                      </p>
                      <p className="mt-1 text-gray-500 text-xs">{formData.img}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Ingresa una ruta de imagen válida para ver la vista previa</p>
                  </div>
                )}
              </div>

              {/* Información de detalles */}
              {details.length > 0 && (
                <div className="bg-slate-700/50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Resumen de detalles</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {details.map((detail, index) => (
                      <div key={index} className="bg-slate-800 p-2 rounded text-xs">
                        <span className="text-orange-400 font-medium">Talla {detail.talla.toUpperCase()}</span>
                        <span className="text-gray-400 block">Color: {detail.color}</span>
                        <span className="text-gray-400 block">Stock: {detail.stock}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Total de variantes: {details.length} | Stock total:{" "}
                    {details.reduce((sum, d) => sum + Number(d.stock), 0)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
