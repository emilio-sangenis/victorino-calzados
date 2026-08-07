// Renderiza el carrito, permite modificar cantidades, eliminar productos y calcula subtotales y total.
"use client";

import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
  } = useCart();

  const total = items.reduce(
    (accumulator, item) =>
      accumulator +
      item.product.price * item.quantity,
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
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            Victorino Calzados
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Tu carrito
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p className="text-lg text-neutral-600">
              Todavía no agregaste productos.
            </p>

            <Link
              href="/productos"
              className="mt-6 inline-block rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-neutral-700"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((item) => {
                const subtotal =
                  item.product.price * item.quantity;

                return (
                  <article
                    key={`${item.product.id}-${item.variant.id}`}
                    className="flex flex-col gap-6 rounded-2xl bg-white p-6 sm:flex-row sm:items-center"
                  >
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-stone-200 text-6xl">
                      {item.product.image}
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        {item.product.category}
                      </p>

                      <h2 className="mt-1 text-xl font-semibold">
                        {item.product.name}
                      </h2>

                      <p className="mt-2 text-sm text-neutral-600">
                        Color: {item.variant.color}
                      </p>

                      <p className="text-sm text-neutral-600">
                        Talle: {item.variant.size}
                      </p>

                      <p className="mt-3 font-semibold">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:items-end">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.variant.id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="h-10 w-10 cursor-pointer rounded-lg border border-stone-300 bg-white font-bold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="min-w-10 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.variant.id,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            item.quantity >=
                            item.variant.stock
                          }
                          className="h-10 w-10 cursor-pointer rounded-lg border border-stone-300 bg-white font-bold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-bold">
                        {formatPrice(subtotal)}
                      </p>

                      <button
                        onClick={() =>
                          removeItem(
                            item.product.id,
                            item.variant.id
                          )
                        }
                        className="cursor-pointer text-sm font-medium text-red-700 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit rounded-2xl bg-white p-6">
              <h2 className="text-xl font-bold">
                Resumen de compra
              </h2>

              <div className="mt-6 flex justify-between text-neutral-600">
                <span>Productos</span>
                <span>
                  {items.reduce(
                    (totalItems, item) =>
                      totalItems + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="mt-6 border-t border-stone-200 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-bold">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              // Navega desde el carrito hacia el checkout.
              <Link
                href="/checkout"
                className="mt-8 block w-full cursor-pointer rounded-xl bg-neutral-900 px-6 py-4 text-center font-semibold text-white hover:bg-neutral-700"
              >
                Continuar compra
              </Link>
            </aside>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}