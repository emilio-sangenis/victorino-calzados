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

  function handleColorSelection(color: string) {
    setSelectedColor(color);
    setSelectedSize(null);
  }

  return (
    <div className="mt-8">
      <div>
        <p className="mb-3 font-semibold">
          Color
        </p>

        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() =>
                handleColorSelection(color)
              }
              className={`rounded-xl border px-5 py-3 ${
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
        <div className="mt-8">
          <p className="mb-3 font-semibold">
            Talle
          </p>

          <div className="flex flex-wrap gap-3">
            {variantsForSelectedColor.map(
              (variant) => (
                <button
                  key={variant.id}
                  disabled={variant.stock === 0}
                  onClick={() =>
                    setSelectedSize(variant.size)
                  }
                  className={`rounded-xl border px-5 py-3 ${
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
        <p className="mt-5 text-sm text-neutral-600">
          Stock disponible:{" "}
          <strong>
            {selectedVariant.stock}
          </strong>
        </p>
      )}

      <button
        disabled={
          !selectedVariant ||
          selectedVariant.stock === 0
        }
        onClick={() => {
          if (selectedVariant) {
            addItem(product, selectedVariant);
          }
        }}
        // Muestra el botón de compra con cursor interactivo cuando está habilitado y cursor bloqueado cuando no puede utilizarse.
        className="mt-8 w-full cursor-pointer rounded-xl bg-neutral-900 px-6 py-4 font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        Agregar al carrito
      </button>
    </div>
  );
}