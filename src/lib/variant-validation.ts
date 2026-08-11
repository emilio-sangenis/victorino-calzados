// Normaliza y valida SKU, color, talle y stock antes de persistir una variante.
export type VariantFormValues = {
  sku: string;
  color: string;
  size: string;
  stock: string;
};

export type VariantFieldErrors = Partial<
  Record<keyof VariantFormValues, string>
>;

type ValidVariantData = {
  sku: string;
  color: string;
  size: number;
  stock: number;
};

export function readVariantFormValues(formData: FormData): VariantFormValues {
  return {
    sku: String(formData.get("sku") ?? "").trim(),
    color: String(formData.get("color") ?? "").trim(),
    size: String(formData.get("size") ?? "").trim(),
    stock: String(formData.get("stock") ?? "").trim(),
  };
}

export function validateVariantForm(values: VariantFormValues): {
  data?: ValidVariantData;
  fieldErrors?: VariantFieldErrors;
} {
  const fieldErrors: VariantFieldErrors = {};
  const size = Number(values.size);
  const stock = Number(values.stock);

  if (!values.sku) {
    fieldErrors.sku = "El SKU es obligatorio.";
  } else if (values.sku.length > 150) {
    fieldErrors.sku = "El SKU no puede superar los 150 caracteres.";
  }

  if (!values.color) {
    fieldErrors.color = "El color es obligatorio.";
  } else if (values.color.length > 100) {
    fieldErrors.color = "El color no puede superar los 100 caracteres.";
  }

  if (!values.size) {
    fieldErrors.size = "El talle es obligatorio.";
  } else if (!Number.isInteger(size) || size <= 0) {
    fieldErrors.size = "El talle debe ser un número entero positivo.";
  }

  if (!values.stock) {
    fieldErrors.stock = "El stock es obligatorio.";
  } else if (!Number.isInteger(stock) || stock < 0) {
    fieldErrors.stock = "El stock debe ser un número entero mayor o igual a cero.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
    };
  }

  return {
    data: {
      sku: values.sku,
      color: values.color,
      size,
      stock,
    },
  };
}
