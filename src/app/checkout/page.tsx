"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/include/Header";
import Footer from "@/include/Footer";
import { createOrder } from "@/lib/api/orders";
import type { OrderCreateRequest } from "@/types/order";
import "./page.css";

export default function CheckoutPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<OrderCreateRequest>({
    receiverName: "",
    receiverPhone: "",
    zip: "",
    address1: "",
    address2: "",
    memo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.receiverName.trim()) {
      alert("수령인 이름을 입력하세요.");
      return;
    }

    if (!form.receiverPhone.trim()) {
      alert("수령인 연락처를 입력하세요.");
      return;
    }

    if (!form.address1.trim()) {
      alert("주소를 입력하세요.");
      return;
    }

    try {
      setBusy(true);

      const created = await createOrder({
        receiverName: form.receiverName.trim(),
        receiverPhone: form.receiverPhone.trim(),
        zip: form.zip?.trim() || "",
        address1: form.address1.trim(),
        address2: form.address2?.trim() || "",
        memo: form.memo?.trim() || "",
      });

      alert("주문이 완료되었습니다.");
      router.push(`/orders/${created.orderId}`);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "주문 생성에 실패했습니다.";
      alert(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="checkout-page">
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />

      <section className="checkout-container">
        <h1 className="checkout-title">배송 정보 입력</h1>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-field">
            <label>수령인</label>
            <input
              name="receiverName"
              value={form.receiverName}
              onChange={handleChange}
            />
          </div>

          <div className="checkout-field">
            <label>연락처</label>
            <input
              name="receiverPhone"
              value={form.receiverPhone}
              onChange={handleChange}
            />
          </div>

          <div className="checkout-field">
            <label>우편번호</label>
            <input
              name="zip"
              value={form.zip}
              onChange={handleChange}
            />
          </div>

          <div className="checkout-field">
            <label>주소1</label>
            <input
              name="address1"
              value={form.address1}
              onChange={handleChange}
            />
          </div>

          <div className="checkout-field">
            <label>주소2</label>
            <input
              name="address2"
              value={form.address2}
              onChange={handleChange}
            />
          </div>

          <div className="checkout-field">
            <label>배송 메모</label>
            <textarea
              name="memo"
              value={form.memo}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <button type="submit" disabled={busy} className="checkout-submit">
            {busy ? "주문 처리 중..." : "주문하기"}
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
}