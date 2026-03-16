"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "@/include/Header";
import Footer from "@/include/Footer";
import api, { API_ROOT } from "@/lib/api";
import type { ProductDetail } from "@/types/product";
import "./page.css";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedSkuId, setSelectedSkuId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          await api.get("/members/me");
          setIsLogin(true);
        } catch {
          setIsLogin(false);
        }

        const res = await api.get<ProductDetail>(`/products/${id}`);
        const data = res.data;
        setProduct(data);

        if (data.sizes && data.sizes.length > 0) {
          setSelectedSkuId(data.sizes[0].id);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "상품 상세 조회 실패";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      init();
    }
  }, [id]);

  const selectedSize = useMemo(() => {
    return product?.sizes.find((size) => size.id === selectedSkuId) ?? null;
  }, [product, selectedSkuId]);

  const resolvedImageUrl = useMemo(() => {
    if (!product?.imageUrl) return "/no-image.png";
    if (product.imageUrl.startsWith("http")) return product.imageUrl;
    return `${API_ROOT}${product.imageUrl}`;
  }, [product]);

  const addToCart = async () => {
    if (isLogin !== true) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (!selectedSize) {
      alert("사이즈를 선택하세요.");
      return;
    }

    if ((selectedSize.stock ?? 0) < 1) {
      alert("재고가 없습니다.");
      return;
    }

    try {
      setBusy(true);

      await api.post("/cart/items", {
        skuId: selectedSize.id,
        quantity: 1,
      });

      alert("장바구니에 담았습니다.");
    } catch (e) {
      const message = e instanceof Error ? e.message : "장바구니 담기 실패";
      alert(message);
    } finally {
      setBusy(false);
    }
  };

  const goToCart = async () => {
    if (isLogin !== true) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (!selectedSize) {
      alert("사이즈를 선택하세요.");
      return;
    }

    if ((selectedSize.stock ?? 0) < 1) {
      alert("재고가 없습니다.");
      return;
    }

    try {
      setBusy(true);

      await api.post("/cart/items", {
        skuId: selectedSize.id,
        quantity: 1,
      });

      router.push("/cart");
    } catch (e) {
      const message = e instanceof Error ? e.message : "장바구니 이동 처리 실패";
      alert(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="product-detail-page">
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />

      <section className="product-detail-section">
        <div className="product-detail-back">
          <Link href="/products">← 상품 목록으로</Link>
        </div>

        {loading ? (
          <p className="product-detail-state">상품 상세 불러오는 중...</p>
        ) : error ? (
          <p className="product-detail-error">{error}</p>
        ) : !product ? (
          <p className="product-detail-state">상품 정보를 찾을 수 없습니다.</p>
        ) : (
          <>
            <div className="product-detail-layout">
              <div className="product-detail-visual">
                <img src={resolvedImageUrl} alt={product.title} />
              </div>

              <div className="product-detail-info">
                <div className="product-detail-brand">
                  {product.brandName ?? "브랜드 없음"}
                </div>

                <h1 className="product-detail-title">{product.title}</h1>

                <div className="product-detail-sub">
                  {product.series || product.categoryName || "-"}
                </div>

                <div className="product-detail-price">
                  {Number(product.price ?? 0).toLocaleString()}원
                </div>

                <div className="product-detail-size-block">
                  <div className="product-detail-size-label">그립 사이즈</div>

                  {product.sizes.length === 0 ? (
                    <p className="product-detail-empty-text">
                      선택 가능한 사이즈가 없습니다.
                    </p>
                  ) : (
                    <div className="product-detail-size-list">
                      {product.sizes.map((size) => {
                        const active = selectedSkuId === size.id;
                        const soldOut = (size.stock ?? 0) < 1;

                        return (
                          <button
                            key={size.id}
                            type="button"
                            className={`product-detail-size-btn ${
                              active ? "is-active" : ""
                            } ${soldOut ? "is-disabled" : ""}`}
                            onClick={() => setSelectedSkuId(size.id)}
                            disabled={soldOut}
                          >
                            {size.size} / 재고 {size.stock}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="product-detail-actions">
                  <button
                    type="button"
                    className="product-detail-btn product-detail-btn--ghost"
                    onClick={addToCart}
                    disabled={busy || !selectedSize || (selectedSize.stock ?? 0) < 1}
                  >
                    {busy ? "처리 중..." : "장바구니 담기"}
                  </button>

                  <button
                    type="button"
                    className="product-detail-btn product-detail-btn--primary"
                    onClick={goToCart}
                    disabled={busy || !selectedSize || (selectedSize.stock ?? 0) < 1}
                  >
                    {busy ? "처리 중..." : "장바구니로 이동"}
                  </button>
                </div>

                <div className="product-detail-desc">
                  {product.description || "상품 설명이 없습니다."}
                </div>
              </div>
            </div>

            <section className="product-spec-section">
              <h2 className="product-spec-title">스펙</h2>

              {!product.spec ? (
                <p className="product-detail-empty-text">스펙 정보가 없습니다.</p>
              ) : (
                <div className="product-spec-grid">
                  <SpecCard
                    label="Head Size"
                    value={
                      product.spec.headSizeSqIn
                        ? `${product.spec.headSizeSqIn} sq in`
                        : "-"
                    }
                  />
                  <SpecCard
                    label="Weight"
                    value={
                      product.spec.unstrungWeightG
                        ? `${product.spec.unstrungWeightG} g`
                        : "-"
                    }
                  />
                  <SpecCard
                    label="Balance"
                    value={product.spec.balanceMm ? `${product.spec.balanceMm} mm` : "-"}
                  />
                  <SpecCard
                    label="Length"
                    value={product.spec.lengthIn ? `${product.spec.lengthIn} in` : "-"}
                  />
                  <SpecCard
                    label="Pattern Main"
                    value={product.spec.patternMain ?? "-"}
                  />
                  <SpecCard
                    label="Pattern Cross"
                    value={product.spec.patternCross ?? "-"}
                  />
                  <SpecCard
                    label="Stiffness"
                    value={product.spec.stiffnessRa ?? "-"}
                  />
                </div>
              )}
            </section>
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}

function SpecCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="product-spec-card">
      <div className="product-spec-card__label">{label}</div>
      <div className="product-spec-card__value">{value}</div>
    </div>
  );
}