// Actualiza el estado de un pedido validando que el nuevo valor pertenezca al enum permitido.
import { OrderStatus } from "@/generated/prisma/client";
import { hasAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type StatusRequest = {
  status: OrderStatus;
};

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
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
    const { id } = await context.params;
    const body = (await request.json()) as StatusRequest;

    const validStatuses = Object.values(OrderStatus);

    if (!validStatuses.includes(body.status)) {
      return Response.json(
        {
          error: "El estado indicado no es válido.",
        },
        {
          status: 400,
        }
      );
    }

    const order = await prisma.order.update({
      where: {
        id: Number(id),
      },

      data: {
        status: body.status,
      },
    });

    return Response.json({
      id: order.id,
      status: order.status,
    });
  } catch (error) {
    console.error("Error updating order status:", error);

    return Response.json(
      {
        error: "No se pudo actualizar el estado del pedido.",
      },
      {
        status: 500,
      }
    );
  }
}
