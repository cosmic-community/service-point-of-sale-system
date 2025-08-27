'use client'

import { useState, useEffect } from 'react'
import { Plus, Minus, ShoppingCart, X, Receipt, Calculator } from 'lucide-react'
import { Product, Staff, CartItem, ExpenseItem, AttachedExpense, PaymentMode } from '@/types'
import { getProducts, getStaffMembers, getExpenseItems, createSale } from '@/lib/cosmic'
import { formatCurrency, calculateCartTotal, calculateExpenseTotal } from '@/lib/utils'

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [expenses, setExpenses] = useState<AttachedExpense[]>([])
  const [selectedStaff, setSelectedStaff] = useState<string>('')
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash')
  const [amountReceived, setAmountReceived] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [customerInfo, setCustomerInfo] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [showExpenses, setShowExpenses] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, staffData, expenseData] = await Promise.all([
        getProducts(),
        getStaffMembers(),
        getExpenseItems()
      ])
      
      setProducts(productsData.filter(p => p.metadata.status === 'Active'))
      setStaff(staffData.filter(s => s.metadata.status === 'Active'))
      setExpenseItems(expenseData.filter(e => e.metadata.status === 'Active'))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              total_price: (item.quantity + 1) * item.unit_price
            }
          : item
      ))
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        product,
        quantity: 1,
        unit_price: product.metadata.selling_price,
        total_price: product.metadata.selling_price
      }
      setCart([...cart, newItem])
    }
  }

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart(cart.map(item =>
      item.id === itemId
        ? {
            ...item,
            quantity: newQuantity,
            total_price: newQuantity * item.unit_price
          }
        : item
    ))
  }

  const updateCartItemPrice = (itemId: string, newPrice: number) => {
    setCart(cart.map(item =>
      item.id === itemId
        ? {
            ...item,
            unit_price: newPrice,
            total_price: item.quantity * newPrice
          }
        : item
    ))
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const addExpense = (expenseItem: ExpenseItem) => {
    const newExpense: AttachedExpense = {
      id: Date.now().toString(),
      expense_item: expenseItem,
      quantity: 1,
      unit_price: expenseItem.metadata.unit_price,
      total_cost: expenseItem.metadata.unit_price
    }
    setExpenses([...expenses, newExpense])
  }

  const updateExpenseQuantity = (expenseId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeExpense(expenseId)
      return
    }

    setExpenses(expenses.map(expense =>
      expense.id === expenseId
        ? {
            ...expense,
            quantity: newQuantity,
            total_cost: newQuantity * expense.unit_price
          }
        : expense
    ))
  }

  const removeExpense = (expenseId: string) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId))
  }

  const cartTotal = calculateCartTotal(cart)
  const expenseTotal = calculateExpenseTotal(expenses)
  const discountAmount = (cartTotal * discount) / 100
  const finalTotal = cartTotal - discountAmount
  const change = amountReceived - finalTotal

  const handleProcessSale = async () => {
    if (cart.length === 0) {
      alert('Please add items to cart')
      return
    }

    if (amountReceived < finalTotal) {
      alert('Insufficient payment amount')
      return
    }

    setProcessing(true)

    try {
      const saleData = {
        items: cart,
        total_amount: finalTotal,
        discount: discountAmount,
        amount_received: amountReceived,
        payment_mode: paymentMode,
        customer_info: customerInfo,
        staff_member: selectedStaff,
        expenses
      }

      await createSale(saleData)
      
      // Reset form
      setCart([])
      setExpenses([])
      setSelectedStaff('')
      setAmountReceived(0)
      setDiscount(0)
      setCustomerInfo('')
      setShowExpenses(false)
      
      alert('Sale completed successfully!')
    } catch (error) {
      console.error('Error processing sale:', error)
      alert('Error processing sale. Please try again.')
    } finally {
      setProcessing(false)
    }
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
        <h1 className="text-2xl font-bold text-slate-900">Point of Sale</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowExpenses(!showExpenses)}
            className={`btn ${showExpenses ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Calculator className="h-4 w-4 mr-2" />
            {showExpenses ? 'Hide' : 'Show'} Expenses
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Products Grid */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Products & Services</h2>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}

            {/* Expense Items */}
            {showExpenses && (
              <div className="mt-8">
                <h3 className="text-md font-semibold text-slate-900 mb-4">Expense Items</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {expenseItems.map(item => (
                    <ExpenseItemCard
                      key={item.id}
                      item={item}
                      onAddExpense={() => addExpense(item)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cart & Checkout */}
        <div className="space-y-6">
          {/* Cart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Cart</h2>
              <span className="text-sm text-slate-500">{cart.length} items</span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(qty) => updateCartItemQuantity(item.id, qty)}
                    onUpdatePrice={(price) => updateCartItemPrice(item.id, price)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Expenses */}
          {showExpenses && expenses.length > 0 && (
            <div className="card">
              <h3 className="text-md font-semibold text-slate-900 mb-4">Attached Expenses</h3>
              <div className="space-y-3">
                {expenses.map(expense => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onUpdateQuantity={(qty) => updateExpenseQuantity(expense.id, qty)}
                    onRemove={() => removeExpense(expense.id)}
                  />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total Expenses:</span>
                  <span>{formatCurrency(expenseTotal)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Checkout */}
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Checkout</h2>
            
            <div className="space-y-4">
              {/* Staff Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Staff Member
                </label>
                <select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="input"
                >
                  <option value="">Select staff member</option>
                  {staff.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                  className="input"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Digital">Digital</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>

              {/* Customer Info */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Customer Info (Optional)
                </label>
                <textarea
                  value={customerInfo}
                  onChange={(e) => setCustomerInfo(e.target.value)}
                  rows={2}
                  className="input"
                  placeholder="Customer name, phone, etc."
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="input"
                  placeholder="0"
                />
              </div>

              {/* Amount Received */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amount Received
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(Number(e.target.value))}
                  className="input"
                  placeholder="0.00"
                />
              </div>

              {/* Summary */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-warning-600">
                    <span>Discount ({discount}%):</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
                {amountReceived > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Amount Received:</span>
                      <span>{formatCurrency(amountReceived)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Change:</span>
                      <span className={change >= 0 ? 'text-success-600' : 'text-danger-600'}>
                        {formatCurrency(change)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Process Sale Button */}
              <button
                onClick={handleProcessSale}
                disabled={processing || cart.length === 0 || amountReceived < finalTotal}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Receipt className="h-4 w-4 mr-2" />
                {processing ? 'Processing...' : 'Process Sale'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ 
  product, 
  onAddToCart 
}: { 
  product: Product
  onAddToCart: () => void 
}) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
      <h3 className="font-medium text-slate-900 mb-1">{product.title}</h3>
      <p className="text-sm text-slate-600 mb-2">{product.metadata.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-primary-600">
          {formatCurrency(product.metadata.selling_price)}
        </span>
        <button
          onClick={onAddToCart}
          className="btn-primary btn-sm"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </button>
      </div>
    </div>
  )
}

function ExpenseItemCard({ 
  item, 
  onAddExpense 
}: { 
  item: ExpenseItem
  onAddExpense: () => void 
}) {
  return (
    <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
      <h3 className="font-medium text-slate-900 mb-1">{item.title}</h3>
      <p className="text-sm text-slate-600 mb-2">{item.metadata.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-orange-600">
          {formatCurrency(item.metadata.unit_price)}
        </span>
        <button
          onClick={onAddExpense}
          className="btn bg-orange-600 text-white hover:bg-orange-700 btn-sm"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </button>
      </div>
    </div>
  )
}

function CartItemCard({ 
  item, 
  onUpdateQuantity, 
  onUpdatePrice, 
  onRemove 
}: { 
  item: CartItem
  onUpdateQuantity: (qty: number) => void
  onUpdatePrice: (price: number) => void
  onRemove: () => void 
}) {
  return (
    <div className="border border-slate-200 rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-slate-900 text-sm">{item.product.title}</h4>
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-danger-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Qty</label>
          <div className="flex items-center">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="mx-2 font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-slate-500 mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            value={item.unit_price}
            onChange={(e) => onUpdatePrice(Number(e.target.value))}
            className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-slate-500 mb-1">Total</label>
          <span className="font-semibold text-slate-900">
            {formatCurrency(item.total_price)}
          </span>
        </div>
      </div>
    </div>
  )
}

function ExpenseCard({ 
  expense, 
  onUpdateQuantity, 
  onRemove 
}: { 
  expense: AttachedExpense
  onUpdateQuantity: (qty: number) => void
  onRemove: () => void 
}) {
  return (
    <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-slate-900 text-sm">{expense.expense_item.title}</h4>
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-danger-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => onUpdateQuantity(expense.quantity - 1)}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="mx-2 font-medium">{expense.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(expense.quantity + 1)}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
        <span className="font-semibold text-orange-700">
          {formatCurrency(expense.total_cost)}
        </span>
      </div>
    </div>
  )
}