import { Suspense } from 'react'
import { BarChart3, Users, ShoppingCart, DollarSign, TrendingUp, Receipt } from 'lucide-react'
import DashboardStats from '@/components/DashboardStats'
import RecentSales from '@/components/RecentSales'
import QuickActions from '@/components/QuickActions'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome to your Service POS dashboard</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <QuickActions />
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<StatsLoading />}>
        <DashboardStats />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Sales</h2>
            <Receipt className="h-5 w-5 text-slate-400" />
          </div>
          <Suspense fallback={<div className="animate-pulse h-64 bg-slate-200 rounded" />}>
            <RecentSales />
          </Suspense>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Today's Performance */}
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Today's Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <ShoppingCart className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="ml-3 text-slate-600">Transactions</span>
                </div>
                <span className="font-semibold text-slate-900">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-success-100 rounded-lg">
                    <DollarSign className="h-4 w-4 text-success-600" />
                  </div>
                  <span className="ml-3 text-slate-600">Revenue</span>
                </div>
                <span className="font-semibold text-slate-900">$0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-warning-100 rounded-lg">
                    <Users className="h-4 w-4 text-warning-600" />
                  </div>
                  <span className="ml-3 text-slate-600">Active Staff</span>
                </div>
                <span className="font-semibold text-slate-900">0</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/dashboard/pos"
                className="p-3 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors"
              >
                <ShoppingCart className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-primary-700">New Sale</span>
              </a>
              <a
                href="/dashboard/staff"
                className="p-3 bg-success-50 hover:bg-success-100 rounded-lg text-center transition-colors"
              >
                <Users className="h-6 w-6 text-success-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-success-700">Staff</span>
              </a>
              <a
                href="/dashboard/products"
                className="p-3 bg-warning-50 hover:bg-warning-100 rounded-lg text-center transition-colors"
              >
                <BarChart3 className="h-6 w-6 text-warning-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-warning-700">Products</span>
              </a>
              <a
                href="/dashboard/reports"
                className="p-3 bg-danger-50 hover:bg-danger-100 rounded-lg text-center transition-colors"
              >
                <TrendingUp className="h-6 w-6 text-danger-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-danger-700">Reports</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  )
}