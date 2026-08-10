// Muestra el acceso administrativo y evita que una sesión activa vuelva a iniciar sesión.
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { hasAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Acceso administrativo",
};

export default async function LoginPage() {
  if (await hasAdminSession()) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-6 py-12 text-neutral-900">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm sm:p-10">
        <p className="text-center text-xl font-bold tracking-[0.15em]">
          VICTORINO
        </p>

        <p className="mt-1 text-center text-xs uppercase tracking-[0.35em] text-neutral-500">
          Administración
        </p>

        <h1 className="mt-8 text-3xl font-bold">Iniciar sesión</h1>

        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Ingresá tus credenciales para acceder al panel administrativo.
        </p>

        <LoginForm />

        <Link
          href="/"
          className="mt-6 block text-center text-sm font-medium text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
        >
          Volver a la tienda
        </Link>
      </section>
    </main>
  );
}
