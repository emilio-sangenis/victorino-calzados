import ProductCard from "@/components/product/ProductCard";
import { products } from "@/data/products";
import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 text-neutral-900">
     <Header />
      <Hero />

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
    product={product}
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