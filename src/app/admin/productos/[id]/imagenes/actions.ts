"use server";

// Administra los metadatos de la galería validando siempre producto, imagen y sesión.
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  readProductImageFormValues,
  validateProductImageForm,
  type ProductImageFieldErrors,
} from "@/lib/product-image-validation";

export type ProductImageFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: ProductImageFieldErrors;
};

export async function addProductImage(
  productId: number,
  _previousState: ProductImageFormState,
  formData: FormData
): Promise<ProductImageFormState> {
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

  const values = readProductImageFormValues(formData);
  const validation = validateProductImageForm(values);

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

  const lastImage = await prisma.productImage.findFirst({
    where: {
      productId,
    },
    orderBy: {
      position: "desc",
    },
    select: {
      position: true,
    },
  });

  await prisma.productImage.create({
    data: {
      productId,
      ...validation.data,
      position: (lastImage?.position ?? -1) + 1,
    },
  });

  revalidateImagePaths(productId);

  return {
    success: true,
  };
}

export async function setPrimaryProductImage(
  productId: number,
  imageId: number
) {
  if (!(await hasAdminSession())) {
    return {
      success: false,
      error: "No autorizado.",
    };
  }

  const image = await findProductImage(productId, imageId);

  if (!image) {
    return {
      success: false,
      error: "No se encontró la imagen para este producto.",
    };
  }

  await prisma.$transaction([
    prisma.productImage.updateMany({
      where: {
        productId,
      },
      data: {
        position: {
          increment: 1,
        },
      },
    }),
    prisma.productImage.update({
      where: {
        id: imageId,
      },
      data: {
        position: 0,
      },
    }),
  ]);

  revalidateImagePaths(productId);

  return {
    success: true,
  };
}

export async function removeProductImage(
  productId: number,
  imageId: number
) {
  if (!(await hasAdminSession())) {
    return {
      success: false,
      error: "No autorizado.",
    };
  }

  const image = await findProductImage(productId, imageId);

  if (!image) {
    return {
      success: false,
      error: "No se encontró la imagen para este producto.",
    };
  }

  await prisma.productImage.delete({
    where: {
      id: imageId,
    },
  });

  revalidateImagePaths(productId);

  return {
    success: true,
  };
}

function findProductImage(productId: number, imageId: number) {
  if (!isValidId(productId) || !isValidId(imageId)) {
    return null;
  }

  return prisma.productImage.findFirst({
    where: {
      id: imageId,
      productId,
    },
    select: {
      id: true,
    },
  });
}

function isValidId(id: number) {
  return Number.isInteger(id) && id > 0;
}

function revalidateImagePaths(productId: number) {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath(`/productos/${productId}`);
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${productId}/imagenes`);
}
