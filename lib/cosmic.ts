import { createBucketClient } from '@cosmicjs/sdk'
import { 
  Staff, 
  Product, 
  ProductCategory, 
  Sale, 
  ExpenseItem, 
  ExpenseCategory,
  CommissionPayout,
  Business,
  CreateStaffData,
  CreateProductData,
  CreateSaleData,
  SalesFilter,
  ExpenseFilter,
  CommissionFilter
} from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Staff management functions
export async function getStaffMembers(): Promise<Staff[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'staff' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const staff = response.objects as Staff[];
    return staff.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch staff members');
  }
}

export async function createStaff(data: CreateStaffData): Promise<Staff> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'staff',
      title: data.title,
      metadata: {
        commission_percentage: data.commission_percentage,
        phone: data.phone || '',
        email: data.email || '',
        status: data.status,
        role: data.role || 'staff',
        hire_date: new Date().toISOString().split('T')[0]
      }
    });
    
    return response.object as Staff;
  } catch (error) {
    console.error('Error creating staff:', error);
    throw new Error('Failed to create staff member');
  }
}

export async function updateStaff(id: string, data: Partial<CreateStaffData>): Promise<Staff> {
  try {
    const updateData: Record<string, any> = {};
    
    if (data.title) updateData.title = data.title;
    if (data.commission_percentage !== undefined) {
      updateData.metadata = { commission_percentage: data.commission_percentage };
    }
    if (data.phone !== undefined) {
      updateData.metadata = { ...updateData.metadata, phone: data.phone };
    }
    if (data.email !== undefined) {
      updateData.metadata = { ...updateData.metadata, email: data.email };
    }
    if (data.status) {
      updateData.metadata = { ...updateData.metadata, status: data.status };
    }
    
    const response = await cosmic.objects.updateOne(id, updateData);
    return response.object as Staff;
  } catch (error) {
    console.error('Error updating staff:', error);
    throw new Error('Failed to update staff member');
  }
}

// Product management functions
export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'product_categories' })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.objects as ProductCategory[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch product categories');
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'products' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Product[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch products');
  }
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'products',
      title: data.title,
      metadata: {
        category: data.category || '',
        selling_price: data.selling_price,
        cost_price: data.cost_price,
        description: data.description || '',
        status: data.status,
        sku: data.sku || ''
      }
    });
    
    return response.object as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

// Sales management functions
export async function getSales(filter?: SalesFilter): Promise<Sale[]> {
  try {
    let query: Record<string, any> = { type: 'sales' };
    
    // Apply filters if provided
    if (filter?.staff_id) {
      query['metadata.staff_member'] = filter.staff_id;
    }
    if (filter?.status) {
      query['metadata.status'] = filter.status;
    }
    if (filter?.payment_mode) {
      query['metadata.payment_mode'] = filter.payment_mode;
    }
    
    const response = await cosmic.objects
      .find(query)
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    const sales = response.objects as Sale[];
    
    // Sort by newest first
    return sales.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch sales');
  }
}

export async function createSale(data: CreateSaleData): Promise<Sale> {
  try {
    const receiptNumber = `RCP-${Date.now()}`;
    
    const response = await cosmic.objects.insertOne({
      type: 'sales',
      title: `Sale ${receiptNumber}`,
      metadata: {
        items: data.items,
        total_amount: data.total_amount,
        discount: data.discount || 0,
        amount_received: data.amount_received,
        payment_mode: data.payment_mode,
        customer_info: data.customer_info || '',
        staff_member: data.staff_member || '',
        expenses: data.expenses || [],
        status: 'Completed',
        receipt_number: receiptNumber,
        notes: data.notes || ''
      }
    });
    
    return response.object as Sale;
  } catch (error) {
    console.error('Error creating sale:', error);
    throw new Error('Failed to create sale');
  }
}

// Expense management functions
export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'expense_categories' })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.objects as ExpenseCategory[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch expense categories');
  }
}

export async function getExpenseItems(): Promise<ExpenseItem[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'expense_items' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as ExpenseItem[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch expense items');
  }
}

// Commission management functions
export async function getCommissionPayouts(filter?: CommissionFilter): Promise<CommissionPayout[]> {
  try {
    let query: Record<string, any> = { type: 'commission_payouts' };
    
    if (filter?.staff_id) {
      query['metadata.staff_member'] = filter.staff_id;
    }
    if (filter?.status) {
      query['metadata.status'] = filter.status;
    }
    
    const response = await cosmic.objects
      .find(query)
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    const payouts = response.objects as CommissionPayout[];
    
    return payouts.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch commission payouts');
  }
}

export async function calculateStaffCommission(
  staffId: string, 
  periodStart: string, 
  periodEnd: string
): Promise<{ totalSales: number; commissionAmount: number }> {
  try {
    // Get staff member for commission percentage
    const staffResponse = await cosmic.objects
      .findOne({ type: 'staff', id: staffId })
      .props(['id', 'title', 'metadata']);
    
    if (!staffResponse.object) {
      throw new Error('Staff member not found');
    }
    
    const staff = staffResponse.object as Staff;
    
    // Get all sales for this staff member in the period
    const salesResponse = await cosmic.objects
      .find({ 
        type: 'sales',
        'metadata.staff_member': staffId
      })
      .props(['id', 'metadata', 'created_at'])
      .depth(1);
    
    const sales = salesResponse.objects as Sale[];
    
    // Filter sales by date range
    const periodSales = sales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      const startDate = new Date(periodStart);
      const endDate = new Date(periodEnd);
      return saleDate >= startDate && saleDate <= endDate;
    });
    
    const totalSales = periodSales.reduce((sum, sale) => sum + sale.metadata.total_amount, 0);
    const commissionAmount = (totalSales * staff.metadata.commission_percentage) / 100;
    
    return { totalSales, commissionAmount };
  } catch (error) {
    console.error('Error calculating commission:', error);
    throw new Error('Failed to calculate commission');
  }
}

export async function createCommissionPayout(
  staffId: string,
  periodStart: string,
  periodEnd: string
): Promise<CommissionPayout> {
  try {
    const { totalSales, commissionAmount } = await calculateStaffCommission(staffId, periodStart, periodEnd);
    
    const response = await cosmic.objects.insertOne({
      type: 'commission_payouts',
      title: `Commission Payout ${Date.now()}`,
      metadata: {
        staff_member: staffId,
        period_start: periodStart,
        period_end: periodEnd,
        total_sales: totalSales,
        commission_amount: commissionAmount,
        status: 'Pending'
      }
    });
    
    return response.object as CommissionPayout;
  } catch (error) {
    console.error('Error creating commission payout:', error);
    throw new Error('Failed to create commission payout');
  }
}

export async function updateCommissionPayoutStatus(
  id: string, 
  status: 'Pending' | 'Paid' | 'Cancelled'
): Promise<CommissionPayout> {
  try {
    const response = await cosmic.objects.updateOne(id, {
      metadata: { status }
    });
    
    return response.object as CommissionPayout;
  } catch (error) {
    console.error('Error updating payout status:', error);
    throw new Error('Failed to update payout status');
  }
}

// Utility function to get sale by ID
export async function getSaleById(id: string): Promise<Sale | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'sales', id })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    if (!response.object) {
      return null;
    }
    
    return response.object as Sale;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Utility function to get staff by ID
export async function getStaffById(id: string): Promise<Staff | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'staff', id })
      .props(['id', 'title', 'slug', 'metadata']);
    
    if (!response.object) {
      return null;
    }
    
    return response.object as Staff;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}