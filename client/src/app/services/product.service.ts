import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, Category, Banner, CartItem, Feedback, GroomingService } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  readonly API_URL = environment.apiUrl;
  private readonly CART_STORAGE_KEY = 'pawlocal_cart';

  // State Signals
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly banners = signal<Banner[]>([]);
  readonly services = signal<GroomingService[]>([]);
  readonly feedbacks = signal<Feedback[]>([
    {
      id: 1,
      name: 'Thu Trang & Bé Corgi Mochi',
      initials: 'TT',
      rating: 5,
      productName: 'Cắt Tỉa Lông Tạo Kiểu Toàn Diện',
      comment: 'Bé Mochi nhà mình đi spa về thơm phức và form lông tròn xoe cực kỳ đáng yêu. Nhân viên nhiệt tình 10/10!',
      date: '14/11/2026',
    },
    {
      id: 2,
      name: 'Minh Quân & Bé Mèo Mướp',
      initials: 'MQ',
      rating: 5,
      productName: 'Pate Mèo Ciao Churu Vị Cá Hồi',
      comment: 'Giao hàng siêu nhanh chỉ trong 2 tiếng. Bé mèo nhà mình kén ăn mà thấy tuýp này là chạy tới liền.',
      date: '12/11/2026',
    },
    {
      id: 3,
      name: 'Hoàng Yến & Bé Poodle Bông',
      initials: 'HY',
      rating: 5,
      productName: 'Tắm Sấy Khử Mùi & Thư Giãn',
      comment: 'Dịch vụ chuyên nghiệp, đặt lịch online tiện lợi không phải chờ đợi. Lông mềm mượt thơm lâu.',
      date: '10/11/2026',
    },
    {
      id: 4,
      name: 'Khánh Linh & Bé Mèo Simmy',
      initials: 'KL',
      rating: 5,
      productName: 'Cát Vệ Sinh Đậu Nành Tofu (6L)',
      comment: 'Cát đậu nành Tofu siêu khử mùi, xả thẳng bồn cầu cực kỳ tiện lợi và không bụi. Bé nhà mình rất thích!',
      date: '08/11/2026',
    },
    {
      id: 5,
      name: 'Đức Anh & Bé Golden Bắp',
      initials: 'ĐA',
      rating: 5,
      productName: 'Hạt Royal Canin Medium Puppy',
      comment: 'Bé Bắp ăn hạt này tiêu hóa cực tốt, phân khuôn đẹp, lông bóng mượt và tăng cân đều đặn.',
      date: '05/11/2026',
    },
  ]);

  // Cart Signal
  readonly cart = signal<CartItem[]>(this.loadCartFromStorage());

  readonly cartCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  constructor() {
    this.loadData();
  }

  loadData(): void {
    // 1. Tải dữ liệu tổng hợp cho trang chủ
    this.http
      .get<{
        success: boolean;
        banners: Banner[];
        categories: Category[];
        featuredProducts: Product[];
        saleProducts: Product[];
        newProducts: Product[];
        services: GroomingService[];
      }>(`${this.API_URL}/home`)
      .subscribe({
        next: (res) => {
          if (res.banners) this.banners.set(res.banners);
          if (res.categories) this.categories.set(res.categories);
          if (res.services) this.services.set(res.services);

          // 2. Nạp toàn bộ danh sách sản phẩm
          this.http
            .get<{ success: boolean; data: { products: Product[] } }>(
              `${this.API_URL}/products?limit=100`
            )
            .subscribe({
              next: (pRes) => {
                if (pRes?.data?.products) {
                  this.products.set(pRes.data.products);
                }
              },
              error: () => {
                // Fallback nếu API riêng chưa trả
                if (res.featuredProducts) {
                  this.products.set(res.featuredProducts);
                }
              },
            });
        },
        error: (err) => {
          console.error('Không thể kết nối API PawLocal:', err);
        },
      });
  }

  getProductById(idOrSlug: string | number): Product | undefined {
    return this.products().find(
      (p) =>
        p.id === Number(idOrSlug) ||
        p.slug === idOrSlug ||
        p._id === idOrSlug
    );
  }

  getDiscountRate(p: Product): number {
    if (p.oldPrice && p.oldPrice > p.price) {
      return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
    }
    return 0;
  }

  // Cart operations
  addToCart(product: Product, quantity: number = 1): void {
    this.cart.update((items) => {
      const existing = items.find(
        (i) => i.product.id === product.id || i.product._id === product._id
      );
      if (existing) {
        return items.map((i) =>
          i.product.id === product.id || i.product._id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...items, { product, quantity }];
    });
    this.saveCartToStorage();
  }

  updateQuantity(productId: string | number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cart.update((items) =>
      items.map((i) =>
        i.product.id === productId || i.product._id === productId
          ? { ...i, quantity }
          : i
      )
    );
    this.saveCartToStorage();
  }

  removeFromCart(productId: string | number): void {
    this.cart.update((items) =>
      items.filter(
        (i) => i.product.id !== productId && i.product._id !== productId
      )
    );
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cart.set([]);
    this.saveCartToStorage();
  }

  private loadCartFromStorage(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveCartToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cart()));
    } catch (e) {
      console.error('Không thể lưu giỏ hàng vào storage', e);
    }
  }
}
