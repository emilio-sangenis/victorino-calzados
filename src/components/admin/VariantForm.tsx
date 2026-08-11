"use client";

// Reutiliza un formulario compacto para crear o editar una variante y su stock.
import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createVariant,
  updateVariant,
  type VariantFormState,
} from "@/app/admin/productos/[id]/variantes/actions";
import type { VariantFormValues } from "@/lib/variant-validation";

type VariantFormProps = {
  mode: "create" | "edit";
  productId: number;
  variantId?: number;
  initialValues: VariantFormValues;
  skuExample: string;
};

const initialState: VariantFormState = {};

export default function VariantForm({
  mode,
  productId,
  variantId,
  initialValues,
  skuExample,
}: VariantFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const action =
    mode === "edit" && variantId
      ? updateVariant.bind(null, productId, variantId)
      : createVariant.bind(null, productId);
  const fieldPrefix = variantId ? `variant-${variantId}` : `product-${productId}-new`;
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      if (mode === "create") {
        formRef.current?.reset();
      }

      router.refresh();
    }
  }, [mode, router, state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <VariantField
          fieldPrefix={fieldPrefix}
          id="sku"
          label="SKU"
          defaultValue={initialValues.sku}
          placeholder={`Ej.: ${skuExample}`}
          error={state.fieldErrors?.sku}
        />
        <VariantField
          fieldPrefix={fieldPrefix}
          id="color"
          label="Color"
          defaultValue={initialValues.color}
          placeholder="Ej.: Negro"
          error={state.fieldErrors?.color}
        />
        <VariantField
          fieldPrefix={fieldPrefix}
          id="size"
          label="Talle"
          type="number"
          min="1"
          step="1"
          defaultValue={initialValues.size}
          placeholder="Ej.: 39"
          error={state.fieldErrors?.size}
        />
        <VariantField
          fieldPrefix={fieldPrefix}
          id="stock"
          label="Stock"
          type="number"
          min="0"
          step="1"
          defaultValue={initialValues.stock}
          placeholder="Ej.: 5"
          error={state.fieldErrors?.stock}
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {mode === "edit" && state.success && (
        <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Variante actualizada.
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? "Guardando..."
            : mode === "create"
              ? "Agregar variante"
              : "Guardar variante"}
        </button>
      </div>
    </form>
  );
}

type VariantFieldProps = {
  fieldPrefix: string;
  id: keyof VariantFormValues;
  label: string;
  defaultValue: string;
  placeholder: string;
  error?: string;
  type?: "text" | "number";
  min?: string;
  step?: string;
};

function VariantField({
  fieldPrefix,
  id,
  label,
  defaultValue,
  placeholder,
  error,
  type = "text",
  min,
  step,
}: VariantFieldProps) {
  const inputId = `${fieldPrefix}-${id}`;

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        name={id}
        type={type}
        min={min}
        step={step}
        required
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
      />
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
