"use client";

// Cierra la sesión administrativa y actualiza la interfaz al finalizar el proceso.
import { useActionState, useEffect } from "react";
import {
  logout,
  type LogoutState,
} from "@/app/admin/actions";

const initialState: LogoutState = {};

export default function LogoutButton() {
  const [state, formAction, pending] = useActionState(
    logout,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      // Fuerza una carga completa para eliminar de la interfaz cualquier estado administrativo previo.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login");
    }
  }, [state.success]);

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-stone-100"
      >
        {pending ? "Cerrando sesión..." : "Cerrar sesión"}
      </button>
    </form>
  );
}
