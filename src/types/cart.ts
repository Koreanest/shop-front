export type CartItem = {
  cartItemId: number;
  skuId: number;
  skuCode: string | null;
  size: string | null;
  productId: number | null;
  productTitle: string | null;
  productSlug: string | null;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineAmount: number;
  stockQty: number;
  safetyStockQty: number;
};

export type CartResponse = {
  cartId: number;
  memberId: number;
  items: CartItem[];
  totalItemCount: number;
  totalAmount: number;
};

export type CartAddRequest = {
  skuId: number;
  quantity: number;
};

export type CartItemQuantityUpdateRequest = {
  quantity: number;
};