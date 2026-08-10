// Valida productos, precios y stock contra PostgreSQL antes de crear un pedido real.
import { prisma } from "@/lib/prisma";

const FREE_SHIPPING_THRESHOLD = 120000;
const DELIVERY_COST = 7000;

type OrderRequest = {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };

  shippingMethod: "delivery" | "pickup";
  paymentMethod: "mercadopago" | "transfer";

  items: {
    productId: number;
    variantId: number;
    quantity: number;
  }[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest;

    if (!body.items || body.items.length === 0) {
      return Response.json(
        {
          error: "El pedido no contiene productos.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      body.shippingMethod !== "delivery" &&
      body.shippingMethod !== "pickup"
    ) {
      return Response.json(
        {
          error: "El método de envío no es válido.",
        },
        {
          status: 400,
        }
      );
    }

    const validatedItems = [];

    for (const item of body.items) {
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return Response.json(
          {
            error: "La cantidad solicitada no es válida.",
          },
          {
            status: 400,
          }
        );
      }

      const variant =
        await prisma.productVariant.findUnique({
          where: {
            id: item.variantId,
          },

          include: {
            product: true,
          },
        });

      if (
        !variant ||
        variant.product.id !== item.productId ||
        !variant.product.active
      ) {
        return Response.json(
          {
            error:
              "Uno de los productos seleccionados ya no está disponible.",
          },
          {
            status: 400,
          }
        );
      }

      if (variant.stock < item.quantity) {
        return Response.json(
          {
            error: `No hay stock suficiente de ${variant.product.name} - ${variant.color} - Talle ${variant.size}.`,
          },
          {
            status: 400,
          }
        );
      }

      validatedItems.push({
        productId: variant.product.id,
        variantId: variant.id,

        productName: variant.product.name,
        color: variant.color,
        size: variant.size,

        unitPrice: variant.product.price,
        quantity: item.quantity,
      });
    }

    const subtotal = validatedItems.reduce(
      (total, item) =>
        total + item.unitPrice * item.quantity,
      0
    );

    const shippingCost =
      body.shippingMethod === "pickup"
        ? 0
        : subtotal >= FREE_SHIPPING_THRESHOLD
          ? 0
          : DELIVERY_COST;

    const total = subtotal + shippingCost;

    const orderNumber =
      `VC-${Date.now().toString().slice(-8)}`;

    const order = await prisma.$transaction(
      async (tx) => {
        for (const item of validatedItems) {
          const updatedVariant =
            await tx.productVariant.updateMany({
              where: {
                id: item.variantId,
                stock: {
                  gte: item.quantity,
                },
              },

              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });

          if (updatedVariant.count !== 1) {
            throw new Error(
              `STOCK:${item.productName}`
            );
          }
        }

        return tx.order.create({
          data: {
            orderNumber,

            firstName: body.customer.firstName,
            lastName: body.customer.lastName,
            email: body.customer.email,
            phone: body.customer.phone,

            shippingMethod: body.shippingMethod,
            paymentMethod: body.paymentMethod,

            address:
              body.shippingMethod === "delivery"
                ? body.customer.address
                : null,

            city:
              body.shippingMethod === "delivery"
                ? body.customer.city
                : null,

            postalCode:
              body.shippingMethod === "delivery"
                ? body.customer.postalCode
                : null,

            subtotal,
            shippingCost,
            total,

            items: {
              create: validatedItems.map(
                (item) => ({
                  productId: item.productId,
                  variantId: item.variantId,
                  productName: item.productName,
                  color: item.color,
                  size: item.size,
                  unitPrice: item.unitPrice,
                  quantity: item.quantity,
                })
              ),
            },
          },

          include: {
            items: true,
          },
        });
      }
    );

    return Response.json(
      {
        orderNumber: order.orderNumber,
        orderId: order.id,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        total: order.total,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating order:", error);

    if (
      error instanceof Error &&
      error.message.startsWith("STOCK:")
    ) {
      const productName =
        error.message.replace("STOCK:", "");

      return Response.json(
        {
          error: `El stock de ${productName} cambió mientras realizabas la compra. Revisá tu carrito.`,
        },
        {
          status: 409,
        }
      );
    }

    return Response.json(
      {
        error: "No se pudo crear el pedido.",
      },
      {
        status: 500,
      }
    );
  }
}