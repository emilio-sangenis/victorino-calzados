import Link from "next/link";
import { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex aspect-square items-center justify-center bg-stone-200">
        <span className="text-8xl">{product.image}</span>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          {product.category}
        </p>

        <h3 className="mt-2 text-lg font-semibold">
          {product.name}
        </h3>

        <p className="mt-3 text-xl font-bold">
          {formattedPrice}
        </p>
        <Link
          href={`/productos/${product.id}`}
          className="mt-5 block w-full rounded-xl border border-neutral-900 px-4 py-3 text-center font-semibold hover:bg-stone-100"
        >
          Ver producto
        </Link>

        <button className="mt-5 w-full rounded-xl bg-neutral-900 px-4 py-3 font-semibold text-white hover:bg-neutral-700">
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}