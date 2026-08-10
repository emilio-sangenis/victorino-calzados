"use server";

// Cambia la visibilidad comercial de un producto después de validar la sesión administrativa.
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export type ProductActiveResult = {
  success: boolean;
  error?: string;
};

export async function setProductActive(
  productId: number,
  active: boolean
): Promise<ProductActiveResult> {
  if (!(await hasAdminSession())) {
    return {
      success: false,
      error: "No autorizado.",
    };
  }

  if (!Number.isInteger(productId) || productId <= 0) {
    return {
      success: false,
      error: "El producto indicado no es válido.",
    };
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
    },
  });

  if (!product) {
    return {
      success: false,
      error: "No se encontró el producto.",
    };
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      active,
    },
  });

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath(`/productos/${productId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/productos");

  return {
    success: true,
  };
}
