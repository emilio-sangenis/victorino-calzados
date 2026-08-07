      export default function Categories() {
  return (
      <section id="categorias" className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            Categorías
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Encontrá tu estilo
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Urbanos", "Deportivos", "Clásicos", "Botas"].map((category) => (
            <article
              key={category}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="mb-10 text-4xl">👞</div>
              <h3 className="text-xl font-semibold">{category}</h3>
              <p className="mt-2 text-sm text-neutral-500">
                Ver productos
              </p>
            </article>
          ))}
        </div>
      </section>
        );
}