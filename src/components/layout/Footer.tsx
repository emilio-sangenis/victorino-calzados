export default function Footer() {
  return (
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
  );
}