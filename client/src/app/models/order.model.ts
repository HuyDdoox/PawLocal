export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  address: string;
  note?: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'COD' | 'VIETQR';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface PaymentDetails {
  qrUrl?: string;
  transferNote?: string;
  paidAt?: string;
}

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string; phone?: string };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentDetails?: PaymentDetails;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt?: string;
}
