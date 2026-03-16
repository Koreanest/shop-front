"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/include/Header";
import Footer from "@/include/Footer";
import api, { API_ROOT } from "@/lib/api";
import type { CartItem, CartResponse } from "@/types/cart";
import "./cart.css";

export default function CartPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  const loadCart = async () => {
    const res = await api.get<CartResponse>("/cart");
    setCart(res.data);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setPageError(null);

        await api.get("/members/me");
        setIsLogin(true);

        await loadCart();
      } catch (e) {
        setIsLogin(false);
        const message =
          e instanceof Error ? e.message : "장바구니를 불러오지 못했습니다.";
        setPageError(message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const updateQuantity = async (item: CartItem, nextQuantity: number) => {
    if (nextQuantity < 1) return;

    try {
      setBusyId(item.cartItemId);

      const res = await api.patch<CartResponse>(`/cart/items/${item.cartItemId}`, {
        quantity: nextQuantity,
      });

      setCart(res.data);
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

      const res = await api.delete<CartResponse>(`/cart/items/${cartItemId}`);
      setCart(res.data);
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
        ) : isLogin === false ? (
          <div className="cart-empty">
            <p>{pageError || "로그인이 필요합니다."}</p>
            <Link href="/login" className="cart-empty__link">
              로그인하러 가기
            </Link>
          </div>
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
              {cart.items.map((item) => {
                const imageSrc = item.imageUrl
                  ? item.imageUrl.startsWith("http")
                    ? item.imageUrl
                    : `${API_ROOT}${item.imageUrl}`
                  : "/no-image.png";

                return (
                  <div key={item.cartItemId} className="cart-item">
                    <Link
                      href={item.productId ? `/products/${item.productId}` : "#"}
                      className="cart-item__image"
                    >
                      <img src={imageSrc} alt={item.productTitle ?? "상품"} />
                    </Link>

                    <div className="cart-item__body">
                      <div className="cart-item__sku">{item.skuCode || "SKU 없음"}</div>
                      <div className="cart-item__title">
                        {item.productTitle || "상품명 없음"}
                      </div>
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
                );
              })}
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

              <Link href="/orders" className="cart-summary__primary">
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