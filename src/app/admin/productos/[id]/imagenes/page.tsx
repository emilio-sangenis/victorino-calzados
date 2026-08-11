// Presenta la galería administrativa y conserva el campo visual anterior como fallback temporal.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImageManager from "@/components/admin/ProductImageManager";
import { prisma } from "@/lib/prisma";

type ProductImagesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Imágenes de producto | Administración",
};

export default async function ProductImagesPage({ params }: ProductImagesPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: {
        orderBy: [{ position: "asc" }, { id: "asc" }],
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-100 px-6 py-12 text-neutral-900">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/admin/productos"
          className="text-sm font-semibold text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
        >
          Volver a productos
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
          {product.code ?? "Sin código"}
        </p>
        <h1 className="mt-2 text-4xl font-bold">Imágenes de {product.name}</h1>
        <p className="mt-3 text-neutral-600">
          La primera imagen es la portada. El valor actual {product.image} seguirá disponible como fallback.
        </p>

        <div className="mt-10">
          <ProductImageManager
            productId={product.id}
            productName={product.name}
            images={product.images}
          />
        </div>
      </section>
    </main>
  );
}
