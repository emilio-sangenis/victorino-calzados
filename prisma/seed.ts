// Carga en PostgreSQL los productos y variantes iniciales de Victorino Calzados usando Prisma 7 y el adaptador PostgreSQL.
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL no está configurada en el archivo .env"
  );
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.create({
    data: {
      name: "Urbana Clásica",
      description:
        "Zapatilla urbana versátil para uso diario, diseñada para combinar comodidad y estilo.",
      category: "Urbanos",
      price: 74990,
      image: "👟",
      variants: {
        create: [
          { color: "Negro", size: 39, stock: 2 },
          { color: "Negro", size: 40, stock: 5 },
          { color: "Negro", size: 41, stock: 0 },
          { color: "Blanco", size: 39, stock: 3 },
          { color: "Blanco", size: 40, stock: 1 },
          { color: "Blanco", size: 41, stock: 4 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Runner Pro",
      description:
        "Zapatilla deportiva liviana con diseño pensado para acompañar entrenamientos y caminatas.",
      category: "Deportivos",
      price: 89990,
      image: "👟",
      variants: {
        create: [
          { color: "Negro", size: 40, stock: 4 },
          { color: "Negro", size: 41, stock: 3 },
          { color: "Negro", size: 42, stock: 2 },
          { color: "Azul", size: 40, stock: 1 },
          { color: "Azul", size: 41, stock: 0 },
          { color: "Azul", size: 42, stock: 3 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Derby Elegante",
      description:
        "Zapato clásico de estilo elegante, ideal para ocasiones formales y uso profesional.",
      category: "Clásicos",
      price: 109990,
      image: "👞",
      variants: {
        create: [
          { color: "Negro", size: 40, stock: 2 },
          { color: "Negro", size: 41, stock: 3 },
          { color: "Negro", size: 42, stock: 1 },
          { color: "Marrón", size: 40, stock: 2 },
          { color: "Marrón", size: 41, stock: 1 },
          { color: "Marrón", size: 42, stock: 0 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Bota Victorino",
      description:
        "Bota resistente de diseño urbano, preparada para brindar comodidad y protección.",
      category: "Botas",
      price: 124990,
      image: "🥾",
      variants: {
        create: [
          { color: "Negro", size: 40, stock: 3 },
          { color: "Negro", size: 41, stock: 2 },
          { color: "Negro", size: 42, stock: 4 },
          { color: "Suela", size: 40, stock: 1 },
          { color: "Suela", size: 41, stock: 0 },
          { color: "Suela", size: 42, stock: 2 },
        ],
      },
    },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });