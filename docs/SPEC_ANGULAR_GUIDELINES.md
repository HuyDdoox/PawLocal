# PawLocal — Angular Coding Guidelines & Best Practices (SPEC_ANGULAR_GUIDELINES)

> **Document Type:** Machine-readable Coding Rules & Technical Standard  
> **Framework:** Angular 17+ (hoặc 18/19) Standalone  
> **Target UX:** Mobile-First (Viewport chuẩn 360px – 430px, responsive lên Tablet/Desktop)

---

## 1. Nguyên tắc cốt lõi (Core Principles)

### 1.1. Standalone Components 100%
- **Không dùng `NgModule`:** Mọi Component, Directive, Pipe đều phải khai báo `standalone: true`.
- **Imports cụ thể:** Chỉ import những module/component/directive thực sự cần thiết trong mảng `imports: [...]` của decorator `@Component`.
- **Routing Lazy Loading:** Mọi feature route phải load qua `loadComponent: () => import(...)`.

### 1.2. Signal-First State Management
- Sử dụng **Angular Signals** (`signal()`, `computed()`, `effect()`) thay cho state phức tạp.
- Khi làm việc với RxJS `HttpClient`, dùng `toSignal()` hoặc subscribe gán vào `signal` để binding trực tiếp ra template:
  ```typescript
  // Ví dụ chuẩn
  readonly products = signal<Product[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly hasProducts = computed(() => this.products().length > 0);
  ```
- **Cart State:** `CartService` sử dụng Signal lưu trữ `items`, `computed()` để tính `totalCount` và `subtotal`, tự động đồng bộ hóa `localStorage` bằng `effect()`.

### 1.3. Dependency Injection Hiện Đại
- Sử dụng hàm `inject()` thay thế constructor injection:
  ```typescript
  // Khuyên dùng:
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  ```

### 1.4. OnPush Change Detection
- Mọi Presentational / Shared Component (Product Card, Badge, Skeleton, Dialog...) và các Feature Component phải bật:
  ```typescript
  @Component({
    ...
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  ```

### 1.5. Functional Interceptors & Guards
- Không dùng Class-based Interceptors cũ (`implements HttpInterceptor`).
- Sử dụng **Functional Interceptors** (`HttpInterceptorFn`):
  - `authInterceptor`: Tự động lấy token từ `AuthService` và gắn `Authorization: Bearer <token>` vào request.
  - `errorInterceptor`: Bắt mã lỗi 401 (xóa token, redirect `/login`), mã lỗi 403 (báo không có quyền).
  - Đăng ký tại `app.config.ts`:
    ```typescript
    export const appConfig: ApplicationConfig = {
      providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
      ]
    };
    ```
- Sử dụng **Functional Guards** (`CanActivateFn`):
  - `authGuard`: Kiểm tra `authService.isAuthenticated()`.
  - `adminGuard`: Kiểm tra `authService.isAdmin()`.

### 1.6. Typed Reactive Forms
- Sử dụng `NonNullableFormBuilder` hoặc Typed `FormGroup`:
  ```typescript
  private readonly fb = inject(NonNullableFormBuilder);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  ```
- Hiển thị thông báo lỗi trực quan khi control bị `invalid` và `touched`.

---

## 2. Quy ước Đặt tên & Cấu trúc File

### 2.1. Naming Conventions
- **Thư mục & File:** Kebab-case (`product-card.component.ts`, `cart.service.ts`, `auth.guard.ts`).
- **Class:** PascalCase (`ProductCardComponent`, `CartService`, `AuthGuard`).
- **Biến & Hàm:** camelCase (`getProducts()`, `currentUser`, `isAvailable`).
- **Interfaces & Types:** PascalCase (`Product`, `CartItem`, `Order`, `ApiResponse<T>`).

### 2.2. Cấu trúc thư mục Client (`client/src/app/`)
```
src/app/
├── core/                       # Singleton toàn ứng dụng
│   ├── guards/                 # auth.guard.ts, admin.guard.ts
│   ├── interceptors/           # auth.interceptor.ts, error.interceptor.ts
│   ├── services/               # auth.service.ts, api.service.ts
│   └── models/                 # user.model.ts, product.model.ts, order.model.ts...
│
├── features/                   # Chức năng nghiệp vụ theo route
│   ├── auth/                   # login/, register/
│   ├── home/                   # home.component
│   ├── shop/                   # product-list/, product-detail/
│   ├── cart/                   # cart.component
│   ├── orders/                 # checkout/, order-list/, order-detail/
│   ├── pets/                   # pet-list/, pet-form/
│   ├── booking/                # service-list/, booking-create/, my-bookings/
│   └── admin/                  # admin-layout/, dashboard/, products/, orders/, bookings/
│
├── shared/                     # Dùng chung (Dumb/UI Components)
│   ├── components/             # product-card, loading-skeleton, empty-state, confirm-dialog
│   ├── pipes/                  # vnd-currency.pipe.ts, time-slot.pipe.ts
│   └── directives/
│
├── layout/                     # Layout bao bọc
│   ├── mobile-topbar/          # Logo, search icon, cart badge
│   └── mobile-bottom-nav/      # Home, Shop, Booking, Pet, Profile
│
├── app.config.ts               # Providers & Config
├── app.routes.ts               # Routing definitions
└── app.component.ts            # Root component chứa router-outlet & layout
```

---

## 3. Quy chuẩn UI/UX Mobile-First

1. **Kích thước màn hình cơ sở:** Thiết kế tối ưu hiển thị tại màn hình rộng **390px** (iPhone 12/13/14), kiểm tra co giãn tốt từ **360px** đến **430px**. Màn hình Desktop dùng layout căn giữa có max-width hợp lý (ví dụ: `max-width: 600px` cho màn client hoặc layout 2 bên cho admin).
2. **Kích thước Tap Target:** Tất cả các nút bấm, input, chip thời gian phải có chiều cao tối thiểu **44px** để bấm ngón tay dễ dàng.
3. **Thanh điều hướng dưới (Bottom Nav):** Luôn cố định ở đáy màn hình điện thoại với 5 tab chính:
   - 🏠 **Trang chủ** (`/home`)
   - 🛍️ **Cửa hàng** (`/shop`)
   - 📅 **Đặt lịch** (`/booking`)
   - 🐾 **Thú cưng** (`/pets`)
   - 👤 **Tài khoản** (`/profile` hoặc `/login`)
4. **Trạng thái UI bắt buộc trên mọi màn hình:**
   - **Loading:** Hiển thị `loading-skeleton` (thẻ mờ nhấp nháy), không để màn hình trống trơn.
   - **Empty:** Hiển thị thông báo thân thiện + nút bấm hành động (ví dụ: "Giỏ hàng trống - Khám phá sản phẩm ngay").
   - **Error:** Báo lỗi rõ ràng kèm nút "Thử lại".
