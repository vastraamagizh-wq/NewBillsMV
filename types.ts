
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  type: 'Regular' | 'Premium' | 'Wholesale' | 'VIP' | 'Corporate';
  discountPercentage: number;
  notes: string;
  registrationDate: string;
  lastPurchaseDate: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  reorderLevel: number;
  lastUpdated: string;
}

export interface BillingItem {
  itemId: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
}

export interface Bill {
  invoiceId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: BillingItem[];
  subtotal: number;
  totalDiscount: number;
  shippingCharges: number;
  grandTotal: number;
  date: string;
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Cancelled';
  billStatus: 'Normal' | 'Hold' | 'Dispatch';
  courierName?: string;
  trackingId?: string;
  shippingAddress: string;
}

export interface AppSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  whatsappMessage: string;
  lastInvoiceNumber: number;
}
