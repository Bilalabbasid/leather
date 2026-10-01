export type CommerceMode = 'd2c' | 'wholesale';

export type Currency = 'GBP' | 'USD' | 'EUR';

export interface Variant {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex?: string | null;
  materialVariation?: string | null;
  priceOverrideInPence?: number | null;
  stockQuantity: number;
  isActive: boolean;
  displayPriority: number;
  productId: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ProductImage {
  id: string;
  url: string;
  publicId?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  position: number;
  isPrimary: boolean;
  productId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayPriority: number;
  isActive: boolean;
  products?: Product[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  styleCode: string;
  description: string;
  craftNotes?: string | null;
  careDetails?: string | null;
  sizeChartImage?: string | null;
  leatherGrade?: string | null;
  material: string;
  colorFamily: string;
  priceInPence: number; // Stored as integer pence (£1,850 = 185000)
  currency: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

  // Merchandising flags
  isTopSelling: boolean;
  isNewArrival: boolean;
  isFeaturedHero: boolean;
  displayPriority: number;

  // SEO Fields
  metaTitle?: string | null;
  metaDescription?: string | null;

  categoryId: string;
  category?: Category;

  images: ProductImage[];
  variants: Variant[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CartItem {
  id: string; // unique item key: variantId
  productId: string;
  product: Product;
  variantId: string;
  variant: Variant;
  quantity: number;
  unitPriceInPence: number;
}

export interface OrderItem {
  id: string;
  orderId?: string;
  productId?: string | null;
  variantId?: string | null;
  title: string;
  sku: string;
  size: string;
  color: string;
  unitPriceInPence: number;
  quantity: number;
  lineTotalInPence: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  customerEmail: string;
  customerName?: string | null;
  shippingAddress?: string | null;
  currency: string;
  subtotalInPence: number;
  shippingInPence: number;
  taxInPence: number;
  discountInPence: number;
  totalInPence: number;
  status: 'PENDING' | 'PAID' | 'DISPATCHED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string | Date;
  updatedAt?: string | Date;
  orderItems?: OrderItem[];
}
