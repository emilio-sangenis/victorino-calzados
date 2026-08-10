// Obtiene los productos destacados directamente desde PostgreSQL y los muestra en la Home.
import ProductCard from "@/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      active: true,
    },
    include: {
      variants: true,
    },
    orderBy: {
      id: "asc",
    },
    take: 4,
  });

  return (
    <section id="productos" className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            Catálogo
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Productos destacados
          </h2>
        </div>

        <a
          href="/productos"
          className="hidden rounded-xl border border-stone-300 px-5 py-2 font-medium md:block"
        >
          Ver todos
        </a>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}