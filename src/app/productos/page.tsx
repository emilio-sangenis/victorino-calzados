import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
// Importa el cliente de base de datos para obtener el catálogo real desde PostgreSQL.
import { prisma } from "@/lib/prisma";

// Obtiene los productos activos desde PostgreSQL y renderiza el catálogo.
export default async function ProductsPage() {
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
  });
  return (
    <main className="min-h-screen bg-stone-100 text-neutral-900">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            Victorino Calzados
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Todos los productos
          </h1>

          <p className="mt-3 text-neutral-600">
            Encontrá el calzado ideal para vos.
          </p>
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

      <Footer />
    </main>
  );
}