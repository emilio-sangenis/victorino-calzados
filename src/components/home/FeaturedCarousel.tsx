"use client";

import { useState, useSyncExternalStore } from "react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

type FeaturedCarouselProps = {
  products: Product[];
};

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const perPage = useSyncExternalStore(
    subscribeToViewport,
    getItemsPerPage,
    getServerItemsPerPage
  );
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(products.length / perPage));
  const currentPage = Math.min(page, pageCount - 1);
  const firstVisibleIndex = Math.min(
    currentPage * perPage,
    Math.max(0, products.length - perPage)
  );

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${firstVisibleIndex * (100 / perPage)}%)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 px-2"
              style={{ width: `${100 / perPage}%` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {pageCount > 1 && (
        <>
          <button
            type="button"
            onClick={() => setPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            aria-label="Ver productos destacados anteriores"
            className="absolute left-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center px-2 text-4xl font-black text-neutral-900 transition hover:text-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-25 sm:-left-4 lg:-left-10"
          >
            &lt;
          </button>

          <button
            type="button"
            onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
            disabled={currentPage === pageCount - 1}
            aria-label="Ver más productos destacados"
            className="absolute right-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center px-2 text-4xl font-black text-neutral-900 transition hover:text-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-25 sm:-right-4 lg:-right-10"
          >
            &gt;
          </button>
        </>
      )}

      {pageCount > 1 && (
        <div
          className="mt-8 flex items-center justify-center gap-3"
          aria-label="Página de productos destacados"
        >
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPage(index)}
              aria-label={`Ir a la página ${index + 1}`}
              aria-current={currentPage === index ? "page" : undefined}
              className={`size-3.5 rounded-full border-2 transition-all ${
                currentPage === index
                  ? "border-fuchsia-500 bg-fuchsia-500"
                  : "border-neutral-600 bg-transparent hover:border-fuchsia-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function subscribeToViewport(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getItemsPerPage() {
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function getServerItemsPerPage() {
  return 1;
}
