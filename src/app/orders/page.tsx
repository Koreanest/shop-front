"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/include/Header";
import Footer from "@/include/Footer";
import api from "@/lib/api";
import {
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABEL,
  type OrderListItemResponse,
} from "@/types/order";
import "./page.css";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR");
}

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<OrderListItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        await api.get("/members/me");
        setIsLogin(true);

        const res = await api.get<OrderListItemResponse[]>("/orders");
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "주문 목록을 불러오지 못했습니다.";
        setError(message);
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className="orders-page">
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />

      <section className="orders-container">
        <h1 className="orders-title">내 주문 목록</h1>

        {loading ? (
          <p className="orders-state">주문 목록 불러오는 중...</p>
        ) : error ? (
          <p className="orders-error">{error}</p>
        ) : orders.length === 0 ? (
          <p className="orders-state">주문 내역이 없습니다.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <button
                key={order.orderId}
                type="button"
                className="order-card"
                onClick={() => router.push(`/orders/${order.orderId}`)}
              >
                <div className="order-card__grid">
                  <div>
                    <div className="order-card__label">주문번호</div>
                    <div className="order-card__value order-card__value--strong">
                      {order.orderNo}
                    </div>
                  </div>

                  <div>
                    <div className="order-card__label">상태</div>
                    <div
                      className={`order-status-badge order-status-badge--${ORDER_STATUS_COLOR[order.status]}`}
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </div>
                  </div>

                  <div>
                    <div className="order-card__label">수령인</div>
                    <div className="order-card__value">{order.receiverName}</div>
                  </div>

                  <div>
                    <div className="order-card__label">총금액</div>
                    <div className="order-card__value order-card__value--strong">
                      {Number(order.totalPrice ?? 0).toLocaleString()}원
                    </div>
                  </div>

                  <div>
                    <div className="order-card__label">생성일</div>
                    <div className="order-card__value">
                      {formatDateTime(order.createdAt)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}