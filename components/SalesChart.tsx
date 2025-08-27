'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Sale } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface SalesChartProps {
  sales: Sale[]
}

export default function SalesChart({ sales }: SalesChartProps) {
  const chartData = useMemo(() => {
    // Group sales by date
    const salesByDate: Record<string, number> = {}
    
    sales.forEach(sale => {
      const dateStr = new Date(sale.created_at).toISOString().split('T')[0]
      if (dateStr) {
        salesByDate[dateStr] = (salesByDate[dateStr] || 0) + sale.metadata.total_amount
      }
    })

    // Convert to chart format and sort by date
    const data = Object.entries(salesByDate)
      .map(([date, amount]) => ({
        date,
        amount,
        formattedDate: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30) // Last 30 days

    return data
  }, [sales])

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        No sales data available for chart
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }}
            interval={Math.ceil(chartData.length / 10)}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), 'Sales']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Bar 
            dataKey="amount" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}