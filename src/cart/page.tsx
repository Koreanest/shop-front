"use client";

import { useCart } from "@/cart/CartContext";
import CartItem from "./CartItem";

export default function CartPage() {
  const { items, totalPrice } = useCart();

  return (
    <div className="container mt-5">
      <h2>장바구니</h2>

      {items.length === 0 && <p>장바구니가 비어있습니다.</p>}

      {items.map(item => (
        <CartItem key={item.id} item={item} />
      ))}

      {items.length > 0 && (
        <div className="text-end">
          <h4>총 금액: {totalPrice.toLocaleString()}원</h4>
        </div>
      )}
    </div>
  );
}