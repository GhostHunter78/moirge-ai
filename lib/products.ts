import { createClient } from "@/lib/supabaseClient";

export type ProductStatus = "active" | "draft" | "out_of_stock" | "archived";

export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  /** When set, shown to buyers as the discounted price; original price is shown crossed out. */
  sale_price?: number | null;
  currency: string;
  sku: string | null;
  category: string | null;
  thumbnail_url: string | null;
  image_urls: string[] | null;
  featured: boolean;
  stock: number;
  sold_count: number;
  status: ProductStatus;
  rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductPayload {
  title: string;
  description?: string;
  price: number;
  /** Optional sale price; when set, buyers see original price crossed out and this as current price. */
  sale_price?: number | null;
  currency?: string;
  sku?: string;
  category?: string;
  thumbnail_url?: string;
  /**
   * Optional gallery images for the product.
   * When provided, the first image is typically used as the primary visual.
   */
  image_urls?: string[];
  featured?: boolean;
  stock?: number;
  status?: ProductStatus;
}

export async function getSellerProducts(sellerId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  return { data: (data as Product[] | null) ?? null, error };
}

export async function getPublicProducts() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .gt("stock", 0)
    .order("created_at", { ascending: false });

  return { data: (data as Product[] | null) ?? null, error };
}

export async function createProduct(
  sellerId: string,
  payload: CreateProductPayload,
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      seller_id: sellerId,
      title: payload.title,
      description: payload.description ?? null,
      price: payload.price,
      sale_price: payload.sale_price ?? null,
      currency: payload.currency ?? "USD",
      sku: payload.sku ?? null,
      category: payload.category ?? null,
      thumbnail_url: payload.thumbnail_url ?? null,
      image_urls: payload.image_urls ?? null,
      featured: payload.featured ?? false,
      stock: payload.stock ?? 0,
      status: payload.status ?? "draft",
    })
    .select()
    .single();

  return { data: data as Product | null, error };
}
