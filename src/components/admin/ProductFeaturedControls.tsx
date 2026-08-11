"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  moveFeaturedProduct,
  setProductFeatured,
} from "@/app/admin/productos/actions";

type ProductFeaturedControlsProps = {
  productId: number;
  featured: boolean;
  position: number | null;
};

export default function ProductFeaturedControls({
  productId,
  featured,
  position,
}: ProductFeaturedControlsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function runAction(action: () => Promise<{ success: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        setError(result.error ?? "No se pudo actualizar la selección.");
        return;
      }
      router.refresh();
    });
  }

  if (!featured || !position) {
    return (
      <div>
        <button
          type="button"
          disabled={pending}
          onClick={() => runAction(() => setProductFeatured(productId, true))}
          className="rounded-lg border border-fuchsia-300 px-3 py-2 text-xs font-semibold text-fuchsia-700 transition hover:bg-fuchsia-50 disabled:opacity-50"
        >
          {pending ? "Guardando…" : "Destacar"}
        </button>
        {error && <p className="mt-2 max-w-40 text-xs text-red-700">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-bold text-fuchsia-700">
          #{position}
        </span>
        <button
          type="button"
          disabled={pending || position === 1}
          onClick={() => runAction(() => moveFeaturedProduct(productId, -1))}
          aria-label="Mover destacado hacia arriba"
          className="size-8 rounded-lg border border-stone-300 text-sm disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={pending || position === 4}
          onClick={() => runAction(() => moveFeaturedProduct(productId, 1))}
          aria-label="Mover destacado hacia abajo"
          className="size-8 rounded-lg border border-stone-300 text-sm disabled:opacity-30"
        >
          ↓
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => runAction(() => setProductFeatured(productId, false))}
          className="text-xs font-semibold text-red-700 hover:underline disabled:opacity-50"
        >
          Quitar
        </button>
      </div>
      {error && <p className="mt-2 max-w-48 text-xs text-red-700">{error}</p>}
    </div>
  );
}
