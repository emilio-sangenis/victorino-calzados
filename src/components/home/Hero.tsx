import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex h-[78svh] min-h-[560px] items-end overflow-hidden"
    >
      <Image
        src="/images/victorino-local-hero.jpg"
        alt="Fachada del local de Victorino Calzados"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[58%_center]"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent lg:via-black/25" />

      <div className="relative z-10 w-full px-6 pb-12 text-white sm:pb-16 lg:px-10 lg:pb-20">
        <p className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300 [text-shadow:0_2px_12px_rgb(0_0_0/0.9)]">
          <span className="h-px w-10 bg-fuchsia-500" aria-hidden="true" />
          Victorino Calzados
        </p>

        <h1 className="max-w-3xl text-5xl font-bold leading-none tracking-tight [text-shadow:0_3px_24px_rgb(0_0_0/0.95)] sm:text-6xl lg:text-7xl">
          Calzado para todos tus pasos.
        </h1>

        <p className="mt-5 max-w-lg text-base font-medium leading-7 text-white [text-shadow:0_2px_12px_rgb(0_0_0/0.95)] sm:text-lg">
          Modelos urbanos, deportivos y clásicos con variedad de talles y colores.
        </p>

        <Link
          href="/productos"
          className="mt-7 inline-flex rounded-full bg-black px-7 py-3 font-semibold text-white shadow-xl ring-1 ring-fuchsia-400/50 transition hover:-translate-y-0.5 hover:bg-neutral-900"
        >
          Ver catálogo
        </Link>
      </div>
    </section>
  );
}
