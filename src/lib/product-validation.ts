// Normaliza y valida los datos editables de un producto antes de persistirlos.
export type ProductFormValues = {
  code: string;
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
};

export type ProductFieldErrors = Partial<
  Record<keyof ProductFormValues, string>
>;

type ValidProductData = {
  code: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
};

export function readProductFormValues(formData: FormData): ProductFormValues {
  return {
    code: String(formData.get("code") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
  };
}

export function validateProductForm(values: ProductFormValues): {
  data?: ValidProductData;
  fieldErrors?: ProductFieldErrors;
} {
  const fieldErrors: ProductFieldErrors = {};
  const price = Number(values.price);

  if (!values.code) {
    fieldErrors.code = "El código es obligatorio.";
  } else if (values.code.length > 100) {
    fieldErrors.code = "El código no puede superar los 100 caracteres.";
  }

  if (!values.name) {
    fieldErrors.name = "El nombre es obligatorio.";
  } else if (values.name.length > 200) {
    fieldErrors.name = "El nombre no puede superar los 200 caracteres.";
  }

  if (!values.description) {
    fieldErrors.description = "La descripción es obligatoria.";
  }

  if (!values.category) {
    fieldErrors.category = "La categoría es obligatoria.";
  } else if (values.category.length > 100) {
    fieldErrors.category = "La categoría no puede superar los 100 caracteres.";
  }

  if (!values.price) {
    fieldErrors.price = "El precio es obligatorio.";
  } else if (!Number.isInteger(price) || price < 0) {
    fieldErrors.price = "El precio debe ser un número entero mayor o igual a cero.";
  }

  if (!values.image) {
    fieldErrors.image = "La representación visual es obligatoria.";
  } else if (values.image.length > 500) {
    fieldErrors.image = "La representación visual es demasiado extensa.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
    };
  }

  return {
    data: {
      code: values.code,
      name: values.name,
      description: values.description,
      category: values.category,
      price,
      image: values.image,
    },
  };
}
