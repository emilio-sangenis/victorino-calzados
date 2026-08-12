// Permite seleccionar color y talle de un producto, valida stock y agrega la variante elegida al carrito.
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

type ProductSelectorProps = {
  product: Product;
};

export default function ProductSelector({
  product,
}: ProductSelectorProps) {
  const { addItem } = useCart();

  const variants = product.variants;

  const colors: string[] = [
    ...new Set(
      variants.map((variant) => variant.color)
    ),
  ];

  const [selectedColor, setSelectedColor] =
    useState<string | null>(null);

  const [selectedSize, setSelectedSize] =
    useState<number | null>(null);

  const variantsForSelectedColor = variants.filter(
    (variant) => variant.color === selectedColor
  );

  const selectedVariant = variants.find(
    (variant) =>
      variant.color === selectedColor &&
      variant.size === selectedSize
  );
  const hasStock = variants.some((variant) => variant.stock > 0);

  function handleColorSelection(color: string) {
    setSelectedColor(color);
    setSelectedSize(null);
  }

  return (
    <div className="mt-5 flex flex-1 flex-col sm:mt-6">
      <div>
        <p className="mb-2 font-semibold leading-tight">
          Color
        </p>

        <div className="flex flex-wrap gap-2.5">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() =>
                handleColorSelection(color)
              }
              className={`rounded-xl border px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base ${
                selectedColor === color
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-stone-300 bg-white hover:border-neutral-900"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {selectedColor && (
        <div className="mt-5 sm:mt-6">
          <p className="mb-2 font-semibold leading-tight">
            Talle
          </p>

          <div className="flex flex-wrap gap-2.5">
            {variantsForSelectedColor.map(
              (variant) => (
                <button
                  key={variant.id}
                  disabled={variant.stock === 0}
                  onClick={() =>
                    setSelectedSize(variant.size)
                  }
                  className={`rounded-xl border px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base ${
                    variant.stock === 0
                      ? "cursor-not-allowed border-stone-200 bg-stone-200 text-stone-400"
                      : selectedSize === variant.size
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-stone-300 bg-white hover:border-neutral-900"
                  }`}
                >
                  {variant.size}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {selectedVariant && (
        <p className="mt-4 text-sm leading-tight text-neutral-600">
          Stock disponible:{" "}
          <strong>
            {selectedVariant.stock}
          </strong>
        </p>
      )}

      {hasStock && (
        <button
          type="button"
          disabled={!selectedVariant || selectedVariant.stock === 0}
          onClick={() => {
            if (selectedVariant && selectedVariant.stock > 0) {
              addItem(product, selectedVariant);
            }
          }}
          className={`mt-3 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white transition sm:px-6 sm:py-3.5 sm:text-base lg:mt-auto ${
            selectedVariant && selectedVariant.stock > 0
              ? "cursor-pointer bg-neutral-900 hover:bg-neutral-700"
              : "cursor-not-allowed bg-neutral-400"
          }`}
        >
          Agregar al carrito
        </button>
      )}

      {!hasStock && (
        <span className="mt-3 block w-full cursor-not-allowed rounded-xl bg-neutral-400 px-5 py-3 text-center text-sm font-semibold text-white sm:px-6 sm:py-3.5 sm:text-base lg:mt-auto">
          Sin stock
        </span>
      )}
    </div>
  );
}
