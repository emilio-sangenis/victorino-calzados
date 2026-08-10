"use server";

// Elimina la sesión administrativa y confirma al cliente que puede abandonar el panel.
import { signOut } from "@/auth";

export type LogoutState = {
  success?: boolean;
};

export async function logout(): Promise<LogoutState> {
  await signOut({
    redirect: false,
  });

  return {
    success: true,
  };
}
