'use client'

import Link from 'next/link'
import { ShoppingCart, Users, Package, Plus } from 'lucide-react'

export default function QuickActions() {
  return (
    <div className="flex items-center space-x-3">
      <Link
        href="/dashboard/pos"
        className="btn-primary"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        New Sale
      </Link>
      
      <div className="relative">
        <select 
          className="appearance-none btn-secondary pr-8"
          onChange={(e) => {
            if (e.target.value) {
              window.location.href = e.target.value
            }
          }}
        >
          <option value="">Quick Add</option>
          <option value="/dashboard/staff?action=add">Add Staff</option>
          <option value="/dashboard/products?action=add">Add Product</option>
          <option value="/dashboard/expenses?action=add">Add Expense</option>
        </select>
        <Plus className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  )
}