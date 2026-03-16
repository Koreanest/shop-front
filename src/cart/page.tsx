"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/include/Header";
import Footer from "@/include/Footer";
import { apiFetch } from "@/lib/api";
import type { MeResponse } from "@/types/member";
import type { CartItem, CartResponse } from "@/types/cart";
import "./cart.css";

export default function CartPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadCart = async () => {
    await apiFetch<MeResponse>("/members/me");
    setIsLogin(true);

    const data = await apiFetch<CartResponse>("/cart");
    setCart(data);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await loadCart();
      } catch {
        setIsLogin(false);
        alert("로그인이 필요합니다.");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const updateQuantity = async (item: CartItem, nextQuantity: number) => {
    if (nextQuantity < 1) return;

    try {
      setBusyId(item.cartItemId);

      const updated = await apiFetch<CartResponse>(`/cart/items/${item.cartItemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity: nextQuantity }),
      });

      setCart(updated);
    } catch (e) {
      const message = e instanceof Error ? e.message : "수량 수정 실패";
      alert(message);
    } finally {
      setBusyId(null);
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      setBusyId(cartItemId);

      const updated = await apiFetch<CartResponse>(`/cart/items/${cartItemId}`, {
        method: "DELETE",
      });

      setCart(updated);
    } catch (e) {
      const message = e instanceof Error ? e.message : "상품 삭제 실패";
      alert(message);
    } finally {
      setBusyId(null);
    }
  };

  const summary = useMemo(() => {
    return {
      totalCount: cart?.totalItemCount ?? 0,
      totalAmount: cart?.totalAmount ?? 0,
    };
  }, [cart]);

  return (
    <main className="cart-page">
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />

      <section className="cart-section">
        <div className="cart-header">
          <div className="cart-header__eyebrow">SHOPPING CART</div>
          <h1 className="cart-header__title">장바구니</h1>
        </div>

        {loading ? (
          <p>장바구니를 불러오는 중...</p>
        ) : !cart || cart.items.length === 0 ? (
          <div className="cart-empty">
            <p>장바구니가 비어 있습니다.</p>
            <Link href="/" className="cart-empty__link">
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.cartItemId} className="cart-item">
                  <Link
                    href={item.productId ? `/products/${item.productId}` : "#"}
                    className="cart-item__image"
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productTitle ?? "상품"} />
                    ) : (
                      <span>이미지 없음</span>
                    )}
                  </Link>

                  <div className="cart-item__body">
                    <div className="cart-item__sku">{item.skuCode || "SKU 없음"}</div>
                    <div className="cart-item__title">{item.productTitle || "상품명 없음"}</div>
                    <div className="cart-item__meta">
                      사이즈 {item.size || "-"} · 재고 {item.stockQty}
                    </div>

                    <div className="cart-item__qty">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                        disabled={busyId === item.cartItemId}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        disabled={busyId === item.cartItemId}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item__price">
                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => removeItem(item.cartItemId)}
                      disabled={busyId === item.cartItemId}
                    >
                      삭제
                    </button>

                    <div className="cart-item__unit">
                      단가 {item.unitPrice.toLocaleString()}원
                    </div>
                    <div className="cart-item__line">
                      {item.lineAmount.toLocaleString()}원
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <div className="cart-summary__eyebrow">ORDER SUMMARY</div>

              <div className="cart-summary__rows">
                <div className="cart-summary__row">
                  <span>총 수량</span>
                  <strong>{summary.totalCount}개</strong>
                </div>
                <div className="cart-summary__row">
                  <span>총 상품금액</span>
                  <strong>{summary.totalAmount.toLocaleString()}원</strong>
                </div>
              </div>

              <div className="cart-summary__total">
                <span>결제예정 금액</span>
                <strong>{summary.totalAmount.toLocaleString()}원</strong>
              </div>

              <Link href="/order" className="cart-summary__primary">
                주문서 작성
              </Link>

              <Link href="/" className="cart-summary__ghost">
                쇼핑 계속하기
              </Link>
            </aside>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}