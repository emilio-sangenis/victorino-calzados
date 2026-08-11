// Administra las combinaciones de color, talle y stock pertenecientes a un producto.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VariantForm from "@/components/admin/VariantForm";
import { prisma } from "@/lib/prisma";

type ProductVariantsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Variantes y stock | Administración",
};

export default async function ProductVariantsPage({
  params,
}: ProductVariantsPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      variants: {
        orderBy: [{ color: "asc" }, { size: "asc" }],
      },
    },
  });

  if (!product) {
    notFound();
  }

  const totalStock = product.variants.reduce(
    (total, variant) => total + variant.stock,
    0
  );
  const skuExample = `${product.code ?? `PROD-${product.id}`}-NEG-39`;
  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);

  return (
    <main className="min-h-screen bg-stone-300 px-6 py-12 text-neutral-900">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/admin/productos"
              className="text-sm font-semibold text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Volver a productos
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
              {product.code ?? "Sin código"}
            </p>
            <h1 className="mt-2 text-4xl font-bold">{product.name}</h1>
            <p className="mt-3 text-neutral-600">Variantes y stock por color y talle.</p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
              <p className="text-sm text-neutral-500">Variantes</p>
              <p className="text-2xl font-bold">{product.variants.length}</p>
            </div>
            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
              <p className="text-sm text-neutral-500">Stock total</p>
              <p className="text-2xl font-bold">{totalStock}</p>
            </div>
          </div>
        </div>

        <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Agregar variante</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Formato sugerido de SKU: {skuExample}
          </p>
          <div className="mt-6">
            <VariantForm
              mode="create"
              productId={product.id}
              skuExample={skuExample}
              initialValues={{
                sku: "",
                color: "",
                size: "",
                stock: "",
              }}
            />
          </div>
        </section>

        <div className="mt-8 space-y-4">
          {product.variants.map((variant) => (
            <article key={variant.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="font-bold">
                    {variant.color} · Talle {variant.size}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Actualizada el {formatDate(variant.updatedAt)}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    variant.stock > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-stone-100 text-neutral-500"
                  }`}
                >
                  {variant.stock > 0 ? `${variant.stock} unidades` : "Sin stock"}
                </span>
              </div>

              <VariantForm
                mode="edit"
                productId={product.id}
                variantId={variant.id}
                skuExample={skuExample}
                initialValues={{
                  sku: variant.sku ?? "",
                  color: variant.color,
                  size: String(variant.size),
                  stock: String(variant.stock),
                }}
              />
            </article>
          ))}

          {product.variants.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center text-neutral-500 shadow-sm">
              Este producto todavía no tiene variantes.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
