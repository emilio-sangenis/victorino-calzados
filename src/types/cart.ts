import { Product, ProductVariant } from "@/types/product";

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}