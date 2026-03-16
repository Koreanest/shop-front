"use client";

import ProductCard from "@/components/product/ProductCard";
import type { ProductListItem } from "@/types/product";

type Props = {
  products: ProductListItem[];
  title?: string;
};

export default function FeaturedProducts({
  products,
  title = "추천 상품",
}: Props) {
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
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h2>
      </div>

      {products.length === 0 ? (
        <p style={{ color: "#777" }}>추천 상품이 없습니다.</p>
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