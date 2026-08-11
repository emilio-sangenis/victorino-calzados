// Valida las URLs y metadatos que componen la galería de un producto.
export type ProductImageFormValues = {
  url: string;
  alt: string;
  color: string;
};

export type ProductImageFieldErrors = Partial<
  Record<keyof ProductImageFormValues, string>
>;

export function readProductImageFormValues(
  formData: FormData
): ProductImageFormValues {
  return {
    url: String(formData.get("url") ?? "").trim(),
    alt: String(formData.get("alt") ?? "").trim(),
    color: String(formData.get("color") ?? "").trim(),
  };
}

export function validateProductImageForm(values: ProductImageFormValues): {
  data?: {
    url: string;
    alt: string;
    color: string | null;
  };
  fieldErrors?: ProductImageFieldErrors;
} {
  const fieldErrors: ProductImageFieldErrors = {};

  try {
    const url = new URL(values.url);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      fieldErrors.url = "La imagen debe usar una URL HTTP o HTTPS.";
    }
  } catch {
    fieldErrors.url = "Ingresá una URL de imagen válida.";
  }

  if (!values.alt) {
    fieldErrors.alt = "El texto alternativo es obligatorio.";
  } else if (values.alt.length > 250) {
    fieldErrors.alt = "El texto alternativo no puede superar los 250 caracteres.";
  }

  if (values.color.length > 100) {
    fieldErrors.color = "El color no puede superar los 100 caracteres.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
    };
  }

  return {
    data: {
      url: values.url,
      alt: values.alt,
      color: values.color || null,
    },
  };
}
