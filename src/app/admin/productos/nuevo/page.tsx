// Presenta el formulario para registrar un producto nuevo sin publicarlo todavía en la tienda.
import type { Metadata } from "next";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Nuevo producto | Administración",
};

export default function NewProductPage() {
  return (
    <main className="min-h-screen bg-stone-100 px-6 py-12 text-neutral-900">
      <section className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm sm:p-10">
        <Link
          href="/admin/productos"
          className="text-sm font-semibold text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
        >
          Volver a productos
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Catálogo
        </p>
        <h1 className="mt-2 text-4xl font-bold">Nuevo producto</h1>
        <p className="mt-3 text-neutral-600">
          Cargá los datos comerciales. Las variantes y el stock se administrarán en el siguiente módulo.
        </p>

        <ProductForm
          mode="create"
          initialValues={{
            code: "",
            name: "",
            description: "",
            category: "",
            price: "",
            image: "",
          }}
        />
      </section>
    </main>
  );
}
