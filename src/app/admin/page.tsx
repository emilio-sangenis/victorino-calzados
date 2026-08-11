// Construye el dashboard administrativo utilizando datos reales de productos, stock y pedidos almacenados en PostgreSQL.
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    salesSummary,
    criticalStockCount,
    pendingOrderCount,
    confirmedOrderCount,
    preparingOrderCount,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
      _count: { id: true },
    }),

    prisma.productVariant.count({ where: { stock: { lte: 3 } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "CONFIRMED" } }),
    prisma.order.count({ where: { status: "PREPARING" } }),

    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  const salesLastThirtyDays = salesSummary._sum.total ?? 0;
  const ordersLastThirtyDays = salesSummary._count.id;
  const averageTicket = ordersLastThirtyDays
    ? Math.round(salesLastThirtyDays / ordersLastThirtyDays)
    : 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="min-h-screen bg-stone-300 text-neutral-900">
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
          <Link
            href="/admin/pedidos"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm text-neutral-500">Ventas · últimos 30 días</p>
            <p className="mt-3 text-3xl font-bold">{formatPrice(salesLastThirtyDays)}</p>
          </Link>

          <Link href="/admin/pedidos" className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm text-neutral-500">Pedidos · últimos 30 días</p>
            <p className="mt-3 text-3xl font-bold">{ordersLastThirtyDays}</p>
          </Link>

          <Link href="/admin/pedidos" className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm text-neutral-500">Ticket promedio</p>
            <p className="mt-3 text-3xl font-bold">{formatPrice(averageTicket)}</p>
          </Link>

          <Link href="/admin/productos" className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm text-neutral-500">Variantes con stock crítico</p>
            <p className="mt-3 text-3xl font-bold text-red-700">{criticalStockCount}</p>
            <p className="mt-2 text-xs text-neutral-500">3 unidades o menos</p>
          </Link>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link href="/admin/pedidos" className="rounded-2xl bg-neutral-900 p-5 text-white transition hover:bg-neutral-800">
            <p className="text-sm text-neutral-400">Pendientes</p>
            <p className="mt-2 text-2xl font-bold">{pendingOrderCount}</p>
          </Link>
          <Link href="/admin/pedidos" className="rounded-2xl bg-neutral-900 p-5 text-white transition hover:bg-neutral-800">
            <p className="text-sm text-neutral-400">Confirmados</p>
            <p className="mt-2 text-2xl font-bold">{confirmedOrderCount}</p>
          </Link>
          <Link href="/admin/pedidos" className="rounded-2xl bg-neutral-900 p-5 text-white transition hover:bg-neutral-800">
            <p className="text-sm text-neutral-400">En preparación</p>
            <p className="mt-2 text-2xl font-bold">{preparingOrderCount}</p>
          </Link>
        </section>

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
