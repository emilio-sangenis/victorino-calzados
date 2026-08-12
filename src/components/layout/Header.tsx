"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Brand from "@/components/layout/Brand";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { items } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[] | null>(null);
  const [categoriesError, setCategoriesError] = useState(false);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  async function openMenu() {
    setMenuOpen(true);
    if (categories) return;

    setCategoriesError(false);

    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("No se pudieron cargar las categorías.");

      const data = (await response.json()) as { categories?: unknown };
      if (!Array.isArray(data.categories)) throw new Error("Respuesta no válida.");

      setCategories(
        data.categories.filter(
          (category): category is string => typeof category === "string"
        )
      );
    } catch (error) {
      console.error("Error loading storefront categories:", error);
      setCategoriesError(true);
    }
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-800 bg-black text-white shadow-lg">
        <div className="flex w-full items-center px-3 py-3 sm:px-6 lg:px-10">
          <button type="button" onClick={openMenu} aria-label="Abrir menú de categorías" aria-expanded={menuOpen} aria-controls="category-drawer" className="mr-1 flex size-9 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full transition hover:bg-current/10 sm:mr-5 sm:size-10">
            <span className="h-0.5 w-5 bg-current" />
            <span className="ml-2.5 h-0.5 w-3.5 self-start bg-current" />
          </button>

          <Brand subtitle="Calzados" compactOnMobile />

          <div className="ml-auto flex items-center gap-8">
            <nav className="hidden gap-8 text-sm font-medium md:flex">
              <Link href="/" className="hover:text-fuchsia-400">Inicio</Link>
              <Link href="/productos" className="hover:text-fuchsia-400">Productos</Link>
              <Link href="/#contacto" className="hover:text-fuchsia-400">Contacto</Link>
            </nav>
            <Link href="/carrito" className="whitespace-nowrap rounded-full bg-white px-3 py-2 text-xs font-semibold text-neutral-900 transition-colors hover:bg-stone-200 sm:px-5 sm:text-sm">
              Mi pedido ({totalItems})
            </Link>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={closeMenu} aria-hidden="true" />

      <aside id="category-drawer" aria-label="Categorías de productos" aria-hidden={!menuOpen} className={`fixed inset-y-0 left-0 z-[70] flex w-[min(88vw,380px)] flex-col bg-black px-7 py-6 text-white shadow-2xl transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
          <Brand subtitle="Calzados" />
          <button type="button" onClick={closeMenu} aria-label="Cerrar menú" className="flex size-10 items-center justify-center rounded-full border border-neutral-700 text-2xl leading-none transition hover:border-fuchsia-400 hover:text-fuchsia-400">×</button>
        </div>

        <nav className="mt-8 flex flex-col">
          <Link href="/productos" onClick={closeMenu} className="border-b border-neutral-800 py-4 text-lg font-semibold transition hover:pl-2 hover:text-fuchsia-400">Ver todos los productos</Link>
          {categories?.map((category) => (
            <Link key={category} href={{ pathname: "/productos", query: { categoria: category } }} onClick={closeMenu} className="border-b border-neutral-800 py-4 text-lg transition hover:pl-2 hover:text-fuchsia-400">
              {category}
            </Link>
          ))}
          {!categories && !categoriesError && <p className="py-6 text-sm text-neutral-400">Cargando categorías…</p>}
          {categoriesError && <p className="py-6 text-sm text-red-300">No pudimos cargar las categorías en este momento.</p>}
        </nav>
      </aside>

      <div className="h-16" aria-hidden="true" />
    </>
  );
}
