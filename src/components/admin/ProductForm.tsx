"use client";

// Reutiliza el mismo formulario para crear y editar los datos comerciales de un producto.
import { useActionState, useEffect } from "react";
import Link from "next/link";
import {
  createProduct,
  updateProduct,
  type ProductFormState,
} from "@/app/admin/productos/actions";
import type { ProductFormValues } from "@/lib/product-validation";

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: number;
  initialValues: ProductFormValues;
};

const initialState: ProductFormState = {};

export default function ProductForm({
  mode,
  productId,
  initialValues,
}: ProductFormProps) {
  const action =
    mode === "edit" && productId
      ? updateProduct.bind(null, productId)
      : createProduct;
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (mode === "create" && state.success) {
      // Regresa al listado mediante una carga completa para mostrar el producto recién creado.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/admin/productos");
    }
  }, [mode, state.success]);

  return (
    <form action={formAction} className="mt-10 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          id="code"
          label="Código"
          defaultValue={initialValues.code}
          error={state.fieldErrors?.code}
          maxLength={100}
          placeholder="Ej.: URB-004"
          hint="Usá tres letras que identifiquen la categoría, un guion y tres números."
        />

        <FormField
          id="name"
          label="Nombre"
          defaultValue={initialValues.name}
          error={state.fieldErrors?.name}
          maxLength={200}
        />

        <FormField
          id="category"
          label="Categoría"
          defaultValue={initialValues.category}
          error={state.fieldErrors?.category}
          maxLength={100}
        />

        <FormField
          id="price"
          label="Precio en pesos"
          type="number"
          min="0"
          step="1"
          defaultValue={initialValues.price}
          error={state.fieldErrors?.price}
        />

        <FormField
          id="image"
          label="Representación visual actual"
          defaultValue={initialValues.image}
          error={state.fieldErrors?.image}
          maxLength={500}
          hint="Por ahora puede ser un emoji, hasta implementar la carga de imágenes."
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={initialValues.description}
          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
        />
        {state.fieldErrors?.description && (
          <p className="mt-2 text-sm text-red-700">
            {state.fieldErrors.description}
          </p>
        )}
      </div>

      {mode === "create" && (
        <p className="rounded-xl bg-stone-100 px-4 py-3 text-sm text-neutral-600">
          El producto se creará inactivo. Podrás publicarlo desde el listado cuando tenga variantes y stock.
        </p>
      )}

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {mode === "edit" && state.success && (
        <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Los cambios se guardaron correctamente.
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/admin/productos"
          className="rounded-xl border border-stone-300 px-5 py-3 text-center font-semibold hover:bg-stone-100"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-neutral-900 px-5 py-3 font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? "Guardando..."
            : mode === "create"
              ? "Crear producto"
              : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}

type FormFieldProps = {
  id: keyof ProductFormValues;
  label: string;
  defaultValue: string;
  error?: string;
  hint?: string;
  type?: "text" | "number";
  min?: string;
  step?: string;
  maxLength?: number;
  placeholder?: string;
};

function FormField({
  id,
  label,
  defaultValue,
  error,
  hint,
  type = "text",
  min,
  step,
  maxLength,
  placeholder,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        min={min}
        step={step}
        maxLength={maxLength}
        placeholder={placeholder}
        required
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
      />
      {hint && <p className="mt-2 text-xs text-neutral-500">{hint}</p>}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
