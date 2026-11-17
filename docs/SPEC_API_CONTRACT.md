# PawLocal — REST API Contract (SPEC_API_CONTRACT)

> **Document Type:** Machine-readable API Specification  
> **Base URL:** `http://localhost:5000/api`  
> **Data Format:** `application/json` (trừ multipart/form-data cho upload ảnh)

---

## 1. Chuẩn Header & Format Response

### 1.1. Headers
- Mọi request yêu cầu xác thực phải gửi kèm:  
  `Authorization: Bearer <JWT_TOKEN>`

### 1.2. Success Response Schema
```json
{
  "success": true,
  "message": "Mô tả kết quả (tùy chọn)",
  "data": { ... }
}
```

### 1.3. Error Response Schema
```json
{
  "success": false,
  "message": "Thông báo lỗi chi tiết dành cho người dùng",
  "error": "Mã lỗi kỹ thuật hoặc stack (chỉ hiển thị ở môi trường dev)"
}
```

---

## 2. Danh sách Endpoints chi tiết

### 2.1. Health Check
- **`GET /api/health`**
  - **Quyền:** Public
  - **Response 200:**
    ```json
    { "status": "ok", "uptime": 123.45, "timestamp": "2026-11-14T20:00:00.000Z" }
    ```

---

### 2.2. Authentication (`/api/auth`)

- **`POST /api/auth/register`**
  - **Quyền:** Public
  - **Body:**
    ```json
    {
      "name": "Nguyen Van A",
      "email": "customer@pawlocal.com",
      "password": "Password123!",
      "phone": "0901234567",
      "address": "123 Le Loi, Q.1, TP.HCM"
    }
    ```
  - **Response 201:**
    ```json
    {
      "success": true,
      "message": "Đăng ký thành công",
      "data": {
        "token": "eyJhbGciOi...",
        "user": {
          "_id": "654321...",
          "name": "Nguyen Van A",
          "email": "customer@pawlocal.com",
          "role": "customer",
          "phone": "0901234567",
          "address": "123 Le Loi, Q.1, TP.HCM"
        }
      }
    }
    ```
  - **Response 400:** Email đã tồn tại hoặc thiếu trường bắt buộc.

- **`POST /api/auth/login`**
  - **Quyền:** Public
  - **Body:**
    ```json
    {
      "email": "customer@pawlocal.com",
      "password": "Password123!"
    }
    ```
  - **Response 200:** Cùng format với response của register.
  - **Response 401:** Email hoặc mật khẩu không chính xác.

- **`GET /api/auth/me`**
  - **Quyền:** Yêu cầu đăng nhập (`protect`)
  - **Response 200:** Trả về thông tin user hiện tại từ token.

---

### 2.3. Categories (`/api/categories`)

- **`GET /api/categories`**
  - **Quyền:** Public
  - **Response 200:** Danh sách category (id, name, slug, petType).

- **`POST /api/categories`**
  - **Quyền:** Admin (`adminOnly`)
  - **Body:** `{ "name": "Thức ăn chó", "slug": "thuc-an-cho", "petType": "dog" }`

---

### 2.4. Products (`/api/products`)

- **`GET /api/products`**
  - **Quyền:** Public
  - **Query Params:**
    - `page` (default: 1)
    - `limit` (default: 12)
    - `search` (tìm kiếm theo tên)
    - `category` (slug hoặc ID)
    - `petType` (dog, cat, other)
    - `minPrice`, `maxPrice`
    - `sort` (price_asc, price_desc, newest)
  - **Response 200:**
    ```json
    {
      "success": true,
      "data": {
        "products": [
          {
            "_id": "prod_01",
            "name": "Hạt Royal Canin Puppy",
            "price": 250000,
            "stock": 15,
            "image": "/uploads/products/royal-canin.jpg",
            "category": { "_id": "cat_01", "name": "Thức ăn hạt" },
            "petTypes": ["dog"],
            "isAvailable": true
          }
        ],
        "pagination": { "total": 45, "page": 1, "pages": 4, "limit": 12 }
      }
    }
    ```

- **`GET /api/products/:id`**
  - **Quyền:** Public
  - **Response 200:** Chi tiết sản phẩm.
  - **Response 404:** Không tìm thấy sản phẩm.

- **`POST /api/products`**
  - **Quyền:** Admin
  - **Body:** `multipart/form-data` gồm các field (`name`, `description`, `price`, `stock`, `category`, `petTypes`) và file `image`.
  - **Response 201:** Sản phẩm vừa tạo.

- **`PATCH /api/products/:id`**
  - **Quyền:** Admin
  - **Body:** Cập nhật thông tin hoặc toggle `isAvailable`, update `stock`, upload lại `image`.

- **`DELETE /api/products/:id`**
  - **Quyền:** Admin
  - **Response 200:** `{ "success": true, "message": "Xóa sản phẩm thành công" }`

---

### 2.5. Orders (`/api/orders`)

