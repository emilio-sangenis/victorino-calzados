"use server";

// Crea y actualiza variantes asegurando identidad, pertenencia y combinaciones únicas.
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  readVariantFormValues,
  validateVariantForm,
  type VariantFieldErrors,
} from "@/lib/variant-validation";

export type VariantFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: VariantFieldErrors;
};

export async function createVariant(
  productId: number,
  _previousState: VariantFormState,
  formData: FormData
): Promise<VariantFormState> {
  if (!(await hasAdminSession())) {
    return {
      error: "No autorizado.",
    };
  }

  if (!isValidId(productId)) {
    return {
      error: "El producto indicado no es válido.",
    };
  }

  const values = readVariantFormValues(formData);
  const validation = validateVariantForm(values);

  if (!validation.data) {
    return {
      fieldErrors: validation.fieldErrors,
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
      error: "No se encontró el producto.",
    };
  }

  const conflict = await findVariantConflict(productId, validation.data);

  if (conflict.sku) {
    return {
      fieldErrors: {
        sku: "Ya existe una variante con ese SKU.",
      },
    };
  }

  if (conflict.combination) {
    return {
      error: "Ya existe una variante con ese color y talle para el producto.",
    };
  }

  await prisma.productVariant.create({
    data: {
      productId,
      ...validation.data,
    },
  });

  revalidateVariantPaths(productId);

  return {
    success: true,
  };
}

export async function updateVariant(
  productId: number,
  variantId: number,
  _previousState: VariantFormState,
  formData: FormData
): Promise<VariantFormState> {
  if (!(await hasAdminSession())) {
    return {
      error: "No autorizado.",
    };
  }

  if (!isValidId(productId) || !isValidId(variantId)) {
    return {
      error: "La variante indicada no es válida.",
    };
  }

  const values = readVariantFormValues(formData);
  const validation = validateVariantForm(values);

  if (!validation.data) {
    return {
      fieldErrors: validation.fieldErrors,
    };
  }

  const variant = await prisma.productVariant.findFirst({
    where: {
      id: variantId,
      productId,
    },
    select: {
      id: true,
    },
  });

  if (!variant) {
    return {
      error: "No se encontró la variante para este producto.",
    };
  }

  const conflict = await findVariantConflict(
    productId,
    validation.data,
    variantId
  );

  if (conflict.sku) {
    return {
      fieldErrors: {
        sku: "Ya existe otra variante con ese SKU.",
      },
    };
  }

  if (conflict.combination) {
    return {
      error: "Ya existe otra variante con ese color y talle para el producto.",
    };
  }

  await prisma.productVariant.update({
    where: {
      id: variantId,
    },
    data: validation.data,
  });

  revalidateVariantPaths(productId);

  return {
    success: true,
  };
}

type VariantIdentity = {
  sku: string;
  color: string;
  size: number;
};

async function findVariantConflict(
  productId: number,
  data: VariantIdentity,
  excludedVariantId?: number
) {
  const excludedId = excludedVariantId
    ? {
        not: excludedVariantId,
      }
    : undefined;

  const [sku, combination] = await Promise.all([
    prisma.productVariant.findFirst({
      where: {
        sku: data.sku,
        id: excludedId,
      },
      select: {
        id: true,
      },
    }),
    prisma.productVariant.findFirst({
      where: {
        productId,
        color: data.color,
        size: data.size,
        id: excludedId,
      },
      select: {
        id: true,
      },
    }),
  ]);

  return {
    sku,
    combination,
  };
}

function isValidId(id: number) {
  return Number.isInteger(id) && id > 0;
}

function revalidateVariantPaths(productId: number) {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath(`/productos/${productId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${productId}/variantes`);
}
