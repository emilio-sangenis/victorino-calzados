// Lista todos los pedidos reales almacenados en PostgreSQL y permite navegar al detalle de cada orden.
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);

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
              Gestión
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Pedidos
            </h1>

            <p className="mt-3 text-neutral-600">
              Consultá las órdenes registradas en la tienda.
            </p>
          </div>

          <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
            <p className="text-sm text-neutral-500">
              Total de pedidos
            </p>

            <p className="text-2xl font-bold">
              {orders.length}
            </p>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-stone-200 bg-stone-50 text-sm text-neutral-500">
                <tr>
                  <th className="px-6 py-4 font-medium">
                    Pedido
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Fecha
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Cliente
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Envío
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Pago
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Estado
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Total
                  </th>

                  <th className="px-6 py-4" />
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-stone-100 last:border-b-0"
                  >
                    <td className="px-6 py-4 font-semibold">
                      {order.orderNumber}
                    </td>

                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium">
                        {order.firstName} {order.lastName}
                      </p>

                      <p className="text-sm text-neutral-500">
                        {order.email}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {order.shippingMethod === "delivery"
                        ? "Domicilio"
                        : "Retiro"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {order.paymentMethod === "mercadopago"
                        ? "Mercado Pago"
                        : "Transferencia"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-bold">
                      {formatPrice(order.total)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="text-sm font-semibold underline-offset-4 hover:underline"
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="p-10 text-center text-neutral-500">
              Todavía no hay pedidos registrados.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}