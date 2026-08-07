import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "Urbana Clásica",
    description:
      "Zapatilla urbana versátil para uso diario, diseñada para combinar comodidad y estilo.",
    category: "Urbanos",
    price: 74990,
    image: "👟",
    variants: [
      { id: 1, color: "Negro", size: 39, stock: 2 },
      { id: 2, color: "Negro", size: 40, stock: 5 },
      { id: 3, color: "Negro", size: 41, stock: 0 },
      { id: 4, color: "Blanco", size: 39, stock: 3 },
      { id: 5, color: "Blanco", size: 40, stock: 1 },
      { id: 6, color: "Blanco", size: 41, stock: 4 },
    ],
  },
  {
    id: 2,
    name: "Runner Pro",
    description:
      "Zapatilla deportiva liviana con diseño pensado para acompañar entrenamientos y caminatas.",
    category: "Deportivos",
    price: 89990,
    image: "👟",
    variants: [
      { id: 7, color: "Negro", size: 40, stock: 4 },
      { id: 8, color: "Negro", size: 41, stock: 3 },
      { id: 9, color: "Negro", size: 42, stock: 2 },
      { id: 10, color: "Azul", size: 40, stock: 1 },
      { id: 11, color: "Azul", size: 41, stock: 0 },
      { id: 12, color: "Azul", size: 42, stock: 3 },
    ],
  },
  {
    id: 3,
    name: "Derby Elegante",
    description:
      "Zapato clásico de estilo elegante, ideal para ocasiones formales y uso profesional.",
    category: "Clásicos",
    price: 109990,
    image: "👞",
    variants: [
      { id: 13, color: "Negro", size: 40, stock: 2 },
      { id: 14, color: "Negro", size: 41, stock: 3 },
      { id: 15, color: "Negro", size: 42, stock: 1 },
      { id: 16, color: "Marrón", size: 40, stock: 2 },
      { id: 17, color: "Marrón", size: 41, stock: 1 },
      { id: 18, color: "Marrón", size: 42, stock: 0 },
    ],
  },
  {
    id: 4,
    name: "Bota Victorino",
    description:
      "Bota resistente de diseño urbano, preparada para brindar comodidad y protección.",
    category: "Botas",
    price: 124990,
    image: "🥾",
    variants: [
      { id: 19, color: "Negro", size: 40, stock: 3 },
      { id: 20, color: "Negro", size: 41, stock: 2 },
      { id: 21, color: "Negro", size: 42, stock: 4 },
      { id: 22, color: "Suela", size: 40, stock: 1 },
      { id: 23, color: "Suela", size: 41, stock: 0 },
      { id: 24, color: "Suela", size: 42, stock: 2 },
    ],
  },
];