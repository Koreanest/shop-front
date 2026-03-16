export type ProductListItem = {
  id: number;
  brandId: number | null;
  brandName: string | null;
  title: string;
  series: string | null;
  price: number;
  status: string | null;
  slug: string | null;
  categoryId: number | null;
  categoryName: string | null;
  imageUrl: string | null;
  sizes: ProductSizeItem[];
};

export type ProductSpec = {
  headSizeSqIn: number | null;
  unstrungWeightG: number | null;
  balanceMm: number | null;
  lengthIn: number | null;
  patternMain: number | null;
  patternCross: number | null;
  stiffnessRa: number | null;
};

export type ProductSizeItem = {
  id: number;
  size: string;
  stock: number;
};

export type ProductDetail = {
  id: number;
  brandId: number | null;
  brandName: string | null;
  title: string;
  series: string | null;
  description: string | null;
  price: number;
  status: string | null;
  slug: string | null;
  categoryId: number | null;
  categoryName: string | null;
  imageUrl: string | null;
  spec: ProductSpec | null;
  sizes: ProductSizeItem[];
};