# PawLocal — Architecture & Data Specifications (SPEC_ARCHITECTURE)

> **Document Type:** Machine-readable & Developer Reference  
> **Project:** PawLocal (Pet Store & Grooming Booking Web App)  
> **Architecture:** Monorepo (Angular 17+ Standalone Frontend + Node.js/Express REST API + MongoDB Mongoose)

---

## 1. Hệ thống & Kiến trúc Monorepo

```
PawLocal/
├── docs/                     # Toàn bộ tài liệu đặc tả chuẩn máy đọc
├── client/                   # Frontend: Angular Standalone, Mobile-first
└── server/                   # Backend: Node.js, Express, MongoDB (Mongoose)
```

- **Frontend Client:** Angular 17+ (hoặc 18/19), 100% Standalone Components, Signal-based reactivity, Functional Interceptors & Guards, SCSS/CSS Mobile-first.
- **Backend Server:** Node.js (v18+), Express.js REST API, Mongoose ODM kết nối MongoDB local hoặc MongoDB Atlas, JWT Authentication, Multer file upload.
- **Giao tiếp:** HTTP RESTful qua JSON. Tất cả request được tiền tố `/api`. Upload file lưu tại `server/uploads/` và được phục vụ tĩnh qua `/uploads`.

---

## 2. Ma trận Phân quyền (Role-Based Access Control - RBAC)

Hệ thống có 2 vai trò (`User.role`):

| Quyền hạn / Nghiệp vụ | Khách vãng lai (Guest) | Khách hàng (`customer`) | Quản trị viên (`admin`) |
| :--- | :---: | :---: | :---: |
| Xem danh mục, sản phẩm, dịch vụ | Có | Có | Có |
| Tìm kiếm, lọc sản phẩm | Có | Có | Có |
| Quản lý giỏ hàng (local) | Có | Có | Có |
| Đăng ký, đăng nhập tài khoản | Có | Có | Đã đăng nhập |
| Đặt hàng COD | Không (Cần login) | Có | Có |
| Xem lịch sử đơn hàng cá nhân | Không | Có | Có (Của chính admin) |
| Quản lý hồ sơ Pet (CRUD) | Không | Có | Có (Của chính admin) |
| Đặt lịch hẹn grooming | Không | Có | Có |
| Hủy lịch hẹn (trước giờ hẹn) | Không | Có | Có |
| Quản lý sản phẩm (CRUD, Stock, Ẩn/Hiện) | Không | Không | **Có** |
| Quản lý dịch vụ grooming (CRUD) | Không | Không | **Có** |
| Quản lý đơn hàng (Đổi trạng thái) | Không | Không | **Có** |
| Quản lý lịch đặt (Duyệt/Hoàn tất/Hủy) | Không | Không | **Có** |
| Xem thống kê doanh thu & KPI Dashboard | Không | Không | **Có** |

---

## 3. Data Schema & Models (Mongoose Specifications)

### 3.1. User Model (`server/src/models/User.js`)
```javascript
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  createdAt: { type: Date, default: Date.now }
}
```

### 3.2. Category Model (`server/src/models/Category.js`)
```javascript
{
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  petType: { type: String, enum: ["dog", "cat", "all"], default: "all" },
  createdAt: { type: Date, default: Date.now }
}
```

### 3.3. Product Model (`server/src/models/Product.js`)
```javascript
{
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  image: { type: String, default: "/uploads/products/default-product.png" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  petTypes: [{ type: String, enum: ["dog", "cat", "bird", "other"], default: ["dog"] }],
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```
*Index:* `{ name: "text", description: "text" }`, `{ category: 1 }`

### 3.4. Order Model (`server/src/models/Order.js`)
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      image: { type: String, default: "" }
    }
  ],
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "completed", "cancelled"],
    default: "pending"
  },
  paymentMethod: { type: String, enum: ["COD"], default: "COD" },
  shippingAddress: {
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String, default: "" }
  },
  createdAt: { type: Date, default: Date.now }
}
```

### 3.5. Pet Model (`server/src/models/Pet.js`)
```javascript
{
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, trim: true },
  species: { type: String, enum: ["dog", "cat", "other"], required: true },
  breed: { type: String, default: "" },
  birthDate: { type: Date },
  weightKg: { type: Number, min: 0 },
  photo: { type: String, default: "/uploads/pets/default-pet.png" },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
}
```

### 3.6. Service Model (`server/src/models/Service.js`)
```javascript
{
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  basePrice: { type: Number, required: true, min: 0 },
  durationMinutes: { type: Number, required: true, default: 60 },
  petTypes: [{ type: String, enum: ["dog", "cat", "other"], default: ["dog"] }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

### 3.7. Booking Model (`server/src/models/Booking.js`)
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  timeSlot: {
    type: String,
    enum: ["09:00", "10:30", "13:00", "14:30", "16:00"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending"
  },
  price: { type: Number, required: true },
  note: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
}
```
*Index chống trùng slot:*  
`bookingSchema.index({ service: 1, date: 1, timeSlot: 1, status: { $ne: "cancelled" } })`

---

## 4. Frontend State Management Architecture

1. **Auth State (`AuthService`)**:
   - `currentUser = signal<User | null>(null)`
   - `isAuthenticated = computed(() => !!this.currentUser())`
   - `isAdmin = computed(() => this.currentUser()?.role === 'admin')`
   - Token & User Profile được lưu trữ bền vững tại `localStorage`. Khi khởi động app, `AuthService` tự phục hồi session.

2. **Cart State (`CartService`)**:
   - `items = signal<CartItem[]>(loadFromLocalStorage())`
   - `totalCount = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0))`
   - `subtotal = computed(() => this.items().reduce((acc, item) => acc + item.price * item.quantity, 0))`
   - Kiểm tra `quantity <= product.stock` trước khi cập nhật. Tự động đồng bộ vào `localStorage` qua `effect()`.

3. **Page/Data State**:
   - Xử lý trực tiếp trong từng feature component thông qua Signals và RxJS:
     - `loading = signal<boolean>(false)`
     - `error = signal<string | null>(null)`
     - `data = signal<T[]>(...)`
