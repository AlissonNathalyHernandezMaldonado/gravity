"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, AlertTriangle, DollarSign } from "lucide-react"

interface Stats {
  totalProducts: number
  totalCategories: number
  totalStock: number
  lowStockProducts: number
}

export function StatsDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    totalStock: 0,
    lowStockProducts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Productos",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Categorías",
      value: stats.totalCategories,
      icon: ShoppingCart,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Stock Bajo",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Stock Total",
      value: stats.totalStock,
      icon: DollarSign,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-slate-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
