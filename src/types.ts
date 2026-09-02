export type CategoryId = 'wheat' | 'millet' | 'single-grain' | 'multigrain' | 'specialty' | string;

export interface Category {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  iconName: string;
  itemCount?: number;
}

export interface PackSizeOption {
  size: string; // e.g. "500 g", "1 kg", "2 kg", "5 kg", "10 kg"
  weightInKg: number;
  price: number; // in INR
  originalPrice?: number;
  sku: string;
  isPopular?: boolean;
}

export interface NutritionFact {
  label: string;
  amount: string;
  dailyValue?: string;
}

export interface GrainIngredient {
  name: string;
  percentage?: number;
  benefit: string;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  slug: string;
  sku: string;
  category: CategoryId;
  grainType: string;
  shortDescription: string;
  longDescription: string;
  images: string[];
  packSizes: PackSizeOption[];
  ingredients: GrainIngredient[];
  preparationTimeDays: number; // e.g. 1-2 days
  shelfLife: string; // e.g. "30-45 days from milling date"
  storageInstructions: string;
  nutritionFacts: NutritionFact[];
  suitableFor: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  dailyCapacityKg?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  category: CategoryId;
  selectedPackSize: PackSizeOption;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  preparationTimeDays: number;
}

export type OrderStatus =
  | 'Received'
  | 'Preparing'
  | 'Packed'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export type PageView =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'track-order'
  | 'about'
  | 'why-shivaay'
  | 'grain-guide'
  | 'article-detail'
  | 'contact'
  | 'policies'
  | 'admin'
  | 'banner-studio'
  | 'account';

export type PaymentMethod = 'razorpay' | 'upi' | 'card' | 'netbanking' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cash_on_delivery';

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Office' | 'Farm' | 'Other' | string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  areaLocality?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addresses: SavedAddress[];
  dietaryPreferences: string[];
  favoriteProductIds?: string[];
  totalGrainMilledKg?: number;
  loyaltyTier?: 'Grain Club Explorer' | 'Silver Harvest' | 'Gold Master Miller';
  createdAt: string;
  lastLoginAt?: string;
}

export interface CustomerDetails {
  fullName: string;
  email?: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  specialInstructions?: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  customerId?: string;
}

export interface DeliveryAddress {
  streetAddress: string;
  areaLocality: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  orderNotes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImage: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  createdAt: string;
  customer: CustomerInfo;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  estimatedDeliveryDate: string;
  preparationStartedAt?: string;
  dispatchedAt?: string;
  trackingNumber?: string;
  adminNotes?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerCity?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
  usageCount: number;
  isActive: boolean;
  description: string;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  businessHours: string;
  gstNumberPlaceholder: string;
  fssaiNumberPlaceholder: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  standardDeliveryCharge: number;
  freeDeliveryThreshold: number;
  serviceablePincodes: string[];
  announcementText: string;
  showAnnouncement: boolean;
  isAcceptingOrders: boolean;
  estimatedLeadTimeText: string;
}

export interface GrainGuideArticle {
  id: string;
  title: string;
  slug: string;
  grainName: string;
  hindiName: string;
  summary: string;
  content: string;
  culinaryUses: string[];
  storageTips: string;
  readTime: string;
  image: string;
  category: 'millet' | 'wheat' | 'multigrain' | 'guide';
}

export interface BannerAdSize {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  platform: 'Google Display' | 'Social Square' | 'Story / Reel' | 'Landscape Feed' | 'Skyscraper';
}
