// Muestra el detalle completo de un pedido real, incluyendo cliente, envío, pago, productos e importes.
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
// Importa el selector interactivo que permite modificar el estado del pedido.
import OrderStatusSelector from "@/components/admin/OrderStatusSelector";

type AdminOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("es-AR", {
      dateStyle: "full",
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
              href="/admin/pedidos"
              className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-100"
            >
              Volver a pedidos
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
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Pedido
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              {order.orderNumber}
            </h1>

            <p className="mt-3 text-neutral-600">
              Creado el {formatDate(order.createdAt)}
            </p>
          </div>

          <span className="w-fit rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white">
            {order.status}
          </span>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Productos
              </h2>

              <div className="mt-6 space-y-5">
                {order.items.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col justify-between gap-4 border-b border-stone-100 pb-5 last:border-b-0 last:pb-0 sm:flex-row"
                  >
                    <div>
                      <p className="font-semibold">
                        {item.productName}
                      </p>

                      <p className="mt-1 text-sm text-neutral-500">
                        {item.color} · Talle {item.size}
                      </p>

                      <p className="mt-1 text-sm text-neutral-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm text-neutral-500">
                        {formatPrice(item.unitPrice)} c/u
                      </p>

                      <p className="mt-1 font-bold">
                        {formatPrice(
                          item.unitPrice * item.quantity
                        )}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Cliente
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-neutral-500">
                    Nombre
                  </p>

                  <p className="mt-1 font-medium">
                    {order.firstName} {order.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-500">
                    Email
                  </p>

                  <p className="mt-1 font-medium">
                    {order.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-500">
                    Teléfono
                  </p>

                  <p className="mt-1 font-medium">
                    {order.phone}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Envío
              </h2>

              <div className="mt-6">
                <p className="font-semibold">
                  {order.shippingMethod === "delivery"
                    ? "Envío a domicilio"
                    : "Retiro"}
                </p>

                {order.shippingMethod === "delivery" && (
                  <div className="mt-4 space-y-1 text-neutral-600">
                    <p>{order.address}</p>
                    <p>{order.city}</p>
                    <p>CP {order.postalCode}</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-bold">
              Resumen
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-neutral-600">
                  Subtotal
                </span>

                <span>
                  {formatPrice(order.subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-600">
                  Envío
                </span>

                <span>
                  {order.shippingCost === 0
                    ? "Gratis"
                    : formatPrice(order.shippingCost)}
                </span>
              </div>

              <div className="flex justify-between border-t border-stone-200 pt-4 text-xl font-bold">
                <span>Total</span>

                <span>
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            <div className="mt-8 border-t border-stone-200 pt-6">
              <p className="text-sm text-neutral-500">
                Forma de pago
              </p>

            <div className="mt-8 border-t border-stone-200 pt-6">
            <OrderStatusSelector
            // Permite cambiar el estado operativo del pedido desde el panel administrativo.            
                orderId={order.id}
                currentStatus={order.status}
            />
            </div>

              <p className="mt-1 font-semibold">
                {order.paymentMethod === "mercadopago"
                  ? "Mercado Pago"
                  : "Transferencia bancaria"}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}