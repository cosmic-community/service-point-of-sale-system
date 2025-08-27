import { Receipt, ExternalLink } from 'lucide-react'
import { getSales } from '@/lib/cosmic'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default async function RecentSales() {
  try {
    const sales = await getSales()
    const recentSales = sales.slice(0, 5)

    if (recentSales.length === 0) {
      return (
        <div className="text-center py-8">
          <Receipt className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No sales yet</p>
          <p className="text-sm text-slate-400 mt-1">Sales will appear here once you start making transactions</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {recentSales.map(sale => (
          <div key={sale.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Receipt className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {sale.metadata.receipt_number || `Sale ${sale.id.slice(0, 8)}`}
                </p>
                <p className="text-sm text-slate-600">
                  {sale.metadata.staff_member?.title || 'No staff'} • {formatDateTime(sale.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-semibold text-slate-900">
                  {formatCurrency(sale.metadata.total_amount)}
                </p>
                <p className="text-sm text-slate-600">
                  {sale.metadata.payment_mode}
                </p>
              </div>
              <button className="text-slate-400 hover:text-primary-600">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-4">
          <a
            href="/dashboard/sales"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all sales →
          </a>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading recent sales:', error)
    return (
      <div className="text-center py-8">
        <Receipt className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Error loading sales</p>
        <p className="text-sm text-slate-400 mt-1">Please try refreshing the page</p>
      </div>
    )
  }
}