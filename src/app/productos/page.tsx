import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

type ProductsPageProps = {
  searchParams: Promise<{
    categoria?: string | string[];
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const selectedCategory =
    typeof params.categoria === "string" ? params.categoria.trim() : "";
  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(selectedCategory ? { category: selectedCategory } : {}),
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
  });

  return (
    <main className="min-h-screen bg-stone-300 text-neutral-900">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
            Victorino Calzados
          </p>

          {selectedCategory && (
            <h1 className="mt-2 text-4xl font-bold">{selectedCategory}</h1>
          )}

          <p className="mt-3 text-neutral-600">
            {selectedCategory
              ? `Explorá todos los modelos de ${selectedCategory}.`
              : "Encontrá el calzado ideal para vos."}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center text-neutral-500">
            No encontramos productos activos en esta categoría.
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
