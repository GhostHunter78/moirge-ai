"use server";

import {
  addToCartServer,
  clearCartServer,
  getCurrentCart,
  updateCartItemQuantityServer,
} from "@/lib/cart";

export async function getCartAction() {
  try {
    const cart = await getCurrentCart();
    return { cart, error: null as string | null };
  } catch (err) {
    console.error("Failed to load cart", err);
    return {
      cart: { cartId: "", items: [] },
      error: "Failed to load cart",
    };
  }
}

export async function addToCartAction(productId: string) {
  const { cart, error } = await addToCartServer(productId);
  if (error || !cart) {
    console.error("Failed to add to cart", error);
    return {
      cart: { cartId: "", items: [] },
      error: "Failed to add to cart",
    };
  }
  return { cart, error: null as string | null };
}

export async function updateCartItemQuantityAction(
  productId: string,
  quantity: number,
) {
  const { cart, error } = await updateCartItemQuantityServer(productId, quantity);
  if (error || !cart) {
    console.error("Failed to update cart item quantity", error);
    return {
      cart: { cartId: "", items: [] },
      error: "Failed to update cart item",
    };
  }
  return { cart, error: null as string | null };
}

export async function clearCartAction() {
  const { cart, error } = await clearCartServer();
  if (error || !cart) {
    console.error("Failed to clear cart", error);
    return {
      cart: { cartId: "", items: [] },
      error: "Failed to clear cart",
    };
  }
  return { cart, error: null as string | null };
}


