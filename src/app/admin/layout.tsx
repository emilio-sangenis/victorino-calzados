// Protege en un único punto todas las páginas presentes y futuras del panel administrativo.
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import LogoutButton from "@/components/admin/LogoutButton";
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
      <div className="border-b border-stone-200 bg-stone-50">
        <div className="mx-auto flex max-w-7xl justify-end px-6 py-2">
          <LogoutButton />
        </div>
      </div>

      {children}
    </>
  );
}
