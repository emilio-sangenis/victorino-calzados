type ProductCardProps = {
  name: string;
  category: string;
  price: string;
  image: string;
};

export default function ProductCard({
  name,
  category,
  price,
  image,
}: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex aspect-square items-center justify-center bg-stone-200">
        <span className="text-8xl">{image}</span>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          {category}
        </p>

        <h3 className="mt-2 text-lg font-semibold">{name}</h3>

        <p className="mt-3 text-xl font-bold">{price}</p>

        <button className="mt-5 w-full rounded-xl bg-neutral-900 px-4 py-3 font-semibold text-white hover:bg-neutral-700">
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}