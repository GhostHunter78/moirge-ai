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

