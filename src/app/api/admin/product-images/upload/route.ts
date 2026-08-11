// Emite tokens de upload limitados después de validar la sesión y el producto de destino.
import {
  handleUploadPresigned,
  type HandleUploadPresignedBody,
} from "@vercel/blob/client";
import { issueSignedToken } from "@vercel/blob";
import { hasAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type UploadPayload = {
  productId: number;
  contentType: string;
};

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return Response.json(
      {
        error: "No autorizado.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const body = (await request.json()) as HandleUploadPresignedBody;
    const response = await handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname, clientPayload) => {
        const payload = parseUploadPayload(clientPayload);

        if (
          !payload ||
          !pathname.startsWith(`products/${payload.productId}/`) ||
          !ALLOWED_IMAGE_TYPES.includes(payload.contentType)
        ) {
          throw new Error("El destino del archivo no es válido.");
        }

        const product = await prisma.product.findUnique({
          where: {
            id: payload.productId,
          },
          select: {
            id: true,
          },
        });

        if (!product) {
          throw new Error("No se encontró el producto.");
        }

        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes: ALLOWED_IMAGE_TYPES,
          maximumSizeInBytes: MAX_IMAGE_SIZE,
        });

        return {
          token,
          urlOptions: {
            access: "public",
            contentType: payload.contentType,
            allowedContentTypes: ALLOWED_IMAGE_TYPES,
            maximumSizeInBytes: MAX_IMAGE_SIZE,
            addRandomSuffix: true,
            cacheControlMaxAge: 60 * 60 * 24 * 30,
          },
        };
      },
    });

    return Response.json(response);
  } catch (error) {
    console.error("Error generating product image upload token:", error);

    return Response.json(
      {
        error: "No se pudo autorizar la carga de la imagen.",
      },
      {
        status: 400,
      }
    );
  }
}

function parseUploadPayload(clientPayload: string | null): UploadPayload | null {
  if (!clientPayload) {
    return null;
  }

  try {
    const payload = JSON.parse(clientPayload) as Partial<UploadPayload>;

    if (!Number.isInteger(payload.productId) || Number(payload.productId) <= 0) {
      return null;
    }

    if (
      typeof payload.contentType !== "string" ||
      !ALLOWED_IMAGE_TYPES.includes(payload.contentType)
    ) {
      return null;
    }

    return {
      productId: Number(payload.productId),
      contentType: payload.contentType,
    };
  } catch {
    return null;
  }
}
