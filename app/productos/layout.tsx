"use client"

import type React from "react"

import { CartProvider } from "@/context/cart-context"
import { ErrorBoundary } from "@/components/error-boundary"

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <CartProvider>{children}</CartProvider>
    </ErrorBoundary>
  )
}
