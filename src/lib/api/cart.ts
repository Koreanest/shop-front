import api from "@/lib/api";
import type {
  CartAddRequest,
  CartItemQuantityUpdateRequest,
  CartResponse,
} from "@/types/cart";

export async function getCart() {
  const res = await api.get<CartResponse>("/cart");
  return res.data;
}

export async function addCartItem(payload: CartAddRequest) {
  await api.post("/cart/items", payload);
}

export async function updateCartItemQuantity(
  cartItemId: number,
  payload: CartItemQuantityUpdateRequest
) {
  await api.patch(`/cart/items/${cartItemId}`, payload);
}

export async function deleteCartItem(cartItemId: number) {
  await api.delete(`/cart/items/${cartItemId}`);
}