// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Staff member interface
export interface Staff extends CosmicObject {
  type: 'staff';
  metadata: {
    commission_percentage: number;
    phone?: string;
    email?: string;
    status: StaffStatus;
    role?: string;
    hire_date?: string;
  };
}

// Product category interface
export interface ProductCategory extends CosmicObject {
  type: 'product_categories';
  metadata: {
    description?: string;
    status?: CategoryStatus;
  };
}

// Product/Service interface
export interface Product extends CosmicObject {
  type: 'products';
  metadata: {
    category?: ProductCategory;
    selling_price: number;
    cost_price: number;
    description?: string;
    status: ProductStatus;
    sku?: string;
  };
}

// Sales transaction interface
export interface Sale extends CosmicObject {
  type: 'sales';
  metadata: {
    items: CartItem[];
    total_amount: number;
    discount?: number;
    amount_received: number;
    payment_mode: PaymentMode;
    customer_info?: string;
    staff_member?: Staff;
    expenses?: AttachedExpense[];
    status: SaleStatus;
    receipt_number?: string;
    notes?: string;
  };
}

// Expense category interface
export interface ExpenseCategory extends CosmicObject {
  type: 'expense_categories';
  metadata: {
    description?: string;
    status?: CategoryStatus;
  };
}

// Expense item interface
export interface ExpenseItem extends CosmicObject {
  type: 'expense_items';
  metadata: {
    category?: ExpenseCategory;
    unit_price: number;
    description?: string;
    status?: ExpenseStatus;
  };
}

// Commission payout interface
export interface CommissionPayout extends CosmicObject {
  type: 'commission_payouts';
  metadata: {
    staff_member: Staff;
    period_start: string;
    period_end: string;
    total_sales: number;
    commission_amount: number;
    status: PayoutStatus;
    notes?: string;
  };
}

// Business/Branch interface for future super admin functionality
export interface Business extends CosmicObject {
  type: 'businesses';
  metadata: {
    owner_name: string;
    phone?: string;
    email?: string;
    address?: string;
    registration_number?: string;
    status: BusinessStatus;
  };
}

// Type literals for select-dropdown values
export type StaffStatus = 'Active' | 'Inactive' | 'Suspended';
export type CategoryStatus = 'Active' | 'Inactive';
export type ProductStatus = 'Active' | 'Inactive' | 'Discontinued';
export type SaleStatus = 'Pending' | 'Completed' | 'Cancelled' | 'Refunded';
export type PaymentMode = 'Cash' | 'Card' | 'Digital' | 'Bank Transfer' | 'Credit';
export type ExpenseStatus = 'Active' | 'Inactive';
export type PayoutStatus = 'Pending' | 'Paid' | 'Cancelled';
export type BusinessStatus = 'Active' | 'Inactive' | 'Suspended';

// Cart and transaction interfaces
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  description?: string;
}

export interface AttachedExpense {
  id: string;
  expense_item: ExpenseItem;
  quantity: number;
  unit_price: number;
  total_cost: number;
}

// Authentication interfaces
export interface User {
  id: string;
  username: string;
  role: UserRole;
  staff_member?: Staff;
  business?: Business;
}

export type UserRole = 'admin' | 'staff' | 'manager' | 'super_admin';

export interface AuthResponse {
  user: User;
  token: string;
}

// API response interfaces
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Form interfaces
export interface CreateStaffData {
  title: string;
  commission_percentage: number;
  phone?: string;
  email?: string;
  status: StaffStatus;
  role?: string;
}

export interface CreateProductData {
  title: string;
  category?: string;
  selling_price: number;
  cost_price: number;
  description?: string;
  status: ProductStatus;
  sku?: string;
}

export interface CreateSaleData {
  items: CartItem[];
  total_amount: number;
  discount?: number;
  amount_received: number;
  payment_mode: PaymentMode;
  customer_info?: string;
  staff_member?: string;
  expenses?: AttachedExpense[];
  notes?: string;
}

// Report interfaces
export interface SalesReportData {
  total_sales: number;
  total_transactions: number;
  average_transaction: number;
  top_products: {
    product: Product;
    quantity_sold: number;
    total_revenue: number;
  }[];
  sales_by_staff: {
    staff: Staff;
    total_sales: number;
    commission_earned: number;
  }[];
  daily_sales: {
    date: string;
    sales: number;
    transactions: number;
  }[];
}

export interface ExpenseReportData {
  total_expenses: number;
  expenses_by_category: {
    category: ExpenseCategory;
    total_amount: number;
    item_count: number;
  }[];
  expenses_by_item: {
    item: ExpenseItem;
    quantity_used: number;
    total_cost: number;
  }[];
}

export interface CommissionReportData {
  staff_member: Staff;
  period_start: string;
  period_end: string;
  total_sales: number;
  commission_percentage: number;
  commission_amount: number;
  transaction_count: number;
  average_sale: number;
}

// Filter interfaces for reports
export interface SalesFilter {
  start_date?: string;
  end_date?: string;
  staff_id?: string;
  product_id?: string;
  payment_mode?: PaymentMode;
  status?: SaleStatus;
}

export interface ExpenseFilter {
  start_date?: string;
  end_date?: string;
  category_id?: string;
  item_id?: string;
}

export interface CommissionFilter {
  staff_id?: string;
  period_start?: string;
  period_end?: string;
  status?: PayoutStatus;
}

// Utility types
export type OptionalMetadata<T extends CosmicObject> = Partial<T['metadata']>;
export type CreateObjectData<T extends CosmicObject> = Omit<T, 'id' | 'created_at' | 'modified_at' | 'slug'>;

// Type guards
export function isStaff(obj: CosmicObject): obj is Staff {
  return obj.type === 'staff';
}

export function isProduct(obj: CosmicObject): obj is Product {
  return obj.type === 'products';
}

export function isSale(obj: CosmicObject): obj is Sale {
  return obj.type === 'sales';
}

export function isExpenseItem(obj: CosmicObject): obj is ExpenseItem {
  return obj.type === 'expense_items';
}

export function isCommissionPayout(obj: CosmicObject): obj is CommissionPayout {
  return obj.type === 'commission_payouts';
}