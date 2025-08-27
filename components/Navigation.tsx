'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  ShoppingCart, 
  Users, 
  Package, 
  Receipt, 
  TrendingUp, 
  Settings,
  Menu,
  X
} from 'lucide-react'
import { classNames } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Point of Sale', href: '/dashboard/pos', icon: ShoppingCart },
  { name: 'Staff', href: '/dashboard/staff', icon: Users },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Sales', href: '/dashboard/sales', icon: Receipt },
  { name: 'Reports', href: '/dashboard/reports', icon: TrendingUp },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="bg-white p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-slate-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm bg-white border-r border-slate-200">
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-primary-600" />
                <span className="ml-3 text-xl font-semibold text-slate-900">Service POS</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-slate-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 px-4 py-4">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          isActive
                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                            : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                          'group flex items-center px-3 py-2 text-sm font-medium border-l-4 rounded-r-md transition-colors'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={classNames(
                            isActive ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-500',
                            'mr-3 h-5 w-5'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <nav className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200">
        <div className="flex items-center h-16 px-6 border-b border-slate-200">
          <BarChart3 className="h-8 w-8 text-primary-600" />
          <span className="ml-3 text-xl font-semibold text-slate-900">Service POS</span>
        </div>
        
        <div className="px-4 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      isActive
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                      'group flex items-center px-3 py-2 text-sm font-medium border-l-4 rounded-r-md transition-colors'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        isActive ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-500',
                        'mr-3 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        
        {/* User section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-900">Admin User</p>
              <p className="text-xs text-slate-500">admin@servicepos.com</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}