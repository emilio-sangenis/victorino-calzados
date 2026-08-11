"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import {
  getProductColorHex,
  normalizeProductColor,
} from "@/lib/product-colors";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const primaryImage = product.images?.[0];
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const selectedColorImage = selectedColor
    ? product.images?.find(
        (image) =>
          image.color && normalizeProductColor(image.color) === selectedColor
      )
    : null;
  const displayedImage = selectedColorImage ?? primaryImage;
  const hasStock = product.variants.some((variant) => variant.stock > 0);
  const availableColors = Array.from(
    new Map(
      product.variants
        .filter((variant) => variant.stock > 0)
        .map((variant) => [normalizeProductColor(variant.color), variant.color.trim()])
    ).values()
  );
  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <Link
        href={`/productos/${product.id}`}
        aria-label={`Ver ${product.name}`}
        className={`relative flex aspect-square items-center justify-center overflow-hidden bg-stone-200 ${
          hasStock ? "" : "grayscale"
        }`}
      >
          {displayedImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={displayedImage.url}
              src={displayedImage.url}
              alt={displayedImage.alt}
              className={`size-full object-cover transition duration-500 hover:scale-105 ${
                hasStock ? "" : "opacity-55"
              }`}
            />
          ) : (
            <span className="text-8xl">{product.image}</span>
          )}
          {!hasStock && (
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-neutral-700/80 py-3 text-center text-sm font-bold uppercase tracking-[0.25em] text-white">
              Sin stock
            </span>
          )}
      </Link>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          {product.category}
        </p>

        <h3 className="mt-2 text-lg font-semibold">
          {product.name}
        </h3>

        <p className="mt-3 text-xl font-bold">
          {formattedPrice}
        </p>

        {availableColors.length > 0 && (
          <div className="mt-4 flex min-h-7 flex-wrap items-center justify-center gap-2">
            {availableColors.map((color) => {
              const hex = getProductColorHex(color);

              return (
                <button
                  key={normalizeProductColor(color)}
                  type="button"
                  onClick={() => setSelectedColor(normalizeProductColor(color))}
                  title={color}
                  aria-label={`Disponible en color ${color}`}
                  aria-pressed={selectedColor === normalizeProductColor(color)}
                  className={`flex size-5 items-center justify-center rounded-full border text-[9px] font-bold uppercase text-neutral-700 shadow-sm transition ${
                    selectedColor === normalizeProductColor(color)
                      ? "border-fuchsia-500 ring-2 ring-fuchsia-500/30"
                      : "border-neutral-400 hover:scale-110"
                  }`}
                  style={hex ? { backgroundColor: hex } : undefined}
                >
                  {!hex && color.charAt(0)}
                </button>
              );
            })}
          </div>
        )}
        {hasStock ? (
          <Link
            href={`/productos/${product.id}`}
            className="mt-5 block w-full rounded-xl bg-neutral-900 px-4 py-3 text-center font-semibold text-white hover:bg-neutral-700"
          >
            Elegir talle y color
          </Link>
        ) : (
          <span className="mt-5 block w-full cursor-not-allowed rounded-xl bg-neutral-400 px-4 py-3 text-center font-semibold text-white">
            Sin stock
          </span>
        )}
      </div>
    </article>
  );
}
