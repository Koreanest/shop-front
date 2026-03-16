"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/include/Header";
import Footer from "@/include/Footer";
import { apiFetch } from "@/lib/api";
import type { PageResponse } from "@/types/common";
import type { ProductListItem } from "@/types/product";
import type { MenuNode } from "@/types/menu";
import type { MeResponse } from "@/types/member";

export default function Home() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [menus, setMenus] = useState<MenuNode[]>([]);
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    const data = await apiFetch<PageResponse<ProductListItem>>("/products?page=0&size=12&sort=latest");
    setProducts(data.items ?? []);
  };

  const loadMenus = async () => {
    const data = await apiFetch<MenuNode[]>("/nav-menus/tree");
    setMenus(Array.isArray(data) ? data : []);
  };

  const checkLogin = async () => {
    try {
      await apiFetch<MeResponse>("/members/me");
      setIsLogin(true);
    } catch {
      setIsLogin(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([loadProducts(), loadMenus(), checkLogin()]);
      } catch (e) {
        const message = e instanceof Error ? e.message : "초기 데이터 로딩 실패";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#fff" }}>
      <Header
        onOpenModal={() => {}}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />

      <section style={{ padding: "48px 24px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
            TENNIS SHOP
          </h1>
          <p style={{ color: "#666", margin: 0 }}>
            백엔드 API 기준으로 연결한 1차 홈 화면
          </p>
        </div>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>카테고리</h2>

          {menus.length === 0 ? (
            <p style={{ color: "#777" }}>카테고리가 없습니다.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    padding: "12px 16px",
                    minWidth: 180,
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>{menu.name}</div>
                  {menu.children && menu.children.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {menu.children.map((child) => (
                        <span key={child.id} style={{ fontSize: 14, color: "#555" }}>
                          {child.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: 14, color: "#999" }}>하위 카테고리 없음</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>최신 상품</h2>
            {isLogin !== null && (
              <span style={{ fontSize: 14, color: isLogin ? "#0a7a33" : "#777" }}>
                {isLogin ? "로그인 상태" : "비로그인 상태"}
              </span>
            )}
          </div>

          {loading ? (
            <p>상품 불러오는 중...</p>
          ) : error ? (
            <p style={{ color: "crimson" }}>{error}</p>
          ) : products.length === 0 ? (
            <p>등록된 상품이 없습니다.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 20,
              }}
            >
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  style={{
                    display: "block",
                    color: "inherit",
                    textDecoration: "none",
                    border: "1px solid #e5e5e5",
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "1 / 1",
                      background: "#f7f7f7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ color: "#999" }}>이미지 없음</span>
                    )}
                  </div>

                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 13, color: "#777", marginBottom: 6 }}>
                      {product.brandName ?? "브랜드 없음"}
                    </div>

                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                      {product.title}
                    </div>

                    <div style={{ fontSize: 14, color: "#666", marginBottom: 10 }}>
                      {product.series || product.categoryName || "카테고리 정보 없음"}
                    </div>

                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      {product.price.toLocaleString()}원
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </section>

      <Footer />
    </main>
  );
}