- **`POST /api/orders`**
  - **Quyền:** Customer (Đã đăng nhập)
  - **Body:**
    ```json
    {
      "items": [
        { "productId": "prod_01", "quantity": 2 }
      ],
      "shippingAddress": {
        "recipientName": "Nguyen Van A",
        "phone": "0901234567",
        "address": "123 Le Loi, Q.1, TP.HCM",
        "note": "Giao giờ hành chính"
      }
    }
    ```
  - **Business Logic:**
    1. Kiểm tra tồn kho từng sản phẩm (`product.stock >= quantity`). Nếu không đủ -> Trả về HTTP 400 kèm tên sản phẩm hết hàng.
    2. Lấy giá và tên hiện tại của sản phẩm để tạo snapshot.
    3. Tính `subtotal`, `deliveryFee` (ví dụ: 20000 hoặc 0 nếu subtotal > 300000), `total`.
    4. Trừ `stock` của các sản phẩm tương ứng.
    5. Lưu Order với status `pending`.
  - **Response 201:** Chi tiết đơn hàng vừa tạo.

- **`GET /api/orders/my-orders`**
  - **Quyền:** Customer
  - **Response 200:** Danh sách đơn hàng của chính user hiện tại.

- **`GET /api/orders/:id`**
  - **Quyền:** Owner đơn hàng hoặc Admin
  - **Response 200:** Chi tiết đơn hàng, snapshot items, trạng thái.

- **`GET /api/admin/orders`**
  - **Quyền:** Admin
  - **Query:** `?status=pending&page=1&limit=20`
  - **Response 200:** Toàn bộ đơn hàng trong hệ thống.

- **`PATCH /api/admin/orders/:id/status`**
  - **Quyền:** Admin
  - **Body:** `{ "status": "processing" | "shipped" | "completed" | "cancelled" }`
  - **Response 200:** Đơn hàng sau khi cập nhật trạng thái.

---

### 2.6. Pets (`/api/pets`)

- **`GET /api/pets`**
  - **Quyền:** Customer (Lấy danh sách pet của chính mình)
  - **Response 200:** `[ { "_id": "...", "name": "Milo", "species": "dog", ... } ]`

- **`POST /api/pets`**
  - **Quyền:** Customer
  - **Body:** `multipart/form-data` hoặc JSON (`name`, `species`, `breed`, `birthDate`, `weightKg`, `notes`, file `photo`).
  - **Response 201:** Hồ sơ thú cưng đã lưu.

- **`PUT /api/pets/:id`**
  - **Quyền:** Customer (Chỉ cập nhật pet của chính mình)
  - **Response 200:** Thông tin pet sau cập nhật.

- **`DELETE /api/pets/:id`**
  - **Quyền:** Customer (Chỉ xóa pet của mình)
  - **Response 200:** Xóa thành công.

---

### 2.7. Grooming Services (`/api/services`)

- **`GET /api/services`**
  - **Quyền:** Public
  - **Query:** `?petType=dog`
  - **Response 200:** Danh sách dịch vụ đang `isActive: true`.

- **`POST /api/services`**
  - **Quyền:** Admin
  - **Body:** `{ "name": "Tắm sấy khử mùi", "basePrice": 150000, "durationMinutes": 60, "petTypes": ["dog", "cat"] }`

- **`PATCH /api/services/:id`**
  - **Quyền:** Admin
  - **Body:** Cập nhật thông tin hoặc toggle `isActive`.

---

### 2.8. Bookings (`/api/bookings`)

- **`GET /api/bookings/available-slots`**
  - **Quyền:** Public / Authenticated
  - **Query:** `?serviceId=srv_01&date=2026-11-20`
  - **Response 200:**
    ```json
    {
      "success": true,
      "data": {
        "allSlots": ["09:00", "10:30", "13:00", "14:30", "16:00"],
        "bookedSlots": ["10:30"],
        "availableSlots": ["09:00", "13:00", "14:30", "16:00"]
      }
    }
    ```

- **`POST /api/bookings`**
  - **Quyền:** Customer
  - **Body:**
    ```json
    {
      "petId": "pet_01",
      "serviceId": "srv_01",
      "date": "2026-11-20",
      "timeSlot": "14:30",
      "note": "Bé hơi nhát người lạ"
    }
    ```
  - **Business Logic:**
    1. Kiểm tra Pet thuộc về `req.user._id`.
    2. Kiểm tra Service có tồn tại và đang `isActive`.
    3. Kiểm tra trùng slot: Query xem đã có booking nào cùng `serviceId`, `date`, `timeSlot` và `status != 'cancelled'` chưa. Nếu có -> Báo lỗi 400 "Khung giờ này đã có người đặt".
  - **Response 201:** Booking vừa được tạo với status `pending`.

- **`GET /api/bookings/my-bookings`**
  - **Quyền:** Customer
  - **Response 200:** Danh sách lịch hẹn của user.

- **`PATCH /api/bookings/:id/cancel`**
  - **Quyền:** Customer (chỉ hủy booking của mình và đang ở status `pending` hoặc `confirmed`).
  - **Response 200:** Đổi status sang `cancelled`.

- **`GET /api/admin/bookings`**
  - **Quyền:** Admin
  - **Query:** `?date=2026-11-20&status=pending`
  - **Response 200:** Danh sách lịch hẹn để duyệt.

- **`PATCH /api/admin/bookings/:id/status`**
  - **Quyền:** Admin
  - **Body:** `{ "status": "confirmed" | "completed" | "cancelled" }`

---

### 2.9. Dashboard Stats (`/api/admin/stats`)

- **`GET /api/admin/stats`**
  - **Quyền:** Admin
  - **Response 200:**
    ```json
    {
      "success": true,
      "data": {
        "revenue": 14500000,
        "pendingOrdersCount": 8,
        "todayBookingsCount": 5,
        "lowStockProductsCount": 3,
        "recentOrders": [ ... ],
        "recentBookings": [ ... ]
      }
    }
    ```
