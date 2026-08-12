// Obtiene un producto real desde PostgreSQL por ID, junto con sus variantes, y renderiza su página de detalle.
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import ProductGallery from "@/components/product/ProductGallery";
import ProductSelector from "@/components/product/ProductSelector";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      variants: true,
      images: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          url: true,
          alt: true,
          color: true,
        },
      },
    },
  });

  if (!product || !product.active) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(product.price);
  const normalizeText = (value: string) =>
    value
      .trim()
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  const showDescription =
    product.description.trim().length > 0 &&
    normalizeText(product.description) !== normalizeText(product.name);

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <Header />

      <section className="mx-auto max-w-[1700px] px-4 py-8 lg:px-6 lg:py-12">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-neutral-600" aria-label="Navegación del producto">
          <Link href="/" className="hover:text-fuchsia-600">Inicio</Link>
          <span>/</span>
          <Link
            href={{ pathname: "/productos", query: { categoria: product.category } }}
            className="hover:text-fuchsia-600"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-neutral-900">{product.name}</span>
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,800px)_minmax(360px,480px)] xl:gap-14">
          <ProductGallery
            images={product.images}
            fallback={product.image}
            productName={product.name}
          />

          <div className="flex flex-col rounded-2xl bg-stone-200 p-5 shadow-sm sm:p-7 lg:sticky lg:top-24 lg:h-[620px] lg:overflow-y-auto lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-600 sm:text-sm sm:tracking-[0.3em]">
              {product.category}
            </p>

            <h1 className="mt-2 text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-[44px]">
              {product.name}
            </h1>

            <p className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">{formattedPrice}</p>

            {showDescription && (
              <div className="mt-6 border-t border-stone-200 pt-5">
                <h2 className="text-xl font-bold">Descripción</h2>
                <p className="mt-2 leading-6 text-neutral-600">
                  {product.description}
                </p>
              </div>
            )}

            <ProductSelector product={product} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
