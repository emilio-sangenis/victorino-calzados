// Carga un producto existente y permite editar sus datos comerciales sin alterar variantes ni stock.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Editar producto | Administración",
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    notFound();
  }

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
        <h1 className="mt-2 text-4xl font-bold">Editar producto</h1>
        <p className="mt-3 text-neutral-600">
          Actualizá los datos comerciales de {product.name}.
        </p>

        <ProductForm
          mode="edit"
          productId={product.id}
          initialValues={{
            code: product.code ?? "",
            name: product.name,
            description: product.description,
            category: product.category,
            price: String(product.price),
            image: product.image,
          }}
        />
      </section>
    </main>
  );
}
