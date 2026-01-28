import { createClient } from "@/lib/supabaseClient";
import { StoreProfile, StoreProfileFormData } from "@/types/dashboard";

/**
 * Get store profile for the current user
 */
export async function getStoreProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("store_profiles")
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

  return { data, error: null };
}

/**
 * Save or update store profile for the current user
 * Uses upsert to handle both insert and update
 */
export async function saveStoreProfile(
  userId: string,
  profileData: StoreProfileFormData,
) {
  const supabase = createClient();

  // Map form data to database column names
  const dbData = {
    user_id: userId,
    store_name: profileData.storeName,
    store_description: profileData.storeDescription,
    store_logo: profileData.storeLogo,
    store_cover: profileData.storeCover ?? null,
    phone: profileData.phone,
    email: profileData.email,
    address: profileData.address,
    city: profileData.city,
    state: profileData.state,
    zip_code: profileData.zipCode,
    country: profileData.country,
    website: profileData.website,
    facebook: profileData.facebook,
    instagram: profileData.instagram,
    tiktok: profileData.tiktok,
    return_policy: profileData.returnPolicy,
    shipping_policy: profileData.shippingPolicy,
    privacy_policy: profileData.privacyPolicy,
  };

  const { data, error } = await supabase
    .from("store_profiles")
    .upsert(dbData, {
      onConflict: "user_id",
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Delete store profile for the current user
 */
export async function deleteStoreProfile(userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("store_profiles")
    .delete()
    .eq("user_id", userId);

  return { error };
}

/**
 * Transform database row to form data format
 */
export function transformStoreProfileToFormData(
  dbRow: StoreProfile,
): StoreProfileFormData {
  return {
    storeName: dbRow.store_name || "",
    storeDescription: dbRow.store_description || "",
    storeLogo: dbRow.store_logo || "",
    storeCover: dbRow.store_cover || "",
    phone: dbRow.phone || "",
    email: dbRow.email || "",
    address: dbRow.address || "",
    city: dbRow.city || "",
    state: dbRow.state || "",
    zipCode: dbRow.zip_code || "",
    country: dbRow.country || "",
    website: dbRow.website || "",
    facebook: dbRow.facebook || "",
    instagram: dbRow.instagram || "",
    tiktok: dbRow.tiktok || "",
    returnPolicy: dbRow.return_policy || "",
    shippingPolicy: dbRow.shipping_policy || "",
    privacyPolicy: dbRow.privacy_policy || "",
  };
}
