import Link from "next/link";
import type { OrderStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type AdminOrdersPageProps = {
  searchParams: Promise<{
    envio?: string;
    pago?: string;
    estado?: string;
    cliente?: string;
  }>;
};

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PREPARING: "En preparación",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const shippingMethod = ["delivery", "pickup"].includes(params.envio ?? "")
    ? params.envio
    : undefined;
  const paymentMethod = ["mercadopago", "transfer"].includes(params.pago ?? "")
    ? params.pago
    : undefined;
  const status = ORDER_STATUSES.includes(params.estado as OrderStatus)
    ? (params.estado as OrderStatus)
    : undefined;
  const customer = params.cliente?.trim() ?? "";
  const filtersActive = Boolean(shippingMethod || paymentMethod || status || customer);

  const orders = await prisma.order.findMany({
    where: {
      ...(shippingMethod ? { shippingMethod } : {}),
      ...(paymentMethod ? { paymentMethod } : {}),
      ...(status ? { status } : {}),
      ...(customer
        ? {
            OR: [
              { firstName: { contains: customer, mode: "insensitive" } },
              { lastName: { contains: customer, mode: "insensitive" } },
              { email: { contains: customer, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
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
    <main className="min-h-screen bg-stone-300 text-neutral-900">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Gestión
            </p>
            <h1 className="mt-2 text-4xl font-bold">Pedidos</h1>
            <p className="mt-3 text-neutral-600">
              Consultá las órdenes registradas en la tienda.
            </p>
          </div>

          <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
            <p className="text-sm text-neutral-500">
              {filtersActive ? "Resultados" : "Total de pedidos"}
            </p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
        </div>

        <form className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="Envío" name="envio" defaultValue={shippingMethod}>
              <option value="">Todos</option>
              <option value="delivery">Domicilio</option>
              <option value="pickup">Retiro</option>
            </FilterSelect>

            <FilterSelect label="Pago" name="pago" defaultValue={paymentMethod}>
              <option value="">Todos</option>
              <option value="mercadopago">Mercado Pago</option>
              <option value="transfer">Transferencia</option>
            </FilterSelect>

            <FilterSelect label="Estado" name="estado" defaultValue={status}>
              <option value="">Todos</option>
              {ORDER_STATUSES.map((orderStatus) => (
                <option key={orderStatus} value={orderStatus}>
                  {STATUS_LABELS[orderStatus]}
                </option>
              ))}
            </FilterSelect>

            <label className="text-sm font-medium">
              Cliente
              <input
                name="cliente"
                type="search"
                defaultValue={customer}
                placeholder="Nombre, apellido o email"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-neutral-900"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-3">
            {filtersActive && (
              <Link href="/admin/pedidos" className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold hover:bg-stone-100">
                Limpiar filtros
              </Link>
            )}
            <button type="submit" className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-700">
              Filtrar
            </button>
          </div>
        </form>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-stone-200 bg-stone-50 text-sm text-neutral-500">
                <tr>
                  {['Pedido', 'Fecha', 'Cliente', 'Envío', 'Pago', 'Estado'].map((heading) => (
                    <th key={heading} className="px-6 py-4 font-medium">{heading}</th>
                  ))}
                  <th className="px-6 py-4 text-right font-medium">Total</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-100 last:border-b-0">
                    <td className="px-6 py-4 font-semibold">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.firstName} {order.lastName}</p>
                      <p className="text-sm text-neutral-500">{order.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">{order.shippingMethod === "delivery" ? "Domicilio" : "Retiro"}</td>
                    <td className="px-6 py-4 text-sm">{order.paymentMethod === "mercadopago" ? "Mercado Pago" : "Transferencia"}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/pedidos/${order.id}`} className="text-sm font-semibold underline-offset-4 hover:underline">
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
              {filtersActive
                ? "No encontramos pedidos con esos filtros."
                : "Todavía no hay pedidos registrados."}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function FilterSelect({
  label,
  name,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-neutral-900"
      >
        {children}
      </select>
    </label>
  );
}
