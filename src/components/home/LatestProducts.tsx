"use client";

import ProductCard from "@/components/product/ProductCard";
import type { ProductListItem } from "@/types/product";

type Props = {
  products: ProductListItem[];
  isLogin: boolean | null;
};

export default function LatestProducts({ products, isLogin }: Props) {
  return (
    <section style={{ marginBottom: 48 }}>
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

      {products.length === 0 ? (
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}