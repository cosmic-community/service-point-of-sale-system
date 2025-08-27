'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, Download, Filter } from 'lucide-react'
import { Sale, Staff, CommissionPayout, SalesFilter, ExpenseFilter } from '@/types'
import { getSales, getStaffMembers, getCommissionPayouts } from '@/lib/cosmic'
import { formatCurrency, formatDate, downloadCSV } from '@/lib/utils'
import SalesChart from '@/components/SalesChart'
import CommissionReport from '@/components/CommissionReport'

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [commissions, setCommissions] = useState<CommissionPayout[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sales' | 'commissions' | 'expenses'>('sales')
  const [salesFilter, setSalesFilter] = useState<SalesFilter>({})
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadData()
  }, [salesFilter])

  const loadData = async () => {
    try {
      const [salesData, staffData, commissionsData] = await Promise.all([
        getSales(salesFilter),
        getStaffMembers(),
        getCommissionPayouts()
      ])
      setSales(salesData)
      setStaff(staffData)
      setCommissions(commissionsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate summary statistics
  const totalSales = sales.reduce((sum, sale) => sum + sale.metadata.total_amount, 0)
  const totalTransactions = sales.length
  const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0
  const totalCommissions = commissions
    .filter(c => c.metadata.status === 'Paid')
    .reduce((sum, c) => sum + c.metadata.commission_amount, 0)

  const exportSalesData = () => {
    const exportData = sales.map(sale => ({
      Date: formatDate(sale.created_at),
      'Receipt Number': sale.metadata.receipt_number || 'N/A',
      Staff: sale.metadata.staff_member?.title || 'N/A',
      'Total Amount': sale.metadata.total_amount,
      'Payment Mode': sale.metadata.payment_mode,
      Status: sale.metadata.status,
      Customer: sale.metadata.customer_info || 'N/A'
    }))
    downloadCSV(exportData, `sales-report-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const exportCommissionsData = () => {
    const exportData = commissions.map(commission => ({
      Staff: commission.metadata.staff_member.title,
      'Period Start': formatDate(commission.metadata.period_start),
      'Period End': formatDate(commission.metadata.period_end),
      'Total Sales': commission.metadata.total_sales,
      'Commission Amount': commission.metadata.commission_amount,
      Status: commission.metadata.status
    }))
    downloadCSV(exportData, `commissions-report-${new Date().toISOString().split('T')[0]}.csv`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-1">Analyze your business performance and trends</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button
            onClick={activeTab === 'sales' ? exportSalesData : exportCommissionsData}
            className="btn-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Sales</p>
              <p className="text-2xl font-semibold text-slate-900">{formatCurrency(totalSales)}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Transactions</p>
              <p className="text-2xl font-semibold text-slate-900">{totalTransactions}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Avg Transaction</p>
              <p className="text-2xl font-semibold text-slate-900">{formatCurrency(averageTransaction)}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-danger-100 rounded-lg">
              <Users className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Commissions Paid</p>
              <p className="text-2xl font-semibold text-slate-900">{formatCurrency(totalCommissions)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                value={salesFilter.start_date || ''}
                onChange={(e) => setSalesFilter({ ...salesFilter, start_date: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                value={salesFilter.end_date || ''}
                onChange={(e) => setSalesFilter({ ...salesFilter, end_date: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Staff</label>
              <select
                value={salesFilter.staff_id || ''}
                onChange={(e) => setSalesFilter({ ...salesFilter, staff_id: e.target.value })}
                className="input"
              >
                <option value="">All Staff</option>
                {staff.map(member => (
                  <option key={member.id} value={member.id}>{member.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Payment Mode</label>
              <select
                value={salesFilter.payment_mode || ''}
                onChange={(e) => setSalesFilter({ ...salesFilter, payment_mode: e.target.value as any })}
                className="input"
              >
                <option value="">All Payment Modes</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Digital">Digital</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={() => setSalesFilter({})}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Report Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('sales')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sales'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Sales Report
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'commissions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Commission Report
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'expenses'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Expense Report
          </button>
        </nav>
      </div>

      {/* Report Content */}
      <div>
        {activeTab === 'sales' && (
          <div className="space-y-6">
            {/* Sales Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales Trend</h3>
              <SalesChart sales={sales} />
            </div>

            {/* Sales Table */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Recent Sales</h3>
                <span className="text-sm text-slate-500">{sales.length} transactions</span>
              </div>
              
              {sales.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No sales data available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Receipt</th>
                        <th>Staff</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {sales.slice(0, 10).map(sale => (
                        <tr key={sale.id}>
                          <td>{formatDate(sale.created_at)}</td>
                          <td className="font-medium">{sale.metadata.receipt_number || 'N/A'}</td>
                          <td>{sale.metadata.staff_member?.title || 'N/A'}</td>
                          <td className="font-semibold">{formatCurrency(sale.metadata.total_amount)}</td>
                          <td>{sale.metadata.payment_mode}</td>
                          <td>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800">
                              {sale.metadata.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'commissions' && (
          <CommissionReport 
            commissions={commissions} 
            staff={staff} 
            sales={sales}
          />
        )}

        {activeTab === 'expenses' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Expense Report</h3>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Expense reporting coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}