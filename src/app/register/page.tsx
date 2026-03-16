"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/include/Header";
import Footer from "@/include/Footer";
import { apiFetch } from "@/lib/api";
import type { MeResponse } from "@/types/member";
import "./register.css";

export default function RegisterPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    const checkMe = async () => {
      try {
        await apiFetch<MeResponse>("/members/me");
        setIsLogin(true);
        router.replace("/");
      } catch {
        setIsLogin(false);
      }
    };

    checkMe();
  }, [router]);

  const onChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password.trim() ||
      !form.passwordConfirm.trim()
    ) {
      alert("모든 항목을 입력하세요.");
      return;
    }

    if (form.password !== form.passwordConfirm) {
      alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      await apiFetch<void>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      setIsLogin(true);
      router.push("/");
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "회원가입 실패";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />

      <section className="register-section">
        <div className="register-card">
          <div className="register-card__header">
            <div className="register-card__eyebrow">CREATE ACCOUNT</div>
            <h1 className="register-card__title">회원가입</h1>
            <p className="register-card__desc">
              계정을 만들고 라켓, 장바구니, 주문 기능을 이용하세요.
            </p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <label className="register-field">
              <span>이름</span>
              <input
                type="text"
                value={form.name}
                onChange={onChange("name")}
                placeholder="이름 입력"
              />
            </label>

            <label className="register-field">
              <span>이메일</span>
              <input
                type="email"
                value={form.email}
                onChange={onChange("email")}
                placeholder="example@email.com"
              />
            </label>

            <label className="register-field">
              <span>휴대폰 번호</span>
              <input
                type="text"
                value={form.phone}
                onChange={onChange("phone")}
                placeholder="010-0000-0000"
              />
            </label>

            <label className="register-field">
              <span>비밀번호</span>
              <input
                type="password"
                value={form.password}
                onChange={onChange("password")}
                placeholder="비밀번호 입력"
              />
            </label>

            <label className="register-field">
              <span>비밀번호 확인</span>
              <input
                type="password"
                value={form.passwordConfirm}
                onChange={onChange("passwordConfirm")}
                placeholder="비밀번호 다시 입력"
              />
            </label>

            <button type="submit" className="register-submit" disabled={loading}>
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <div className="register-bottom">
            <span>이미 계정이 있나요?</span>
            <Link href="/login">로그인</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}