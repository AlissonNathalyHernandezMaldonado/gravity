"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 border border-red-500/50 rounded-lg p-6 max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-red-400 mb-4">¡Oops! Algo salió mal</h2>
        <p className="text-gray-300 mb-4">Ha ocurrido un error inesperado. Por favor, intenta de nuevo.</p>
        <div className="space-y-2">
          <Button
            onClick={reset}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          >
            Intentar de nuevo
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="w-full border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
          >
            Ir al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}
