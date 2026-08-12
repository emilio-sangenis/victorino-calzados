"use client";

import { useState } from "react";

type ProductGalleryImage = {
  id: number;
  url: string;
  alt: string;
  color: string | null;
};

type ProductGalleryProps = {
  images: ProductGalleryImage[];
  fallback: string;
  productName: string;
};

export default function ProductGallery({
  images,
  fallback,
  productName,
}: ProductGalleryProps) {
  const [selectedImageId, setSelectedImageId] = useState(images[0]?.id ?? null);
  const selectedImage =
    images.find((image) => image.id === selectedImageId) ?? images[0];

  if (!selectedImage) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-stone-200">
        <span className="text-[180px]" role="img" aria-label={productName}>
          {fallback}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:max-w-[800px] lg:grid-cols-[100px_minmax(0,680px)] lg:gap-5">
      <div className="aspect-square overflow-hidden rounded-2xl bg-stone-200 lg:col-start-2 lg:row-start-1">
        {/* Permite mostrar tanto imágenes administradas en Blob como URLs externas. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={selectedImage.id}
          src={selectedImage.url}
          alt={selectedImage.alt}
          className="size-full object-cover"
        />
      </div>

      <div className="mt-5 grid auto-cols-[104px] grid-flow-col gap-4 overflow-x-auto pb-2 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex lg:flex-col lg:overflow-visible lg:pb-0">
          {images.map((image) => {
            const selected = image.id === selectedImage.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImageId(image.id)}
                aria-label={`Ver ${image.alt}${image.color ? `, color ${image.color}` : ""}`}
                aria-pressed={selected}
                className={`aspect-square overflow-hidden rounded-lg border-2 bg-white transition ${
                  selected
                    ? "border-fuchsia-500 ring-2 ring-fuchsia-500/20"
                    : "border-transparent hover:border-stone-500"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt=""
                  className="size-full object-cover"
                />
              </button>
            );
          })}
      </div>
    </div>
  );
}
