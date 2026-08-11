// Protege en un único punto todas las páginas presentes y futuras del panel administrativo.
import { redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import LogoutButton from "@/components/admin/LogoutButton";
import Brand from "@/components/layout/Brand";
import { hasAdminSession } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await hasAdminSession())) {
    redirect("/login");
  }

  return (
    <>
      <header className="border-b border-neutral-800 bg-black text-white">
        <div className="flex w-full items-center px-6 py-3 lg:px-10">
          <Brand href="/admin" subtitle="Administración" />

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden rounded-xl border border-neutral-600 px-4 py-2 text-sm font-medium hover:bg-neutral-800 sm:block"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-stone-200"
            >
              Ver tienda
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {children}
    </>
  );
}
