import Link from "next/link";

export default function Header() {
  return (
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
          <Link href="/" className="hover:text-amber-700">
            Inicio
          </Link>
          
          <Link href="/productos" className="hover:text-amber-700">
            Productos
          </Link>

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
  );
}