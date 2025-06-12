"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800/50 border border-red-500/50 rounded-lg p-6 max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-red-400 mb-4">¡Oops! Algo salió mal</h2>
            <p className="text-gray-300 mb-4">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </p>
            {this.state.error && (
              <details className="text-left mb-4">
                <summary className="text-gray-400 cursor-pointer">Detalles del error</summary>
                <pre className="text-xs text-red-300 mt-2 overflow-auto">{this.state.error.message}</pre>
              </details>
            )}
            <div className="space-y-2">
              <Button
                onClick={this.resetError}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              >
                Intentar de nuevo
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
              >
                Recargar página
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
