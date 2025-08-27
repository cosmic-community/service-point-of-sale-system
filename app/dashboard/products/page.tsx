'use client'

import { useState, useEffect } from 'react'
import { Plus, Package, Tag, DollarSign } from 'lucide-react'
import { Product, ProductCategory, ProductStatus } from '@/types'
import { getProducts, getProductCategories } from '@/lib/cosmic'
import { formatCurrency } from '@/lib/utils'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | ProductStatus>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getProductCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => 
    filter === 'all' ? true : product.metadata.status === filter
  )

  const activeProducts = products.filter(p => p.metadata.status === 'Active')
  const totalValue = activeProducts.reduce((sum, p) => sum + (p.metadata.selling_price * 1), 0)
  const averagePrice = activeProducts.length > 0 
    ? totalValue / activeProducts.length 
    : 0

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
          <h1 className="text-2xl font-bold text-slate-900">Products & Services</h1>
          <p className="text-slate-600 mt-1">Manage your product catalog and pricing</p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Package className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Products</p>
              <p className="text-2xl font-semibold text-slate-900">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg">
              <Package className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Active Products</p>
              <p className="text-2xl font-semibold text-slate-900">{activeProducts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg">
              <Tag className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Categories</p>
              <p className="text-2xl font-semibold text-slate-900">{categories.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-danger-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Avg Price</p>
              <p className="text-2xl font-semibold text-slate-900">{formatCurrency(averagePrice)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Products List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Product Catalog</h2>
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="input"
            >
              <option value="all">All Products</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">
              {filter === 'all' ? 'No products yet' : `No ${filter.toLowerCase()} products`}
            </p>
            <button className="btn-primary">
              Add First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const getStatusBadge = (status: ProductStatus) => {
    const statusClasses = {
      'Active': 'bg-success-100 text-success-800',
      'Inactive': 'bg-slate-100 text-slate-800',
      'Discontinued': 'bg-danger-100 text-danger-800'
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    )
  }

  const profitMargin = product.metadata.selling_price > 0 
    ? ((product.metadata.selling_price - product.metadata.cost_price) / product.metadata.selling_price * 100)
    : 0

  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 mb-1">{product.title}</h3>
          <p className="text-sm text-slate-600 mb-2">{product.metadata.description}</p>
          {product.metadata.category && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {product.metadata.category.title}
            </span>
          )}
        </div>
        {getStatusBadge(product.metadata.status)}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Selling Price:</span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(product.metadata.selling_price)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Cost Price:</span>
          <span className="font-medium text-slate-700">
            {formatCurrency(product.metadata.cost_price)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Margin:</span>
          <span className={`font-medium ${profitMargin > 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {profitMargin.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            SKU: {product.metadata.sku || 'N/A'}
          </span>
          <div className="flex items-center space-x-2">
            <button className="text-slate-400 hover:text-primary-600 text-sm">
              Edit
            </button>
            <button className="text-slate-400 hover:text-danger-600 text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}