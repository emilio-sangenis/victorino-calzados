"use server";

// Cambia la visibilidad comercial de un producto después de validar la sesión administrativa.
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  readProductFormValues,
  validateProductForm,
  type ProductFieldErrors,
} from "@/lib/product-validation";

export type ProductFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: ProductFieldErrors;
};

export type ProductActiveResult = {
  success: boolean;
  error?: string;
};

export type ProductFeaturedResult = ProductActiveResult;

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
      featuredPosition: true,
    },
  });

  if (!product) {
    return {
      success: false,
      error: "No se encontró el producto.",
    };
  }

  if (!active && product.featuredPosition) {
    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { active: false, featured: false, featuredPosition: null },
      }),
      prisma.product.updateMany({
        where: { featuredPosition: { gt: product.featuredPosition } },
        data: { featuredPosition: { decrement: 1 } },
      }),
    ]);
  } else {
    await prisma.product.update({
      where: { id: productId },
      data: { active },
    });
  }

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath(`/productos/${productId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/productos");

  return {
    success: true,
  };
}

export async function setProductFeatured(
  productId: number,
  featured: boolean
): Promise<ProductFeaturedResult> {
  if (!(await hasAdminSession())) {
    return { success: false, error: "No autorizado." };
  }

  if (!Number.isInteger(productId) || productId <= 0) {
    return { success: false, error: "El producto indicado no es válido." };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, active: true, featuredPosition: true },
  });

  if (!product) {
    return { success: false, error: "No se encontró el producto." };
  }

  if (featured) {
    if (!product.active) {
      return { success: false, error: "Activá el producto antes de destacarlo." };
    }

    if (product.featuredPosition) {
      return { success: true };
    }

    const featuredCount = await prisma.product.count({
      where: { featured: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: { featured: true, featuredPosition: featuredCount + 1 },
    });
  } else if (product.featuredPosition) {
    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { featured: false, featuredPosition: null },
      }),
      prisma.product.updateMany({
        where: { featuredPosition: { gt: product.featuredPosition } },
        data: { featuredPosition: { decrement: 1 } },
      }),
    ]);
  }

  revalidateProductPaths(productId);
  return { success: true };
}

export async function moveFeaturedProduct(
  productId: number,
  direction: -1 | 1
): Promise<ProductFeaturedResult> {
  if (!(await hasAdminSession())) {
    return { success: false, error: "No autorizado." };
  }

  if (!Number.isInteger(productId) || productId <= 0 || ![-1, 1].includes(direction)) {
    return { success: false, error: "El movimiento indicado no es válido." };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, featuredPosition: true },
  });

  if (!product?.featuredPosition) {
    return { success: false, error: "El producto no está destacado." };
  }

  const targetPosition = product.featuredPosition + direction;
  if (targetPosition < 1) {
    return { success: true };
  }

  const target = await prisma.product.findFirst({
    where: { featured: true, featuredPosition: targetPosition },
    select: { id: true },
  });

  if (!target) {
    return { success: true };
  }

  await prisma.$transaction([
    prisma.product.update({
      where: { id: product.id },
      data: { featuredPosition: targetPosition },
    }),
    prisma.product.update({
      where: { id: target.id },
      data: { featuredPosition: product.featuredPosition },
    }),
  ]);

  revalidateProductPaths(productId);
  return { success: true };
}

// Crea un producto inicialmente inactivo para evitar publicarlo antes de cargar sus variantes.
export async function createProduct(
  _previousState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  if (!(await hasAdminSession())) {
    return {
      error: "No autorizado.",
    };
  }

  const values = readProductFormValues(formData);
  const validation = validateProductForm(values);

  if (!validation.data) {
    return {
      fieldErrors: validation.fieldErrors,
    };
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      code: validation.data.code,
    },
    select: {
      id: true,
    },
  });

  if (existingProduct) {
    return {
      fieldErrors: {
        code: "Ya existe un producto con ese código.",
      },
    };
  }

  await prisma.product.create({
    data: {
      ...validation.data,
      active: false,
    },
  });

  revalidateProductPaths();

  return {
    success: true,
  };
}

// Actualiza los datos comerciales sin modificar variantes, stock ni el estado activo del producto.
export async function updateProduct(
  productId: number,
  _previousState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  if (!(await hasAdminSession())) {
    return {
      error: "No autorizado.",
    };
  }

  if (!Number.isInteger(productId) || productId <= 0) {
    return {
      error: "El producto indicado no es válido.",
    };
  }

  const values = readProductFormValues(formData);
  const validation = validateProductForm(values);

  if (!validation.data) {
    return {
      fieldErrors: validation.fieldErrors,
    };
  }

  const [product, existingCode] = await Promise.all([
    prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
      },
    }),
    prisma.product.findFirst({
      where: {
        code: validation.data.code,
        id: {
          not: productId,
        },
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!product) {
    return {
      error: "No se encontró el producto.",
    };
  }

  if (existingCode) {
    return {
      fieldErrors: {
        code: "Ya existe otro producto con ese código.",
      },
    };
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: validation.data,
  });

  revalidateProductPaths(productId);

  return {
    success: true,
  };
}

// Actualiza las vistas que consumen datos comerciales del catálogo.
function revalidateProductPaths(productId?: number) {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");

  if (productId) {
    revalidatePath(`/productos/${productId}`);
    revalidatePath(`/admin/productos/${productId}/editar`);
  }
}
