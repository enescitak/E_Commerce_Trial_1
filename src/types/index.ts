// Ürün ve envanter tipleri
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  status: 'active' | 'inactive' | 'draft';
  images: string[];
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price?: number;
  compareAtPrice?: number;
  inventory: number;
  lowStockThreshold: number;
  attributes: VariantAttribute[];
  image?: string;
  status: 'active' | 'inactive';
}

export interface VariantAttribute {
  name: string; // örn: "Renk", "Beden"
  value: string; // örn: "Kırmızı", "M"
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface AttributeDefinition {
  id: string;
  name: string; // örn: "Renk", "Beden", "Materyal"
  type: 'color' | 'size' | 'text' | 'number';
  values: string[]; // önceden tanımlı değerler
  required: boolean;
}

// Sipariş tipleri
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
}

// Dashboard ve analitik tipleri
export interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  lowStockProducts: number;
  totalProducts: number;
  recentOrders: Order[];
  topSellingProducts: TopSellingProduct[];
  salesChart: SalesData[];
}

export interface TopSellingProduct {
  productId: string;
  productName: string;
  variantName: string;
  quantitySold: number;
  revenue: number;
  image?: string;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

// Kullanıcı ve yetkilendirme
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin?: Date;
  createdAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: 'products' | 'orders' | 'customers' | 'reports' | 'settings';
}
