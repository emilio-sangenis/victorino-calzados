// Construye el dashboard administrativo utilizando datos reales de productos, stock y pedidos almacenados en PostgreSQL.
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [
    productCount,
    orderCount,
    variants,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),

    prisma.order.count(),

    prisma.productVariant.findMany({
      select: {
        stock: true,
      },
    }),

    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  const totalStock = variants.reduce(
    (total, variant) => total + variant.stock,
    0
  );

  const totalSales = recentOrders.reduce(
    (total, order) => total + order.total,
    0
  );

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
            <p className="text-xl font-bold tracking-[0.15em]">
              VICTORINO
            </p>

            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
              Administración
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-100"
          >
            Ver tienda
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
            Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Panel administrativo
          </h1>

          <p className="mt-3 text-neutral-600">
            Resumen general de Victorino Calzados.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">
              Productos
            </p>

            <p className="mt-3 text-3xl font-bold">
              {productCount}
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">
              Pedidos
            </p>

            <p className="mt-3 text-3xl font-bold">
              {orderCount}
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">
              Unidades en stock
            </p>

            <p className="mt-3 text-3xl font-bold">
              {totalStock}
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">
              Últimos 5 pedidos
            </p>

            <p className="mt-3 text-3xl font-bold">
              {formatPrice(totalSales)}
            </p>
          </article>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Pedidos recientes
              </h2>

              <span className="text-sm text-neutral-500">
                Últimos 5
              </span>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-stone-200 text-sm text-neutral-500">
                  <tr>
                    <th className="pb-3 font-medium">
                      Pedido
                    </th>

                    <th className="pb-3 font-medium">
                      Cliente
                    </th>

                    <th className="pb-3 font-medium">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-stone-100"
                    >
                      <td className="py-4 font-medium">
                        {order.orderNumber}
                      </td>

                      <td className="py-4">
                        {order.firstName} {order.lastName}
                      </td>

                      <td className="py-4">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {recentOrders.length === 0 && (
                <p className="py-8 text-center text-neutral-500">
                  Todavía no hay pedidos.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-neutral-900 p-6 text-white shadow-sm">
            <h2 className="text-xl font-bold">
              Gestión
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Desde acá vamos a administrar el catálogo,
              stock y pedidos.
            </p>

            <div className="mt-8 space-y-3">
              <Link
                href="/admin/productos"
                className="block rounded-xl bg-neutral-800 px-4 py-3 hover:bg-neutral-700"
              >
                Productos
              </Link>
              
            <Link
            // Navega desde el dashboard al listado completo de pedidos.
            href="/admin/pedidos"
            className="block rounded-xl bg-neutral-800 px-4 py-3 hover:bg-neutral-700"
            >
            Pedidos
            </Link>

              <div className="rounded-xl bg-neutral-800 px-4 py-3">
                Stock
              </div>

              <div className="rounded-xl bg-neutral-800 px-4 py-3">
                Importar CSV
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
