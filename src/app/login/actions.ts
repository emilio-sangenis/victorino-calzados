"use server";

// Inicia la sesión administrativa y devuelve un mensaje neutro si las credenciales no son válidas.
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type LoginState = {
  error?: string;
  success?: boolean;
};

export async function login(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      error: "Ingresá un email y una contraseña válidos.",
    };
  }

  try {
    await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "El email o la contraseña no son correctos.",
      };
    }

    throw error;
  }

  return {
    success: true,
  };
}
