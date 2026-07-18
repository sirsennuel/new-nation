export type Currency = 'USD' | 'NGN' | 'KES' | 'ZAR' | 'EUR' | 'GBP';
export type OrderStatus = 'pending' | 'processing' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type FulfillmentStatus = 'unfulfilled' | 'in_progress' | 'fulfilled' | 'failed';
export type PaymentProvider = 'stripe' | 'paypal' | 'apple_pay' | 'google_pay';
export type PaymentStatus = 'pending' | 'requires_action' | 'succeeded' | 'failed' | 'refunded';

export interface Money {
  cents: number;
  currency: Currency;
  formatted: string;
}

export interface AddressInput {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface LineItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export type CartMode = 'guest' | 'user';

export interface ProductVariantOption {
  id: string;
  type: 'color' | 'size' | 'misc';
  name: string;
  value: string;
  printfulId?: string;
  available: boolean;
}

export interface ProductModel {
  id: string;
  printfulId?: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  category: string;
  brand?: string;
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariantOption[];
}

export interface CartItemModel {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product?: ProductModel;
  variant?: ProductVariantOption;
}

export interface CartState {
  mode: CartMode;
  userId?: string;
  sessionId?: string;
  items: CartItemModel[];
}

export interface PrintfulSyncStatus {
  entity: 'products' | 'variants' | 'orders';
  lastSyncAt?: string;
  lastSyncId?: string;
  status: 'idle' | 'syncing' | 'success' | 'error';
  error?: string;
}

export interface CheckoutFormData {
  email: string;
  shipping: AddressInput;
  billingSameAsShipping: boolean;
  billing?: AddressInput;
  shippingMethodId?: string;
  couponCode?: string;
}