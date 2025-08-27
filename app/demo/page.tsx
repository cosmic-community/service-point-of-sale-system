import Link from 'next/link'
import { ArrowLeft, Play, BarChart3 } from 'lucide-react'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/"
            className="flex items-center text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Demo Content */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-100 rounded-full">
              <Play className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Service POS Demo
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore the features of our comprehensive point of sale system designed specifically 
            for service-based businesses.
          </p>
        </div>

        {/* Demo Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <DemoFeature
            title="Point of Sale Interface"
            description="Experience our intuitive POS system with cart management, payment processing, and receipt generation."
            features={[
              'Product selection and cart management',
              'Editable pricing and quantities',
              'Multiple payment modes',
              'Expense attachment to sales',
              'Staff assignment',
              'Receipt generation'
            ]}
          />

          <DemoFeature
            title="Staff Management"
            description="Manage your team with comprehensive staff profiles and commission tracking."
            features={[
              'Staff registration with contact info',
              'Commission percentage settings',
              'Role-based access controls',
              'Performance tracking',
              'Status management',
              'Contact information storage'
            ]}
          />

          <DemoFeature
            title="Reporting & Analytics"
            description="Gain insights into your business with detailed reports and analytics."
            features={[
              'Sales reports with filtering',
              'Staff performance analytics',
              'Commission calculations',
              'Expense tracking',
              'Revenue trends',
              'Export capabilities'
            ]}
          />
        </div>

        {/* Interactive Demo */}
        <div className="card text-center">
          <BarChart3 className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to Try It Yourself?
          </h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Access the full demo dashboard to explore all features. No registration required - 
            simply use any username and password to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/login"
              className="btn-primary text-lg px-8 py-3"
            >
              Access Demo Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="btn-secondary text-lg px-8 py-3"
            >
              View Dashboard Directly
            </Link>
          </div>
        </div>

        {/* Demo Notes */}
        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-3">Demo Notes</h3>
          <ul className="space-y-2 text-primary-700">
            <li>• All data in this demo is for demonstration purposes only</li>
            <li>• No real transactions or payments are processed</li>
            <li>• Data may be reset periodically to maintain demo quality</li>
            <li>• Full functionality is available including reports and analytics</li>
            <li>• The system is designed to handle real business operations</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function DemoFeature({ 
  title, 
  description, 
  features 
}: { 
  title: string
  description: string
  features: string[] 
}) {
  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
            <span className="text-sm text-slate-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}