// Form data types (used in components)
export interface BuyerProfileFormData {
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string;
  dateOfBirth: string;
  gender: string;
}

export interface BuyerAddressFormData {
  id?: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface BuyerPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  darkMode: boolean;
  language: string;
  currency: string;
}

// Database types (match Supabase table structure)
export interface BuyerProfileDB {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar: string | null;
  date_of_birth: string | null;
  gender: string | null;
  email_notifications: boolean;
  sms_notifications: boolean;
  order_updates: boolean;
  promotions: boolean;
  newsletter: boolean;
  dark_mode: boolean;
  preferred_language: string;
  preferred_currency: string;
  created_at: string;
  updated_at: string;
}

export interface BuyerAddressDB {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string | null;
  zip_code: string | null;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Error types
export interface BuyerProfileErrors {
  username?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Stats type for profile header
export interface BuyerStats {
  totalOrders: number;
  wishlistItems: number;
  reviewsGiven: number;
  addressCount: number;
}
