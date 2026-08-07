// Define los datos del cliente y las opciones disponibles para envío y pago.
export type ShippingMethod = "pickup" | "delivery";

export type PaymentMethod =
  | "mercadopago"
  | "transfer";

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}