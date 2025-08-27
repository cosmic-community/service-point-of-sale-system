# Service Point of Sale System

![Service POS Preview](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=300&fit=crop&auto=format)

A comprehensive Point of Sale (POS) system designed specifically for service-based businesses. Features complete staff management, service profiling, sales tracking, expense management, and commission calculations.

## Features

- 🔐 **Authentication System** - Secure login with role-based access controls
- 👥 **Staff Management** - Register staff with commission rates and contact information
- 🛍️ **Service Catalog** - Manage product categories and services with pricing
- 🛒 **Point of Sale** - Complete POS interface with cart, payments, and receipts
- 💰 **Expense Tracking** - Categorized expenses with service-specific attachments
- 💳 **Commission System** - Automated staff commission calculations and payouts
- 📊 **Comprehensive Reports** - Sales, staff performance, and expense analytics
- 🖨️ **Receipt Generation** - Professional receipt printing and email capabilities
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices

<!-- CLONE_PROJECT_BUTTON -->

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Develop a Service POS.
Modules to include;
Authentication;
Login
Forgot Password
 2. Register Staff with Commission percentages and contacts.
 3. Register Services Profiling
Product Categories(name).
Product(category,name, selling price, average cost price).
 4. Point of Sale.
select product, quantity, price is autofilled but editable, description and add to cart.
attach other records like amount received, discount, payment mode, customer
Attach any incurred expenses to perform the product by selecting the expense item with qty and price. These can be attached from here or later from the Service Sales Report.
Attach the staff who has performed the service.
Save and print receipt if needed.
 5. Expenses
Expense Categories and Items. (Items have prices as well).
 6. Commission payout module for staff.
 7. Reports.
All reports for captured records.
Sales should have filter by staff, user, service,
Have a staff commission report.
Expenses should have filter by category or item.
 8. The backend will have an super admin system who creates businesses, branches and business admin users only for the now.

Note: You can also add more features if you see that they are required for a perfect point of sales software"

### Code Generation Prompt

> Point of sales system

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content Management**: Cosmic CMS
- **Authentication**: JWT-based authentication
- **Database**: Cosmic CMS as headless database
- **Deployment**: Vercel-ready
- **Icons**: Lucide React
- **Forms**: React Hook Form with validation
- **Charts**: Recharts for analytics

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Cosmic account and bucket
- Environment variables configured

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure environment variables:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetch Staff Members
```typescript
import { cosmic } from '@/lib/cosmic'

const getStaff = async () => {
  try {
    const response = await cosmic.objects
      .find({ type: 'staff' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects
  } catch (error) {
    if (error.status === 404) return []
    throw new Error('Failed to fetch staff')
  }
}
```

### Create Sale Transaction
```typescript
const createSale = async (saleData) => {
  const response = await cosmic.objects.insertOne({
    type: 'sales',
    title: `Sale ${Date.now()}`,
    metadata: {
      items: saleData.items,
      total_amount: saleData.total,
      payment_mode: saleData.paymentMode,
      staff_member: saleData.staffId,
      customer_info: saleData.customer,
      expenses: saleData.expenses || [],
      discount: saleData.discount || 0,
      amount_received: saleData.amountReceived,
      status: 'Completed'
    }
  })
  
  return response.object
}
```

## Cosmic CMS Integration

This application uses Cosmic as a headless CMS with the following object types:

### Staff
- **Title**: Staff member name
- **Metadata**:
  - `commission_percentage`: Number (staff commission rate)
  - `phone`: Text (contact number)
  - `email`: Text (email address)
  - `status`: Select dropdown (Active, Inactive)

### Product Categories
- **Title**: Category name
- **Metadata**:
  - `description`: Text (category description)

### Products/Services
- **Title**: Product/service name
- **Metadata**:
  - `category`: Object (linked to categories)
  - `selling_price`: Number (selling price)
  - `cost_price`: Number (average cost price)
  - `description`: Text (product description)
  - `status`: Select dropdown (Active, Inactive)

### Sales Transactions
- **Title**: Sale reference
- **Metadata**:
  - `items`: JSON (cart items array)
  - `total_amount`: Number (total sale amount)
  - `discount`: Number (discount applied)
  - `amount_received`: Number (amount paid)
  - `payment_mode`: Select dropdown (Cash, Card, Digital)
  - `customer_info`: Text (customer details)
  - `staff_member`: Object (linked to staff)
  - `expenses`: JSON (attached expenses)
  - `status`: Select dropdown (Pending, Completed, Cancelled)

### Expense Categories
- **Title**: Expense category name
- **Metadata**:
  - `description`: Text (category description)

### Expense Items
- **Title**: Expense item name
- **Metadata**:
  - `category`: Object (linked to expense categories)
  - `unit_price`: Number (item price)
  - `description`: Text (item description)

### Commission Payouts
- **Title**: Payout reference
- **Metadata**:
  - `staff_member`: Object (linked to staff)
  - `period_start`: Date (payout period start)
  - `period_end`: Date (payout period end)
  - `total_sales`: Number (total sales in period)
  - `commission_amount`: Number (calculated commission)
  - `status`: Select dropdown (Pending, Paid, Cancelled)

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard:
   - `COSMIC_BUCKET_SLUG`
   - `COSMIC_READ_KEY`
   - `COSMIC_WRITE_KEY`
4. Deploy!

### Environment Variables Setup

In your deployment platform, set:

```env
COSMIC_BUCKET_SLUG=your-bucket-slug-here
COSMIC_READ_KEY=your-cosmic-read-key-here
COSMIC_WRITE_KEY=your-cosmic-write-key-here
```

The application will automatically use these credentials to connect to your Cosmic bucket and manage all POS data, staff records, sales transactions, and reports.
