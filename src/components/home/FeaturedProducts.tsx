import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function FeaturedProducts() {
  const selectedProducts = await prisma.product.findMany({
    where: {
      active: true,
      featured: true,
    },
    include: {
      variants: true,
      images: {
        orderBy: { position: "asc" },
        take: 1,
        select: { url: true, alt: true },
      },
    },
    orderBy: {
      featuredPosition: "asc",
    },
    take: 4,
  });

  const missingSlots = 4 - selectedProducts.length;
  const fallbackProducts = missingSlots
    ? await prisma.product.findMany({
        where: {
          active: true,
          featured: false,
          id: {
            notIn: selectedProducts.map((product) => product.id),
          },
        },
        include: {
          variants: true,
          images: {
            orderBy: { position: "asc" },
            take: 1,
            select: { url: true, alt: true },
          },
        },
        orderBy: {
          id: "asc",
        },
        take: missingSlots,
      })
    : [];
  const products = [...selectedProducts, ...fallbackProducts];

  return (
    <section id="productos" className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
            Catálogo
          </p>
          <h2 className="mt-2 text-3xl font-bold">Productos destacados</h2>
        </div>

        <Link
          href="/productos"
          className="hidden rounded-xl border border-stone-500 px-5 py-2 font-medium transition hover:bg-white/40 md:block"
        >
          Ver todos
        </Link>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
