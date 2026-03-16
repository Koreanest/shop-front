import api from "@/lib/api";
import type { PageResponse } from "@/types/common";
import type { ProductDetail, ProductListItem } from "@/types/product";

export async function getProducts(params?: {
  page?: number;
  size?: number;
  sort?: string;
  brandId?: number;
  categoryId?: number;
  keyword?: string;
}) {
  const res = await api.get<PageResponse<ProductListItem>>("/products", {
    params,
  });
  return res.data;
}

export async function getProductById(id: number) {
  const res = await api.get<ProductDetail>(`/products/${id}`);
  return res.data;
}

export async function getProductBySlug(slug: string) {
  const res = await api.get<ProductDetail>(`/products/slug/${slug}`);
  return res.data;
}