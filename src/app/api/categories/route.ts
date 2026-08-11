import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { active: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
    select: { category: true },
  });

  return Response.json({
    categories: products.map((product) => product.category),
  });
}
