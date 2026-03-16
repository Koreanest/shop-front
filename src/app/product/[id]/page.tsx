"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "@/include/Header";
import Footer from "@/include/Footer";
import { apiFetch } from "@/lib/api";
import type { MeResponse } from "@/types/member";
import type { ProductDetail } from "@/types/product";
import "./product-detail.css";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          await apiFetch<MeResponse>("/members/me");
          setIsLogin(true);
        } catch {
          setIsLogin(false);
        }

        const data = await apiFetch<ProductDetail>(`/products/${id}`);
        setProduct(data);

        if (data.sizes && data.sizes.length > 0) {
          setSelectedSizeId(data.sizes[0].id);
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
    return product?.sizes.find((size) => size.id === selectedSizeId) ?? null;
  }, [product, selectedSizeId]);

  const addToCart = async () => {
    if (!selectedSize) {
      alert("사이즈를 선택하세요.");
      return;
    }

    try {
      setBusy(true);

      await apiFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({
          skuId: selectedSize.id,
          quantity: 1,
        }),
      });

      alert("장바구니에 담았습니다.");
    } catch (e) {
      const message = e instanceof Error ? e.message : "장바구니 담기 실패";
      alert(message);
    } finally {
      setBusy(false);
    }
  };

  const goToOrder = async () => {
    if (!selectedSize) {
      alert("사이즈를 선택하세요.");
      return;
    }

    try {
      setBusy(true);

      await apiFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({
          skuId: selectedSize.id,
          quantity: 1,
        }),
      });

      router.push("/cart");
    } catch (e) {
      const message = e instanceof Error ? e.message : "바로구매 처리 실패";
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
          <Link href="/">← 홈으로</Link>
        </div>

        {loading ? (
          <p>상품 상세 불러오는 중...</p>
        ) : error ? (
          <p className="product-detail-error">{error}</p>
        ) : !product ? (
          <p>상품 정보를 찾을 수 없습니다.</p>
        ) : (
          <>
            <div className="product-detail-layout">
              <div className="product-detail-visual">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrl} alt={product.title} />
                ) : (
                  <div className="product-detail-image-empty">이미지 없음</div>
                )}
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
                  {product.price.toLocaleString()}원
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
                        const active = selectedSizeId === size.id;
                        return (
                          <button
                            key={size.id}
                            type="button"
                            className={`product-detail-size-btn ${
                              active ? "is-active" : ""
                            }`}
                            onClick={() => setSelectedSizeId(size.id)}
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
                    disabled={busy}
                  >
                    {busy ? "처리 중..." : "장바구니"}
                  </button>

                  <button
                    type="button"
                    className="product-detail-btn product-detail-btn--primary"
                    onClick={goToOrder}
                    disabled={busy}
                  >
                    바로구매
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
                    value={
                      product.spec.balanceMm ? `${product.spec.balanceMm} mm` : "-"
                    }
                  />
                  <SpecCard
                    label="Length"
                    value={
                      product.spec.lengthIn ? `${product.spec.lengthIn} in` : "-"
                    }
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