import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { products } from "@/data/products";
import { notFound } from "next/navigation";
import ProductSelector from "@/components/product/ProductSelector";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <main className="min-h-screen bg-stone-100 text-neutral-900">
      <Header />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-3xl bg-stone-200">
          <span className="text-[180px]">
            {product.image}
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            {product.category}
          </p>

          <h1 className="mt-3 text-5xl font-bold">
            {product.name}
          </h1>

          <p className="mt-6 text-3xl font-bold">
            {formattedPrice}
          </p>

          <p className="mt-6 max-w-xl leading-7 text-neutral-600">
            {product.description}
          </p>

          <div className="mt-8">
            <p className="mb-3 font-semibold">Talle</p>
            
            <ProductSelector variants={product.variants} />
          </div>
        </div>
      </section>
      <Footer /> 
    </main>
  );
}