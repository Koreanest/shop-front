"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/include/Header";
import Footer from "@/include/Footer";
import api from "@/lib/api";
import {
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABEL,
  type OrderResponse,
  type OrderStatus,
} from "@/types/order";
import "./page.css";

function canCancel(status: OrderStatus) {
  return status === "PENDING" || status === "PAID";
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = Number(params?.id);

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!orderId || Number.isNaN(orderId)) {
      setError("잘못된 주문 번호입니다.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        await api.get("/members/me");
        setIsLogin(true);

        const res = await api.get<OrderResponse>(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "주문 상세를 불러오지 못했습니다.";
        setError(message);
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orderId]);

  const handleCancel = async () => {
    if (!order || !canCancel(order.status)) return;

    const ok = confirm("이 주문을 취소할까요?");
    if (!ok) return;

    try {
      setBusy(true);

      const res = await api.post<OrderResponse>(`/orders/${order.orderId}/cancel`);
      setOrder(res.data);

      alert("주문이 취소되었습니다.");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "주문 취소에 실패했습니다.";
      alert(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="order-detail-page">
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />

      <section className="order-detail-container">
        <div className="order-detail-back">
          <Link href="/orders">← 주문 목록으로</Link>
        </div>

        {loading ? (
          <p className="order-detail-state">주문 상세 불러오는 중...</p>
        ) : error ? (
          <p className="order-detail-error">{error}</p>
        ) : !order ? (
          <p className="order-detail-state">주문 정보를 찾을 수 없습니다.</p>
        ) : (
          <>
            <div className="order-detail-card">
              <h1 className="order-detail-title">주문 상세</h1>

              <div className="order-detail-info">
                <div>
                  <strong>주문번호:</strong> {order.orderNo}
                </div>
                <div>
                  <strong>상태:</strong>{" "}
                  <span
                    className={`order-status-badge order-status-badge--${ORDER_STATUS_COLOR[order.status]}`}
                  >
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>
                <div>
                  <strong>수령인:</strong> {order.receiverName}
                </div>
                <div>
                  <strong>연락처:</strong> {order.receiverPhone}
                </div>
                <div>
                  <strong>우편번호:</strong> {order.zip || "-"}
                </div>
                <div>
                  <strong>주소1:</strong> {order.address1}
                </div>
                <div>
                  <strong>주소2:</strong> {order.address2 || "-"}
                </div>
                <div>
                  <strong>메모:</strong> {order.memo || "-"}
                </div>
                <div>
                  <strong>총금액:</strong> {Number(order.totalPrice ?? 0).toLocaleString()}원
                </div>
              </div>

              {canCancel(order.status) && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={busy}
                  className="order-cancel-button"
                >
                  {busy ? "취소 처리 중..." : "주문 취소"}
                </button>
              )}
            </div>

            <div className="order-detail-card">
              <h2 className="order-detail-subtitle">주문 상품</h2>

              {order.items.length === 0 ? (
                <p className="order-detail-state">주문 상품이 없습니다.</p>
              ) : (
                <div className="order-item-list">
                  {order.items.map((item) => (
                    <div key={item.orderItemId} className="order-item-card">
                      <div>
                        <strong>상품명:</strong> {item.productTitle ?? "-"}
                      </div>
                      <div>
                        <strong>사이즈:</strong> {item.size}
                      </div>
                      <div>
                        <strong>SKU:</strong> {item.skuCode}
                      </div>
                      <div>
                        <strong>주문가격:</strong> {Number(item.orderPrice ?? 0).toLocaleString()}원
                      </div>
                      <div>
                        <strong>수량:</strong> {item.quantity}
                      </div>
                      <div>
                        <strong>합계:</strong> {Number(item.lineAmount ?? 0).toLocaleString()}원
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}