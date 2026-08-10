// Centraliza la comprobación server-side de la sesión administrativa.
import "server-only";

import { auth } from "@/auth";

export async function hasAdminSession() {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;

  return Boolean(
    adminEmail &&
      session?.user?.email &&
      session.user.email === adminEmail
  );
}
