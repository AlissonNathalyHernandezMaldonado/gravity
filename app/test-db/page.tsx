"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestDBPage() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult("")

    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()

      if (response.ok) {
        setResult(`✅ Conexión exitosa: ${JSON.stringify(data, null, 2)}`)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Error de conexión: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Prueba de Conexión a Base de Datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={testConnection}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              {loading ? "Probando..." : "Probar Conexión"}
            </Button>

            {result && (
              <div className="bg-slate-700 p-4 rounded-md">
                <pre className="text-white text-sm whitespace-pre-wrap">{result}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
