"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Send } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para suscribir al newsletter
    setIsSubscribed(true)
    setEmail("")
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,107,53,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,212,63,0.1),transparent_50%)]" />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Únete a Gravity
              </span>
            </h2>

            <p className="text-gray-300 text-lg mb-8">
              Sé el primero en conocer nuestras nuevas colecciones, ofertas exclusivas y tendencias de moda urbana
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-orange-500"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-6 whitespace-nowrap"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Suscribirse
                </Button>
              </form>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-green-400 font-semibold">¡Gracias por suscribirte! 🎉</p>
                <p className="text-gray-300 text-sm mt-1">Pronto recibirás nuestras novedades</p>
              </div>
            )}

            <p className="text-gray-400 text-sm mt-4">
              No spam, solo contenido de calidad. Puedes cancelar en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
