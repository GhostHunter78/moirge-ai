"use server";

import { createClient } from "@/lib/supabaseServer";
import { CreateProductPayload, Product } from "@/lib/products";

export async function createProductAction(payload: CreateProductPayload) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null as Product | null,
      error: {
        message: "Not authenticated",
      },
    };
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      seller_id: user.id,
      title: payload.title,
      description: payload.description ?? null,
      price: payload.price,
      currency: payload.currency ?? "USD",
      sku: payload.sku ?? null,
      category: payload.category ?? null,
      thumbnail_url: payload.thumbnail_url ?? null,
      featured: payload.featured ?? false,
      stock: payload.stock ?? 0,
      status: payload.status ?? "draft",
    })
    .select()
    .single();

  return { data: data as Product | null, error };
}

export async function updateProductAction(
  productId: string,
  payload: Partial<CreateProductPayload> & { featured?: boolean }
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null as Product | null,
      error: {
        message: "Not authenticated",
      },
    };
  }

  // Verify the product belongs to the user
  const { data: existingProduct, error: fetchError } = await supabase
    .from("products")
    .select("seller_id")
    .eq("id", productId)
    .single();

  if (fetchError || !existingProduct || existingProduct.seller_id !== user.id) {
    return {
      data: null as Product | null,
      error: {
        message: "Product not found or you do not have permission to edit it",
      },
    };
  }

  const updateData: Record<string, unknown> = {};

  if (payload.title !== undefined) updateData.title = payload.title;
  if (payload.description !== undefined)
    updateData.description = payload.description ?? null;
  if (payload.price !== undefined) updateData.price = payload.price;
  if (payload.currency !== undefined) updateData.currency = payload.currency;
  if (payload.sku !== undefined) updateData.sku = payload.sku ?? null;
  if (payload.category !== undefined)
    updateData.category = payload.category ?? null;
  if (payload.thumbnail_url !== undefined)
    updateData.thumbnail_url = payload.thumbnail_url ?? null;
  if (payload.featured !== undefined) updateData.featured = payload.featured;
  if (payload.stock !== undefined) updateData.stock = payload.stock;
  if (payload.status !== undefined) updateData.status = payload.status;

  // If no fields to update, return the existing product
  if (Object.keys(updateData).length === 0) {
    const { data: currentProduct } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();
    
    return { data: currentProduct as Product | null, error: null };
  }

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)
    .eq("seller_id", user.id) // Ensure we're only updating the user's own product
    .select()
    .maybeSingle();

  if (error) {
    return { data: null as Product | null, error };
  }

  if (!data) {
    return {
      data: null as Product | null,
      error: {
        message: "Product not found or update failed",
      },
    };
  }

  return { data: data as Product, error: null };
}

