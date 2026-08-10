"use client";

// Permite activar o desactivar un producto y comunica el estado de la operación.
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setProductActive } from "@/app/admin/productos/actions";

type ProductActiveToggleProps = {
  productId: number;
  active: boolean;
};

export default function ProductActiveToggle({
  productId,
  active,
}: ProductActiveToggleProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    setError(null);

    startTransition(async () => {
      const result = await setProductActive(productId, !active);

      if (!result.success) {
        setError(result.error ?? "No se pudo actualizar el producto.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        className={`rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          active
            ? "border border-stone-300 bg-white text-neutral-700 hover:bg-stone-100"
            : "bg-neutral-900 text-white hover:bg-neutral-700"
        }`}
      >
        {pending
          ? "Guardando..."
          : active
            ? "Desactivar"
            : "Activar"}
      </button>

      {error && (
        <p role="alert" className="max-w-48 text-right text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
