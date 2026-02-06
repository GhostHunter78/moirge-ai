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

export interface BuyerAddress {
  id: string;
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
