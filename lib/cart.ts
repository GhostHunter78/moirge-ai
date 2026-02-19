"use server";

import { createClient } from "@/lib/supabaseServer";
import type { Product } from "@/lib/products";

export interface CartItemRow {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  currency: string;
  created_at: string;
  updated_at: string;
  products: Product;
}

export interface CartWithItems {
  cartId: string;
  items: {
    product: Product;
    quantity: number;
    unitPrice: number;
    currency: string;
  }[];
}

async function getOrCreateActiveCart(userId: string) {
  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("carts")
    .select("id, status")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (existing) {
    return existing.id as string;
  }

  const { data: created, error: insertError } = await supabase
    .from("carts")
    .insert({
      user_id: userId,
      status: "active",
    })
    .select("id")
    .single();

  if (insertError) {
    throw insertError;
  }

  return created.id as string;
}

export async function getCurrentCart(): Promise<CartWithItems> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { cartId: "", items: [] };
  }

  const cartId = await getOrCreateActiveCart(user.id);

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
        id,
        cart_id,
        product_id,
        quantity,
        unit_price,
        currency,
        created_at,
        updated_at,
        products (*)
      `,
    )
    .eq("cart_id", cartId);

  if (error) {
    throw error;
  }

  const items =
    (data as CartItemRow[] | null)?.map((row) => ({
      product: row.products,
      quantity: row.quantity,
      unitPrice: row.unit_price,
      currency: row.currency,
    })) ?? [];

  return { cartId, items };
}

export async function addToCartServer(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: new Error("Not authenticated"), cart: null as CartWithItems | null };
  }

  const cartId = await getOrCreateActiveCart(user.id);

  // Load product to get current price and currency
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return {
      error: new Error("Product not found"),
      cart: null as CartWithItems | null,
    };
  }

  const unitPrice =
    product.sale_price != null ? Number(product.sale_price) : Number(product.price);

  // Upsert cart item
  const { data: existingItem, error: existingError } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existingError) {
    return { error: existingError, cart: null as CartWithItems | null };
  }

  if (existingItem) {
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + 1 })
      .eq("id", existingItem.id);

    if (updateError) {
      return { error: updateError, cart: null as CartWithItems | null };
    }
  } else {
    const { error: insertError } = await supabase.from("cart_items").insert({
      cart_id: cartId,
      product_id: productId,
      quantity: 1,
      unit_price: unitPrice,
      currency: product.currency ?? "USD",
    });

    if (insertError) {
      return { error: insertError, cart: null as CartWithItems | null };
    }
  }

  const cart = await getCurrentCart();
  return { error: null, cart };
}

export async function updateCartItemQuantityServer(
  productId: string,
  quantity: number,
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: new Error("Not authenticated"), cart: null as CartWithItems | null };
  }

  const cartId = await getOrCreateActiveCart(user.id);

  if (quantity <= 0) {
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId)
      .eq("product_id", productId);

    if (deleteError) {
      return { error: deleteError, cart: null as CartWithItems | null };
    }
  } else {
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("cart_id", cartId)
      .eq("product_id", productId);

    if (updateError) {
      return { error: updateError, cart: null as CartWithItems | null };
    }
  }

  const cart = await getCurrentCart();
  return { error: null, cart };
}

export async function clearCartServer() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: new Error("Not authenticated"), cart: null as CartWithItems | null };
  }

  const cartId = await getOrCreateActiveCart(user.id);

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId);

  if (error) {
    return { error, cart: null as CartWithItems | null };
  }

  const cart = await getCurrentCart();
  return { error: null, cart };
}

