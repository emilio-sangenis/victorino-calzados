"use client";

// Agrega URLs a la galería y permite seleccionar portada o quitar registros existentes.
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadPresigned } from "@vercel/blob/client";
import {
  addProductImage,
  registerUploadedProductImage,
  removeProductImage,
  setPrimaryProductImage,
  type ProductImageFormState,
} from "@/app/admin/productos/[id]/imagenes/actions";

type ProductImageItem = {
  id: number;
  url: string;
  alt: string;
  color: string | null;
  position: number;
};

type ProductImageManagerProps = {
  productId: number;
  productName: string;
  images: ProductImageItem[];
};

const initialState: ProductImageFormState = {};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProductImageManager({
  productId,
  productName,
  images,
}: ProductImageManagerProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const uploadFormRef = useRef<HTMLFormElement>(null);
  const [uploadPending, setUploadPending] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [state, formAction, formPending] = useActionState(
    addProductImage.bind(null, productId),
    initialState
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [router, state.success]);

  function runImageAction(action: () => Promise<{ success: boolean; error?: string }>) {
    setActionError(null);

    startTransition(async () => {
      const result = await action();

      if (!result.success) {
        setActionError(result.error ?? "No se pudo actualizar la galería.");
        return;
      }

      router.refresh();
    });
  }

  async function handleFileUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadError(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file");
    const alt = String(formData.get("alt") ?? "").trim();
    const color = String(formData.get("color") ?? "").trim();

    if (!(file instanceof File) || file.size === 0) {
      setUploadError("Seleccioná una imagen.");
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError("El archivo debe ser JPG, PNG o WebP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError("La imagen no puede superar los 5 MB.");
      return;
    }

    if (!alt) {
      setUploadError("El texto alternativo es obligatorio.");
      return;
    }

    setUploadPending(true);

    try {
      const blob = await uploadPresigned(`products/${productId}/${file.name}`, file, {
        access: "public",
        contentType: file.type,
        handleUploadUrl: "/api/admin/product-images/upload",
        clientPayload: JSON.stringify({ productId, contentType: file.type }),
      });
      const result = await registerUploadedProductImage(productId, {
        url: blob.url,
        alt,
        color,
      });

      if (!result.success) {
        setUploadError(
          result.error ?? "El archivo se subió, pero no se pudo registrar la imagen."
        );
        return;
      }

      uploadFormRef.current?.reset();
      router.refresh();
    } catch (error) {
      console.error("Error uploading product image:", error);
      setUploadError("No se pudo subir la imagen.");
    } finally {
      setUploadPending(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Subir imagen</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Formatos permitidos: JPG, PNG y WebP. Tamaño máximo: 5 MB.
        </p>

        <form
          ref={uploadFormRef}
          onSubmit={handleFileUpload}
          className="mt-6 space-y-5"
        >
          <div>
            <label htmlFor="blob-file" className="block text-sm font-medium">
              Archivo
            </label>
            <input
              id="blob-file"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              className="mt-2 block w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-stone-100 file:px-4 file:py-2 file:font-semibold"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="blob-alt" className="block text-sm font-medium">
                Texto alternativo
              </label>
              <input
                id="blob-alt"
                name="alt"
                required
                defaultValue={productName}
                placeholder="Ej.: Zapatilla urbana negra de perfil"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>

            <div>
              <label htmlFor="blob-color" className="block text-sm font-medium">
                Color asociado (opcional)
              </label>
              <input
                id="blob-color"
                name="color"
                placeholder="Ej.: Negro"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>
          </div>

          {uploadError && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {uploadError}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploadPending}
              className="rounded-xl bg-neutral-900 px-5 py-3 font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadPending ? "Subiendo..." : "Subir imagen"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Agregar imagen por URL</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Esta etapa registra una imagen ya alojada externamente. El upload directo se agregará en el próximo checkpoint.
        </p>

        <form ref={formRef} action={formAction} className="mt-6 space-y-5">
          <div>
            <label htmlFor="image-url" className="block text-sm font-medium">
              URL de la imagen
            </label>
            <input
              id="image-url"
              name="url"
              type="url"
              required
              placeholder="https://ejemplo.com/producto.webp"
              className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
            />
            {state.fieldErrors?.url && (
              <p className="mt-2 text-sm text-red-700">{state.fieldErrors.url}</p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="image-alt" className="block text-sm font-medium">
                Texto alternativo
              </label>
              <input
                id="image-alt"
                name="alt"
                required
                defaultValue={productName}
                placeholder="Ej.: Zapatilla urbana negra de perfil"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
              {state.fieldErrors?.alt && (
                <p className="mt-2 text-sm text-red-700">{state.fieldErrors.alt}</p>
              )}
            </div>

            <div>
              <label htmlFor="image-color" className="block text-sm font-medium">
                Color asociado (opcional)
              </label>
              <input
                id="image-color"
                name="color"
                placeholder="Ej.: Negro"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
              {state.fieldErrors?.color && (
                <p className="mt-2 text-sm text-red-700">{state.fieldErrors.color}</p>
              )}
            </div>
          </div>

          {state.error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={formPending}
              className="rounded-xl bg-neutral-900 px-5 py-3 font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formPending ? "Guardando..." : "Agregar imagen"}
            </button>
          </div>
        </form>
      </section>

      {actionError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </p>
      )}

      <section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <article key={image.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* La etiqueta img permite previsualizar dominios externos antes de configurar next/image para el storefront. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt}
                className="aspect-square w-full bg-stone-100 object-cover"
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{image.alt}</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {image.color ?? "Todos los colores"}
                    </p>
                  </div>
                  {index === 0 && (
                    <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                      Principal
                    </span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {index !== 0 && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        runImageAction(() =>
                          setPrimaryProductImage(productId, image.id)
                        )
                      }
                      className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold hover:bg-stone-100 disabled:opacity-60"
                    >
                      Hacer principal
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      runImageAction(() => removeProductImage(productId, image.id))
                    }
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {images.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center text-neutral-500 shadow-sm">
            Este producto todavía no tiene imágenes en su galería.
          </div>
        )}
      </section>
    </div>
  );
}
