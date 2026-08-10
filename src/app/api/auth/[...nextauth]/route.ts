// Expone los endpoints internos utilizados por Auth.js para iniciar, consultar y cerrar sesiones.
import { handlers } from "@/auth";

export const {
  GET,
  POST,
} = handlers;