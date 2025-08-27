import Link from 'next/link'
import { BarChart3, Users, ShoppingCart, Receipt, TrendingUp, DollarSign } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary-600" />
              <h1 className="ml-3 text-xl font-semibold text-slate-900">Service POS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/dashboard"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Complete Service
              <span className="text-primary-600 block">Point of Sale</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Manage your service business with comprehensive POS features including staff management, 
              commission tracking, expense management, and detailed reporting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
                Start Selling
              </Link>
              <Link href="/demo" className="btn-secondary text-lg px-8 py-4">
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything You Need to Run Your Service Business
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From point of sale to staff management and commission tracking, 
              our comprehensive system handles all aspects of your service business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShoppingCart className="h-8 w-8 text-primary-600" />}
              title="Point of Sale"
              description="Complete POS interface with cart management, payment processing, and receipt generation."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary-600" />}
              title="Staff Management"
              description="Register staff members with commission percentages and track their performance."
            />
            <FeatureCard
              icon={<DollarSign className="h-8 w-8 text-primary-600" />}
              title="Commission Tracking"
              description="Automated commission calculations and payout management for your staff."
            />
            <FeatureCard
              icon={<Receipt className="h-8 w-8 text-primary-600" />}
              title="Expense Management"
              description="Track service-related expenses with categorization and reporting."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-primary-600" />}
              title="Comprehensive Reports"
              description="Detailed sales reports, staff performance analytics, and expense tracking."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-primary-600" />}
              title="Business Analytics"
              description="Insights into your business performance with charts and key metrics."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of service businesses using our POS system to streamline operations and increase profits.
          </p>
          <Link href="/dashboard" className="btn bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-4">
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BarChart3 className="h-8 w-8 text-primary-400" />
                <h3 className="ml-3 text-xl font-semibold">Service POS</h3>
              </div>
              <p className="text-slate-400">
                The complete point of sale solution for service-based businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Point of Sale</li>
                <li>Staff Management</li>
                <li>Commission Tracking</li>
                <li>Expense Management</li>
                <li>Reporting & Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact Support</li>
                <li>System Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Service POS System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="card text-center">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  )
}