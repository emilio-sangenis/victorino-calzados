// Importa masivamente productos y variantes desde un CSV, actualizando registros existentes o creando nuevos.
import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

type CsvRow = {
  productCode: string;
  productName: string;
  description: string;
  category: string;
  price: string;
  image: string;
  sku: string;
  color: string;
  size: string;
  stock: string;
  active: string;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está configurada.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

function parseBoolean(value: string) {
  return value.trim().toLowerCase() !== "false";
}

function validateRow(row: CsvRow, line: number) {
  if (!row.productCode?.trim()) {
    throw new Error(`Fila ${line}: productCode es obligatorio.`);
  }

  if (!row.productName?.trim()) {
    throw new Error(`Fila ${line}: productName es obligatorio.`);
  }

  if (!row.sku?.trim()) {
    throw new Error(`Fila ${line}: sku es obligatorio.`);
  }

  const price = Number(row.price);
  const size = Number(row.size);
  const stock = Number(row.stock);

  if (!Number.isInteger(price) || price < 0) {
    throw new Error(`Fila ${line}: price inválido.`);
  }

  if (!Number.isInteger(size) || size <= 0) {
    throw new Error(`Fila ${line}: size inválido.`);
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error(`Fila ${line}: stock inválido.`);
  }
}

async function main() {
  const csvPath = process.argv[2];

  if (!csvPath) {
    throw new Error(
      "Debés indicar el archivo CSV. Ejemplo: npx tsx prisma/import-products.ts productos.csv"
    );
  }

  const absolutePath = path.resolve(csvPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`No existe el archivo: ${absolutePath}`);
  }

  const content = fs.readFileSync(absolutePath, "utf8");

  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as CsvRow[];

  let createdProducts = 0;
  let updatedProducts = 0;
  let createdVariants = 0;
  let updatedVariants = 0;

  for (const [index, row] of rows.entries()) {
    const line = index + 2;

    validateRow(row, line);

    const code = row.productCode.trim();
    const sku = row.sku.trim();

    let product = await prisma.product.findUnique({
      where: {
        code,
      },
    });

    if (!product) {
      const existingByName = await prisma.product.findFirst({
        where: {
          name: row.productName.trim(),
        },
      });

      if (existingByName) {
        product = await prisma.product.update({
          where: {
            id: existingByName.id,
          },
          data: {
            code,
            name: row.productName.trim(),
            description: row.description.trim(),
            category: row.category.trim(),
            price: Number(row.price),
            image: row.image.trim(),
            active: parseBoolean(row.active),
          },
        });

        updatedProducts++;
      } else {
        product = await prisma.product.create({
          data: {
            code,
            name: row.productName.trim(),
            description: row.description.trim(),
            category: row.category.trim(),
            price: Number(row.price),
            image: row.image.trim(),
            active: parseBoolean(row.active),
          },
        });

        createdProducts++;
      }
    } else {
      product = await prisma.product.update({
        where: {
          id: product.id,
        },
        data: {
          name: row.productName.trim(),
          description: row.description.trim(),
          category: row.category.trim(),
          price: Number(row.price),
          image: row.image.trim(),
          active: parseBoolean(row.active),
        },
      });

      updatedProducts++;
    }

    const existingVariant = await prisma.productVariant.findUnique({
      where: {
        sku,
      },
    });

    if (existingVariant) {
      await prisma.productVariant.update({
        where: {
          id: existingVariant.id,
        },
        data: {
          productId: product.id,
          color: row.color.trim(),
          size: Number(row.size),
          stock: Number(row.stock),
        },
      });

      updatedVariants++;
    } else {
      const existingByCombination =
        await prisma.productVariant.findUnique({
          where: {
            productId_color_size: {
              productId: product.id,
              color: row.color.trim(),
              size: Number(row.size),
            },
          },
        });

      if (existingByCombination) {
        await prisma.productVariant.update({
          where: {
            id: existingByCombination.id,
          },
          data: {
            sku,
            stock: Number(row.stock),
          },
        });

        updatedVariants++;
      } else {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku,
            color: row.color.trim(),
            size: Number(row.size),
            stock: Number(row.stock),
          },
        });

        createdVariants++;
      }
    }
  }

  console.log("");
  console.log("Importación finalizada.");
  console.log(`Productos creados: ${createdProducts}`);
  console.log(`Productos actualizados: ${updatedProducts}`);
  console.log(`Variantes creadas: ${createdVariants}`);
  console.log(`Variantes actualizadas: ${updatedVariants}`);
}

main()
  .catch((error) => {
    console.error("");
    console.error("Error durante la importación:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });