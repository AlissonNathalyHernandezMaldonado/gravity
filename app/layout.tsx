import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GRAVITY - ROPA DEPORTIVA",
  description: "TU ENERGIA NUESTRO COMPROMISO!!!",
  icons: {
    icon: "/images/gravity-logo.png",
    apple: "/images/gravity-logo.png",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}