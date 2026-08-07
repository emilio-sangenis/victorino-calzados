// Administra el carrito global, permite modificarlo y lo sincroniza con localStorage entre recargas.
"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { CartItem } from "@/types/cart";
import { Product, ProductVariant } from "@/types/product";

type CartContextType = {
  items: CartItem[];

  addItem: (
    product: Product,
    variant: ProductVariant
  ) => void;

  updateQuantity: (
    productId: number,
    variantId: number,
    quantity: number
  ) => void;

  removeItem: (
    productId: number,
    variantId: number
  ) => void;

  clearCart: () => void;
};

const CartContext =
  createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "victorino-cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem(STORAGE_KEY);

    if (storedCart) {
      try {
        const parsedCart: CartItem[] =
          JSON.parse(storedCart);

        setItems(parsedCart);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );
  }, [items, isHydrated]);

  function addItem(
    product: Product,
    variant: ProductVariant
  ) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.product.id === product.id &&
          item.variant.id === variant.id
      );

      if (existingItem) {
        if (existingItem.quantity >= variant.stock) {
          return currentItems;
        }

        return currentItems.map((item) =>
          item.product.id === product.id &&
          item.variant.id === variant.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          product,
          variant,
          quantity: 1,
        },
      ];
    });
  }

  function updateQuantity(
    productId: number,
    variantId: number,
    quantity: number
  ) {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (
          item.product.id === productId &&
          item.variant.id === variantId
        ) {
          const safeQuantity = Math.max(
            1,
            Math.min(
              quantity,
              item.variant.stock
            )
          );

          return {
            ...item,
            quantity: safeQuantity,
          };
        }

        return item;
      })
    );
  }

  function removeItem(
    productId: number,
    variantId: number
  ) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.variant.id === variantId
          )
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}