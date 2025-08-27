import { BarChart3, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'
import { getSales, getStaffMembers } from '@/lib/cosmic'
import { formatCurrency } from '@/lib/utils'

export default async function DashboardStats() {
  try {
    const [sales, staff] = await Promise.all([
      getSales(),
      getStaffMembers()
    ])

    // Calculate today's sales
    const today = new Date().toDateString()
    const todaySales = sales.filter(sale => 
      new Date(sale.created_at).toDateString() === today
    )

    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.metadata.total_amount, 0)
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.metadata.total_amount, 0)
    const averageTransaction = sales.length > 0 ? totalRevenue / sales.length : 0
    const activeStaff = staff.filter(s => s.metadata.status === 'Active').length

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(todayRevenue)}
          icon={<DollarSign className="h-6 w-6 text-primary-600" />}
          bgColor="bg-primary-100"
          change={`${todaySales.length} transactions`}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<TrendingUp className="h-6 w-6 text-success-600" />}
          bgColor="bg-success-100"
          change={`${sales.length} total sales`}
        />
        <StatCard
          title="Avg Transaction"
          value={formatCurrency(averageTransaction)}
          icon={<ShoppingCart className="h-6 w-6 text-warning-600" />}
          bgColor="bg-warning-100"
          change="Per sale"
        />
        <StatCard
          title="Active Staff"
          value={activeStaff.toString()}
          icon={<BarChart3 className="h-6 w-6 text-danger-600" />}
          bgColor="bg-danger-100"
          change={`${staff.length} total staff`}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading dashboard stats:', error)
    return <StatsError />
  }
}

function StatCard({ 
  title, 
  value, 
  icon, 
  bgColor, 
  change 
}: {
  title: string
  value: string
  icon: React.ReactNode
  bgColor: string
  change: string
}) {
  return (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 ${bgColor} rounded-lg`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{change}</p>
        </div>
      </div>
    </div>
  )
}

function StatsError() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card">
          <div className="flex items-center">
            <div className="p-3 bg-slate-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-slate-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Loading...</p>
              <p className="text-2xl font-semibold text-slate-900">$0.00</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}