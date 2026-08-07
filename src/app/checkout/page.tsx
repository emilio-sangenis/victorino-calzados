// Renderiza el checkout, recopila datos del cliente, calcula el envío y confirma una compra simulada.
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import {
  CustomerData,
  PaymentMethod,
  ShippingMethod,
} from "@/types/order";

const FREE_SHIPPING_THRESHOLD = 120000;
const DELIVERY_COST = 7000;

export default function CheckoutPage() {
  const { items, clearCart } = useCart();

  const [customer, setCustomer] = useState<CustomerData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("delivery");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("mercadopago");

  const [orderNumber, setOrderNumber] =
    useState<string | null>(null);

  const subtotal = items.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  const shippingCost =
    shippingMethod === "pickup"
      ? 0
      : subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : DELIVERY_COST;

  const total = subtotal + shippingCost;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price);

  function handleCustomerChange(
    field: keyof CustomerData,
    value: string
  ) {
    setCustomer((currentCustomer) => ({
      ...currentCustomer,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const generatedOrderNumber =
      `VC-${Date.now().toString().slice(-8)}`;

    setOrderNumber(generatedOrderNumber);
    clearCart();
  }

  if (orderNumber) {
    return (
      <main className="min-h-screen bg-stone-100 text-neutral-900">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-20">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="text-6xl">✓</div>

            <h1 className="mt-6 text-4xl font-bold">
              Compra confirmada
            </h1>

            <p className="mt-4 text-neutral-600">
              Tu número de pedido es:
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-700">
              {orderNumber}
            </p>

            <p className="mt-6 text-neutral-600">
              Esta confirmación es simulada por ahora.
            </p>

            <Link
              href="/productos"
              className="mt-8 inline-block rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-neutral-700"
            >
              Volver al catálogo
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-stone-100 text-neutral-900">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-20">
          <div className="rounded-2xl bg-white p-10 text-center">
            <h1 className="text-3xl font-bold">
              Tu carrito está vacío
            </h1>

            <p className="mt-4 text-neutral-600">
              Agregá al menos un producto antes de continuar.
            </p>

            <Link
              href="/productos"
              className="mt-6 inline-block rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-neutral-700"
            >
              Ver productos
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-100 text-neutral-900">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            Finalizar compra
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Checkout
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          <div className="space-y-8">
            <section className="rounded-2xl bg-white p-7">
              <h2 className="text-2xl font-bold">
                Datos personales
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input
                  required
                  type="text"
                  placeholder="Nombre"
                  value={customer.firstName}
                  onChange={(event) =>
                    handleCustomerChange(
                      "firstName",
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-neutral-900"
                />

                <input
                  required
                  type="text"
                  placeholder="Apellido"
                  value={customer.lastName}
                  onChange={(event) =>
                    handleCustomerChange(
                      "lastName",
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-neutral-900"
                />

                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={customer.email}
                  onChange={(event) =>
                    handleCustomerChange(
                      "email",
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-neutral-900"
                />

                <input
                  required
                  type="tel"
                  placeholder="Teléfono"
                  value={customer.phone}
                  onChange={(event) =>
                    handleCustomerChange(
                      "phone",
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-neutral-900"
                />
              </div>
            </section>

            <section className="rounded-2xl bg-white p-7">
              <h2 className="text-2xl font-bold">
                Método de envío
              </h2>

              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-300 p-4">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "delivery"}
                    onChange={() =>
                      setShippingMethod("delivery")
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      Envío a domicilio
                    </p>

                    <p className="text-sm text-neutral-500">
                      Gratis desde{" "}
                      {formatPrice(
                        FREE_SHIPPING_THRESHOLD
                      )}
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-300 p-4">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "pickup"}
                    onChange={() =>
                      setShippingMethod("pickup")
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      Retiro
                    </p>

                    <p className="text-sm text-neutral-500">
                      Sin costo
                    </p>
                  </div>
                </label>
              </div>

              {shippingMethod === "delivery" && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="text"
                    placeholder="Dirección"
                    value={customer.address}
                    onChange={(event) =>
                      handleCustomerChange(
                        "address",
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-neutral-900 sm:col-span-2"
                  />

                  <input
                    required
                    type="text"
                    placeholder="Ciudad"
                    value={customer.city}
                    onChange={(event) =>
                      handleCustomerChange(
                        "city",
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-neutral-900"
                  />

                  <input
                    required
                    type="text"
                    placeholder="Código postal"
                    value={customer.postalCode}
                    onChange={(event) =>
                      handleCustomerChange(
                        "postalCode",
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-neutral-900"
                  />
                </div>
              )}
            </section>

            <section className="rounded-2xl bg-white p-7">
              <h2 className="text-2xl font-bold">
                Forma de pago
              </h2>

              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-300 p-4">
                  <input
                    type="radio"
                    name="payment"
                    checked={
                      paymentMethod === "mercadopago"
                    }
                    onChange={() =>
                      setPaymentMethod("mercadopago")
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      Mercado Pago
                    </p>

                    <p className="text-sm text-neutral-500">
                      Tarjetas y otros medios de pago
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-300 p-4">
                  <input
                    type="radio"
                    name="payment"
                    checked={
                      paymentMethod === "transfer"
                    }
                    onChange={() =>
                      setPaymentMethod("transfer")
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      Transferencia bancaria
                    </p>

                    <p className="text-sm text-neutral-500">
                      Los datos se informarán al confirmar
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl bg-white p-7 lg:sticky lg:top-6">
            <h2 className="text-xl font-bold">
              Resumen
            </h2>

            <div className="mt-6 space-y-5">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant.id}`}
                  className="flex justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold">
                      {item.product.name}
                    </p>

                    <p className="text-sm text-neutral-500">
                      {item.variant.color} · Talle{" "}
                      {item.variant.size} · x
                      {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    {formatPrice(
                      item.product.price *
                        item.quantity
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-stone-200 pt-6">
              <div className="flex justify-between">
                <span className="text-neutral-600">
                  Subtotal
                </span>

                <span>
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-600">
                  Envío
                </span>

                <span>
                  {shippingCost === 0
                    ? "Gratis"
                    : formatPrice(shippingCost)}
                </span>
              </div>

              <div className="flex justify-between border-t border-stone-200 pt-4 text-xl font-bold">
                <span>Total</span>

                <span>
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full cursor-pointer rounded-xl bg-neutral-900 px-6 py-4 font-semibold text-white hover:bg-neutral-700"
            >
              Confirmar compra
            </button>
          </aside>
        </form>
      </section>

      <Footer />
    </main>
  );
}