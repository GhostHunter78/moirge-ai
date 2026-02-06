import { createClient } from "@/lib/supabaseClient";
import {
  BuyerProfileDB,
  BuyerAddressDB,
  BuyerProfileFormData,
  BuyerAddressFormData,
  BuyerPreferences,
  BuyerStats,
} from "@/types/buyer-profile";

// ============================================
// BUYER PROFILE CRUD OPERATIONS
// ============================================

/**
 * Get buyer profile for the current user
 */
export async function getBuyerProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("buyer_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    // If no profile exists, return null instead of throwing
    if (error.code === "PGRST116") {
      return { data: null, error: null };
    }
    return { data: null, error };
  }

  return { data: data as BuyerProfileDB, error: null };
}

/**
 * Save or update buyer profile personal info
 */
export async function saveBuyerProfile(
  userId: string,
  profileData: Partial<BuyerProfileFormData>
) {
  const supabase = createClient();

  // Map form data to database column names
  const dbData: Record<string, unknown> = {
    user_id: userId,
  };

  if (profileData.firstName !== undefined)
    dbData.first_name = profileData.firstName || null;
  if (profileData.lastName !== undefined)
    dbData.last_name = profileData.lastName || null;
  if (profileData.bio !== undefined) dbData.bio = profileData.bio || null;
  if (profileData.avatar !== undefined)
    dbData.avatar = profileData.avatar || null;
  if (profileData.dateOfBirth !== undefined)
    dbData.date_of_birth = profileData.dateOfBirth || null;
  if (profileData.gender !== undefined)
    dbData.gender = profileData.gender || null;

  const { data, error } = await supabase
    .from("buyer_profiles")
    .upsert(dbData, {
      onConflict: "user_id",
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Save buyer preferences
 */
export async function saveBuyerPreferences(
  userId: string,
  preferences: BuyerPreferences
) {
  const supabase = createClient();

  const dbData = {
    user_id: userId,
    email_notifications: preferences.emailNotifications,
    sms_notifications: preferences.smsNotifications,
    order_updates: preferences.orderUpdates,
    promotions: preferences.promotions,
    newsletter: preferences.newsletter,
    dark_mode: preferences.darkMode,
    preferred_language: preferences.language,
    preferred_currency: preferences.currency,
  };

  const { data, error } = await supabase
    .from("buyer_profiles")
    .upsert(dbData, {
      onConflict: "user_id",
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Update buyer avatar
 */
export async function updateBuyerAvatar(userId: string, avatarUrl: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("buyer_profiles")
    .upsert(
      { user_id: userId, avatar: avatarUrl },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  return { data, error };
}

// ============================================
// BUYER ADDRESSES CRUD OPERATIONS
// ============================================

/**
 * Get all addresses for a user
 */
export async function getBuyerAddresses(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("buyer_addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error };
  }

  return { data: data as BuyerAddressDB[], error: null };
}

/**
 * Add a new address
 */
export async function addBuyerAddress(
  userId: string,
  addressData: BuyerAddressFormData
) {
  const supabase = createClient();

  const dbData = {
    user_id: userId,
    label: addressData.label,
    full_name: addressData.fullName,
    phone: addressData.phone || null,
    address_line_1: addressData.addressLine1,
    address_line_2: addressData.addressLine2 || null,
    city: addressData.city,
    state: addressData.state || null,
    zip_code: addressData.zipCode || null,
    country: addressData.country,
    is_default: addressData.isDefault,
  };

  const { data, error } = await supabase
    .from("buyer_addresses")
    .insert(dbData)
    .select()
    .single();

  return { data: data as BuyerAddressDB, error };
}

/**
 * Update an existing address
 */
export async function updateBuyerAddress(
  addressId: string,
  userId: string,
  addressData: BuyerAddressFormData
) {
  const supabase = createClient();

  const dbData = {
    label: addressData.label,
    full_name: addressData.fullName,
    phone: addressData.phone || null,
    address_line_1: addressData.addressLine1,
    address_line_2: addressData.addressLine2 || null,
    city: addressData.city,
    state: addressData.state || null,
    zip_code: addressData.zipCode || null,
    country: addressData.country,
    is_default: addressData.isDefault,
  };

  const { data, error } = await supabase
    .from("buyer_addresses")
    .update(dbData)
    .eq("id", addressId)
    .eq("user_id", userId)
    .select()
    .single();

  return { data: data as BuyerAddressDB, error };
}

/**
 * Delete an address
 */
export async function deleteBuyerAddress(addressId: string, userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("buyer_addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", userId);

  return { error };
}

/**
 * Set an address as default
 */
export async function setDefaultAddress(addressId: string, userId: string) {
  const supabase = createClient();

  // The trigger in the database will handle unsetting other defaults
  const { data, error } = await supabase
    .from("buyer_addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", userId)
    .select()
    .single();

  return { data: data as BuyerAddressDB, error };
}

// ============================================
// BUYER STATS
// ============================================

/**
 * Get buyer statistics for the profile header
 */
export async function getBuyerStats(userId: string): Promise<BuyerStats> {
  const supabase = createClient();

  // Get address count
  const { count: addressCount } = await supabase
    .from("buyer_addresses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // TODO: Add real order count when orders table exists
  // const { count: orderCount } = await supabase
  //   .from("orders")
  //   .select("*", { count: "exact", head: true })
  //   .eq("buyer_id", userId);

  // TODO: Add real wishlist count when wishlist table exists
  // const { count: wishlistCount } = await supabase
  //   .from("wishlist")
  //   .select("*", { count: "exact", head: true })
  //   .eq("user_id", userId);

  // TODO: Add real reviews count when reviews table exists
  // const { count: reviewCount } = await supabase
  //   .from("reviews")
  //   .select("*", { count: "exact", head: true })
  //   .eq("user_id", userId);

  return {
    totalOrders: 0, // Replace with orderCount when available
    wishlistItems: 0, // Replace with wishlistCount when available
    reviewsGiven: 0, // Replace with reviewCount when available
    addressCount: addressCount || 0,
  };
}

// ============================================
// TRANSFORM FUNCTIONS
// ============================================

/**
 * Transform database row to form data format
 */
export function transformBuyerProfileToFormData(
  dbRow: BuyerProfileDB | null,
  userProfile: { username: string; email: string; phone: string }
): BuyerProfileFormData {
  return {
    username: userProfile.username || "",
    email: userProfile.email || "",
    phone: userProfile.phone || "",
    firstName: dbRow?.first_name || "",
    lastName: dbRow?.last_name || "",
    bio: dbRow?.bio || "",
    avatar: dbRow?.avatar || "",
    dateOfBirth: dbRow?.date_of_birth || "",
    gender: dbRow?.gender || "",
  };
}

/**
 * Transform database row to preferences format
 */
export function transformBuyerProfileToPreferences(
  dbRow: BuyerProfileDB | null
): BuyerPreferences {
  return {
    emailNotifications: dbRow?.email_notifications ?? true,
    smsNotifications: dbRow?.sms_notifications ?? false,
    orderUpdates: dbRow?.order_updates ?? true,
    promotions: dbRow?.promotions ?? false,
    newsletter: dbRow?.newsletter ?? true,
    darkMode: dbRow?.dark_mode ?? false,
    language: dbRow?.preferred_language || "en",
    currency: dbRow?.preferred_currency || "USD",
  };
}

/**
 * Transform database address to form data format
 */
export function transformAddressToFormData(
  dbRow: BuyerAddressDB
): BuyerAddressFormData {
  return {
    id: dbRow.id,
    label: dbRow.label || "Home",
    fullName: dbRow.full_name || "",
    phone: dbRow.phone || "",
    addressLine1: dbRow.address_line_1 || "",
    addressLine2: dbRow.address_line_2 || "",
    city: dbRow.city || "",
    state: dbRow.state || "",
    zipCode: dbRow.zip_code || "",
    country: dbRow.country || "",
    isDefault: dbRow.is_default || false,
  };
}

/**
 * Transform array of database addresses to form data format
 */
export function transformAddressesToFormData(
  dbRows: BuyerAddressDB[]
): BuyerAddressFormData[] {
  return dbRows.map(transformAddressToFormData);
}
