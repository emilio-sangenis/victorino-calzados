import Link from "next/link";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import { prisma } from "@/lib/prisma";

export default async function FeaturedProducts() {
  const selectedProducts = await prisma.product.findMany({
    where: {
      active: true,
      featured: true,
      variants: {
        some: {
          stock: { gt: 0 },
        },
      },
    },
    include: {
      variants: true,
      images: {
        orderBy: { position: "asc" },
        select: { url: true, alt: true, color: true },
      },
    },
    orderBy: {
      featuredPosition: "asc",
    },
  });

  const fallbackProducts = selectedProducts.length === 0
    ? await prisma.product.findMany({
        where: {
          active: true,
          variants: {
            some: {
              stock: { gt: 0 },
            },
          },
        },
        include: {
          variants: true,
          images: {
            orderBy: { position: "asc" },
            select: { url: true, alt: true, color: true },
          },
        },
        orderBy: {
          id: "asc",
        },
        take: 4,
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

      <FeaturedCarousel products={products} />
    </section>
  );
}
