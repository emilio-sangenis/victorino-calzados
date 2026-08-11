// Lista el catálogo completo con su disponibilidad, variantes y stock para administrarlo sin eliminar datos históricos.
import type { Metadata } from "next";
import Link from "next/link";
import ProductActiveToggle from "@/components/admin/ProductActiveToggle";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Productos | Administración",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        select: {
          stock: true,
        },
      },
      _count: {
        select: {
          variants: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="min-h-screen bg-stone-100 text-neutral-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xl font-bold tracking-[0.15em]">VICTORINO</p>
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
              Administración
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin"
              className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-100"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
            >
              Ver tienda
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Catálogo
            </p>
            <h1 className="mt-2 text-4xl font-bold">Productos</h1>
            <p className="mt-3 text-neutral-600">
              Consultá el catálogo y controlá qué productos se muestran en la tienda.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
              <p className="text-sm text-neutral-500">Total de productos</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>

            <Link
              href="/admin/productos/nuevo"
              className="rounded-xl bg-neutral-900 px-5 py-3 font-semibold text-white hover:bg-neutral-700"
            >
              Nuevo producto
            </Link>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left">
              <thead className="border-b border-stone-200 bg-stone-50 text-sm text-neutral-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Producto</th>
                  <th className="px-6 py-4 font-medium">Código</th>
                  <th className="px-6 py-4 font-medium">Categoría</th>
                  <th className="px-6 py-4 text-right font-medium">Precio</th>
                  <th className="px-6 py-4 text-right font-medium">Variantes</th>
                  <th className="px-6 py-4 text-right font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const totalStock = product.variants.reduce(
                    (total, variant) => total + variant.stock,
                    0
                  );

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-stone-100 last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-11 items-center justify-center rounded-xl bg-stone-100 text-2xl">
                            {product.image}
                          </span>
                          <span className="font-semibold">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {product.code ?? "Sin código"}
                      </td>
                      <td className="px-6 py-4 text-sm">{product.category}</td>
                      <td className="px-6 py-4 text-right font-semibold">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {product._count.variants}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold">
                        {totalStock}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                            product.active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-stone-100 text-neutral-500"
                          }`}
                        >
                          {product.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/admin/productos/${product.id}/variantes`}
                            className="text-sm font-semibold underline-offset-4 hover:underline"
                          >
                            Variantes
                          </Link>

                          <Link
                            href={`/admin/productos/${product.id}/editar`}
                            className="text-sm font-semibold underline-offset-4 hover:underline"
                          >
                            Editar
                          </Link>

                          {product.active && (
                            <Link
                              href={`/productos/${product.id}`}
                              className="text-sm font-semibold underline-offset-4 hover:underline"
                            >
                              Ver
                            </Link>
                          )}

                          <ProductActiveToggle
                            productId={product.id}
                            active={product.active}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="p-10 text-center text-neutral-500">
              Todavía no hay productos registrados.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
