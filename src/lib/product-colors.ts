const PRODUCT_COLORS: Record<string, string> = {
  negro: "#171717",
  blanco: "#ffffff",
  gris: "#8a8a8a",
  beige: "#d8c3a5",
  suela: "#b7793f",
  marron: "#7c4a2d",
  camel: "#b7794b",
  rojo: "#b91c1c",
  bordo: "#6b1024",
  rosa: "#ec4899",
  fucsia: "#d6008f",
  azul: "#2563eb",
  "azul marino": "#172554",
  celeste: "#7dd3fc",
  verde: "#15803d",
  amarillo: "#facc15",
  naranja: "#f97316",
  violeta: "#7e22ce",
  lila: "#c4b5fd",
  dorado: "#c9a227",
  plateado: "#b8bdc5",
};

export function normalizeProductColor(color: string) {
  return color
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getProductColorHex(color: string) {
  return PRODUCT_COLORS[normalizeProductColor(color)] ?? null;
}
