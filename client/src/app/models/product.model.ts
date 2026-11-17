export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  order?: number;
  petType?: string;
  _id?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  categorySlug?: string;
  price: number;
  oldPrice: number;
  image: string;
  hot: boolean;
  stock: number;
  description?: string;
  rating?: number;
  petTypes?: string[];
  isAvailable?: boolean;
  category?: Category | string;
  _id?: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Feedback {
  id: number;
  name: string;
  avatar?: string;
  initials?: string;
  rating: number;
  productName: string;
  comment: string;
  date: string;
}

export interface GroomingService {
  _id?: string;
  id?: number;
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  petTypes: string[];
  isActive: boolean;
}
