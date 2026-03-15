"use client";

import { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "@/cart/CartContext";

type Props = {
  item: CartItemType;
};

export default function CartItem({ item }: Props) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="d-flex align-items-center justify-content-between border p-3 mb-3">
      <div>
        <h5>{item.title}</h5>
        <p>옵션: {item.option}</p>
        <p>가격: {item.price.toLocaleString()}원</p>
      </div>

      <div>
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) =>
            updateQuantity(item.id, Number(e.target.value))
          }
          className="form-control"
          style={{ width: "80px" }}
        />
      </div>

      <div>
        <strong>
          {(item.price * item.quantity).toLocaleString()}원
        </strong>
      </div>

      <button
        className="btn btn-danger"
        onClick={() => removeItem(item.id)}
      >
        삭제
      </button>
    </div>
  );
}