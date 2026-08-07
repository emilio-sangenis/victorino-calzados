import ProductCard from "../components/ProductCard";

const products = [
  {
    id: 1,
    name: "Urbana Clásica",
    category: "Urbanos",
    price: "$74.990",
    image: "👟",
  },
  {
    id: 2,
    name: "Runner Pro",
    category: "Deportivos",
    price: "$89.990",
    image: "👟",
  },
  {
    id: 3,
    name: "Derby Elegante",
    category: "Clásicos",
    price: "$109.990",
    image: "👞",
  },
  {
    id: 4,
    name: "Bota Victorino",
    category: "Botas",
    price: "$124.990",
    image: "🥾",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 text-neutral-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xl font-bold tracking-[0.15em]">
              VICTORINO
            </p>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-700">
              Calzados
            </p>
          </div>

          <nav className="hidden gap-8 text-sm font-medium md:flex">
            <a href="#inicio" className="hover:text-amber-700">
              Inicio
            </a>
            <a href="#productos" className="hover:text-amber-700">
              Productos
            </a>
            <a href="#categorias" className="hover:text-amber-700">
              Categorías
            </a>
            <a href="#contacto" className="hover:text-amber-700">
              Contacto
            </a>
          </nav>

          <button className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white">
            Carrito
          </button>
        </div>
      </header>

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

      <section id="productos" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
              Catálogo
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Productos destacados
            </h2>
          </div>

          <button className="hidden rounded-xl border border-stone-300 px-5 py-2 font-medium md:block">
            Ver todos
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
{products.map((product) => (
  <ProductCard
    key={product.id}
    name={product.name}
    category={product.category}
    price={product.price}
    image={product.image}
  />
))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-7">
            <p className="text-3xl">🚚</p>
            <h3 className="mt-4 font-semibold">Envíos nacionales</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Envíos a domicilio y retiro en sucursal.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-7">
            <p className="text-3xl">💳</p>
            <h3 className="mt-4 font-semibold">Pago seguro</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Tarjetas, transferencia y medios digitales.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-7">
            <p className="text-3xl">🔄</p>
            <h3 className="mt-4 font-semibold">Cambios simples</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Cambio de talle sujeto a disponibilidad.
            </p>
          </article>
        </div>
      </section>

      <footer id="contacto" className="bg-neutral-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-12 md:flex-row">
          <div>
            <p className="text-xl font-bold tracking-[0.15em]">
              VICTORINO
            </p>
            <p className="mt-1 text-sm text-neutral-400">
              Calzados
            </p>
          </div>

          <div className="text-sm text-neutral-400">
            <p>WhatsApp: +54 9 0000 000000</p>
            <p className="mt-2">Instagram: @victorinocalzados</p>
          </div>
        </div>
      </footer>
    </main>
  );
}