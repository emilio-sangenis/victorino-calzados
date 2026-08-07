export default function Hero() {
  return (
    <section
      id="inicio"
      className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-2"
    >
      <div className="flex flex-col justify-center rounded-3xl bg-white p-10 lg:p-14">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          Nueva colección
        </p>

        <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight lg:text-7xl">
          Calzado para todos tus pasos.
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-600">
          Modelos urbanos, deportivos y clásicos con variedad de talles,
          colores y envíos a todo el país.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#productos"
            className="rounded-xl bg-amber-700 px-6 py-3 font-semibold text-white hover:bg-amber-800"
          >
            Ver catálogo
          </a>

          <a
            href="#categorias"
            className="rounded-xl border border-stone-300 px-6 py-3 font-semibold hover:bg-stone-100"
          >
            Explorar categorías
          </a>
        </div>
      </div>

      <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-neutral-900">
        <span className="rotate-[-18deg] text-[160px] drop-shadow-2xl">
          👟
        </span>
      </div>
    </section>
  );
}