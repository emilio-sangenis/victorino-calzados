export default function Benefits() {
  return (
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
        );
}