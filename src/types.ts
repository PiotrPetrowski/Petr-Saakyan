export type PropertyType = 'apartment' | 'house' | 'hotel';
export type RentMode = 'daily' | 'monthly' | 'both';

export interface HostInfo {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  isSuperhost: boolean;
  joinedDate: string;
  responseRate: string;
}

export interface ReviewItem {
  id: string;
  propertyId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  comment: string;
  date: string;
  cleanliness: number;
  location: number;
  value: number;
  communication: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  rentMode: RentMode;
  priceDaily: number;
  priceMonthly: number;
  country?: string;
  city: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  area: number; // m²
  images: string[];
  amenities: string[];
  host: HostInfo;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  instantBook: boolean;
  rules: string[];
  isAvailable: boolean;
}

export type AppLanguage = 'ru' | 'en' | 'hy' | 'ka';

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
  currency: 'RUB' | 'USD' | 'EUR' | 'KZT' | 'AMD' | 'GEL' | 'AED' | 'TRY';
  language: AppLanguage;
  hidePhoneUntilBooking: boolean;
  payoutCardNumber: string;
  payoutPhoneSbp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  provider: 'email' | 'google' | 'telegram' | 'vk' | 'github';
  role: 'tenant' | 'landlord' | 'both';
  bio: string;
  isVerified: boolean;
  favorites: string[];
  createdAt: string;
  settings?: UserSettings;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyCity: string;
  propertyAddress: string;
  tenantId: string;
  tenantName: string;
  landlordId: string;
  checkIn: string;
  checkOut: string;
  rentMode: 'daily' | 'monthly';
  durationCount: number; // days or months
  pricePerUnit: number;
  totalPrice: number;
  deposit: number;
  serviceFee: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'held_in_escrow' | 'paid_to_host' | 'refunded';
  paymentMethod: string;
  last4: string;
  guestsCount: number;
  createdAt: string;
  reviewed?: boolean;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface ChatThread {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  landlordId: string;
  landlordName: string;
  landlordAvatar: string;
  tenantId: string;
  tenantName: string;
  tenantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCountTenant: number;
  unreadCountLandlord: number;
}

export interface SearchFilters {
  query: string;
  country: string;
  city: string;
  rentMode: 'all' | 'daily' | 'monthly';
  propertyType: 'all' | PropertyType;
  minPrice: number;
  maxPrice: number;
  guests: number;
  amenities: string[];
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'rating';
}

export interface CityLocation {
  name: string;
  lat: number;
  lng: number;
}

export interface CountryWithCities {
  code: string;
  name: string;
  flag: string;
  center?: {
    lat: number;
    lng: number;
    zoom: number;
  };
  cities: CityLocation[];
}
