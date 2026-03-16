"use client";

import Link from "next/link";
import { API_ROOT } from "@/lib/api";
import type { ProductListItem } from "@/types/product";

type Props = {
  product: ProductListItem;
};

function resolveImageUrl(imageUrl: string | null) {
  if (!imageUrl) return "/no-image.png";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${API_ROOT}${imageUrl}`;
}

export default function ProductCard({ product }: Props) {
  const subtitle = product.series || product.categoryName || "카테고리 정보 없음";
  const imageSrc = resolveImageUrl(product.imageUrl);

  return (
    <Link
      href={`/products/${product.id}`}
      className="product-card"
      style={{
        display: "block",
        color: "inherit",
        textDecoration: "none",
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
      }}
    >
      <div
        style={{
          aspectRatio: "1 / 1",
          background: "#f7f7f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={product.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <span style={{ color: "#999" }}>이미지 없음</span>
        )}
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 13, color: "#777", marginBottom: 6 }}>
          {product.brandName ?? "브랜드 없음"}
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 8,
            lineHeight: 1.35,
          }}
        >
          {product.title}
        </div>

        <div
          style={{
            fontSize: 14,
            color: "#666",
            marginBottom: 10,
            minHeight: 20,
          }}
        >
          {subtitle}
        </div>

        <div style={{ fontSize: 18, fontWeight: 700 }}>
          {Number(product.price ?? 0).toLocaleString()}원
        </div>
      </div>
    </Link>
  );
}