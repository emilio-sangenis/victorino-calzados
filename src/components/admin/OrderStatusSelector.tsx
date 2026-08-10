// Permite cambiar el estado de un pedido desde el panel administrativo y sincronizarlo con PostgreSQL.
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type OrderStatusSelectorProps = {
  orderId: number;
  currentStatus: OrderStatus;
};

const statuses: {
  value: OrderStatus;
  label: string;
}[] = [
  {
    value: "PENDING",
    label: "Pendiente",
  },
  {
    value: "CONFIRMED",
    label: "Confirmado",
  },
  {
    value: "PREPARING",
    label: "En preparación",
  },
  {
    value: "SHIPPED",
    label: "Enviado",
  },
  {
    value: "DELIVERED",
    label: "Entregado",
  },
  {
    value: "CANCELLED",
    label: "Cancelado",
  },
];

export default function OrderStatusSelector({
  orderId,
  currentStatus,
}: OrderStatusSelectorProps) {
  const router = useRouter();

  const [status, setStatus] =
    useState<OrderStatus>(currentStatus);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleChange(
    newStatus: OrderStatus
  ) {
    setStatus(newStatus);
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "No se pudo actualizar el pedido."
        );
      }

      router.refresh();
    } catch (error) {
      setStatus(currentStatus);

      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-medium text-neutral-600">
        Estado del pedido
      </label>

      <select
        value={status}
        disabled={isSaving}
        onChange={(event) =>
          handleChange(
            event.target.value as OrderStatus
          )
        }
        className="mt-2 w-full cursor-pointer rounded-xl border border-stone-300 bg-white px-4 py-3 font-medium outline-none focus:border-neutral-900 disabled:cursor-not-allowed disabled:bg-stone-100"
      >
        {statuses.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {isSaving && (
        <p className="mt-2 text-sm text-neutral-500">
          Guardando...
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}