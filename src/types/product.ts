export interface ProductVariant {
  id: number;
  color: string;
  size: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  images?: {
    url: string;
    alt: string;
    color?: string | null;
  }[];
  variants: ProductVariant[];
}
