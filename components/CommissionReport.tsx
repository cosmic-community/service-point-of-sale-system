'use client'

import { useMemo } from 'react'
import { DollarSign, TrendingUp, Users } from 'lucide-react'
import { CommissionPayout, Staff, Sale, PayoutStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface CommissionReportProps {
  commissions: CommissionPayout[]
  staff: Staff[]
  sales: Sale[]
}

export default function CommissionReport({ commissions, staff, sales }: CommissionReportProps) {
  const reportData = useMemo(() => {
    // Calculate commission summary by staff
    const staffCommissions = staff.map(member => {
      const memberCommissions = commissions.filter(c => c.metadata.staff_member.id === member.id)
      const memberSales = sales.filter(s => s.metadata.staff_member?.id === member.id)
      
      const totalCommissions = memberCommissions.reduce((sum, c) => sum + c.metadata.commission_amount, 0)
      const paidCommissions = memberCommissions
        .filter(c => c.metadata.status === 'Paid')
        .reduce((sum, c) => sum + c.metadata.commission_amount, 0)
      const pendingCommissions = memberCommissions
        .filter(c => c.metadata.status === 'Pending')
        .reduce((sum, c) => sum + c.metadata.commission_amount, 0)
      
      const totalSales = memberSales.reduce((sum, s) => sum + s.metadata.total_amount, 0)
      
      return {
        staff: member,
        totalCommissions,
        paidCommissions,
        pendingCommissions,
        totalSales,
        salesCount: memberSales.length
      }
    })

    return staffCommissions.filter(data => data.totalSales > 0 || data.totalCommissions > 0)
  }, [commissions, staff, sales])

  const totalPaidCommissions = commissions
    .filter(c => c.metadata.status === 'Paid')
    .reduce((sum, c) => sum + c.metadata.commission_amount, 0)
  
  const totalPendingCommissions = commissions
    .filter(c => c.metadata.status === 'Pending')
    .reduce((sum, c) => sum + c.metadata.commission_amount, 0)

  const getStatusBadge = (status: PayoutStatus) => {
    const statusClasses = {
      'Pending': 'bg-warning-100 text-warning-800',
      'Paid': 'bg-success-100 text-success-800',
      'Cancelled': 'bg-danger-100 text-danger-800'
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Commission Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Paid Commissions</p>
              <p className="text-2xl font-semibold text-slate-900">{formatCurrency(totalPaidCommissions)}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Pending Commissions</p>
              <p className="text-2xl font-semibold text-slate-900">{formatCurrency(totalPendingCommissions)}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Active Staff</p>
              <p className="text-2xl font-semibold text-slate-900">{reportData.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Commission Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Staff Commission Summary</h3>
        
        {reportData.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No commission data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Total Sales</th>
                  <th>Sales Count</th>
                  <th>Commission Rate</th>
                  <th>Total Commissions</th>
                  <th>Paid</th>
                  <th>Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportData.map(data => (
                  <tr key={data.staff.id}>
                    <td>
                      <div>
                        <div className="font-medium text-slate-900">{data.staff.title}</div>
                        <div className="text-sm text-slate-500">{data.staff.metadata.email}</div>
                      </div>
                    </td>
                    <td className="font-semibold">{formatCurrency(data.totalSales)}</td>
                    <td>{data.salesCount}</td>
                    <td>{data.staff.metadata.commission_percentage}%</td>
                    <td className="font-semibold">{formatCurrency(data.totalCommissions)}</td>
                    <td className="text-success-600">{formatCurrency(data.paidCommissions)}</td>
                    <td className="text-warning-600">{formatCurrency(data.pendingCommissions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Commission Payouts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Commission Payouts</h3>
        
        {commissions.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No commission payouts yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Period</th>
                  <th>Total Sales</th>
                  <th>Commission Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {commissions.slice(0, 10).map(payout => (
                  <tr key={payout.id}>
                    <td>
                      <div className="font-medium text-slate-900">
                        {payout.metadata.staff_member.title}
                      </div>
                    </td>
                    <td className="text-sm">
                      {formatDate(payout.metadata.period_start)} - {formatDate(payout.metadata.period_end)}
                    </td>
                    <td className="font-medium">{formatCurrency(payout.metadata.total_sales)}</td>
                    <td className="font-semibold">{formatCurrency(payout.metadata.commission_amount)}</td>
                    <td>{getStatusBadge(payout.metadata.status)}</td>
                    <td className="text-sm text-slate-600">{formatDate(payout.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}