# 🐾 PawLocal — Pet Store & Grooming Booking Web App

> **Công nghệ:** Monorepo (Angular 22 Standalone + Tailwind CSS + Node.js / Express + MongoDB Mongoose)  
> **Phong cách UI:** Mobile-First (Viewport chuẩn 360px – 430px), Google Font `Plus Jakarta Sans`, Soft Shadow, Vector SVG Icons  
> **Kiến trúc:** Clean RESTful API, Angular Signals State Management, OnPush Change Detection, Functional Interceptors & Guards

---

## 📌 1. Tài Khoản Demo Sẵn Có (Sau khi chạy Seed)

| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn chính |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@pawlocal.com` | `Password123!` | Xem KPI Dashboard, duyệt/đổi trạng thái đơn hàng, duyệt lịch hẹn grooming, quản lý kho sản phẩm (thêm/sửa/xóa, ẩn/mở bán) |
| **Khách hàng (Customer)** | `customer@pawlocal.com` | `Password123!` | Mua sắm sản phẩm, giỏ hàng Signal, đặt hàng COD tự trừ tồn kho, quản lý hồ sơ thú cưng, đặt lịch hẹn spa chống trùng slot |

---

## 🚀 2. Hướng Dẫn Cài Đặt & Chạy Local

### Bước 1: Khởi động Backend (`server/`)
```bash
cd PawLocal/server
npm install

# Tạo dữ liệu mẫu trọn gói (Admin, Customer, 10 sản phẩm, 4 dịch vụ, pet, đơn hàng, lịch hẹn):
npm run seed

# Chạy server chế độ dev (Port 5000):
npm run dev
# hoặc:
npm start
```
- API Health Check: `http://localhost:5000/api/health`
- Uploads tĩnh: `http://localhost:5000/uploads/...`

### Bước 2: Khởi động Frontend (`client/`)
```bash
cd PawLocal/client
npm install

# Khởi chạy dev server (Port 4200):
npm start
# hoặc:
npx ng serve --port 4200
```
- Mở trình duyệt tại: **`http://localhost:4200`**

---

## 🗺️ 3. Kịch Bản Demo Toàn Diện (6 Giai Đoạn Dự Án)

### 🐾 A. Trải nghiệm Khách hàng (Customer Flow):
1. **Khám phá Trang Chủ (`/`):**
   - Hero banner gradient cam rực rỡ, danh mục chó/mèo tròn, danh sách sản phẩm nổi bật.
2. **Cửa hàng (`/shop`):**
   - Tìm kiếm sản phẩm thời gian thực (ví dụ: gõ "hạt", "pate", "cát").
   - Lọc phân loại nhanh bằng tab **"Dành Cho Chó"** hoặc **"Dành Cho Mèo"**.
   - Bấm vào sản phẩm để xem trang chi tiết (`/shop/:id`), chọn số lượng và bấm **"Thêm vào giỏ"**.
3. **Giỏ hàng & Đặt hàng COD (`/cart` & `/checkout`):**
   - Badge số lượng trên thanh Topbar nhảy số tức thì theo Angular Signals.
   - Điều chỉnh tăng/giảm số lượng hoặc xóa món, hệ thống tự tính phí ship (Freeship cho đơn ≥ 300k).
   - Bấm **"Tiến hành Đặt hàng (COD)"** ➔ Điền địa chỉ giao hàng ➔ Bấm **"Đặt Hàng Ngay"**.
   - Tồn kho của sản phẩm trong MongoDB tự động bị trừ, đơn hàng chuyển vào danh sách **[Đơn của tôi](/orders)** với trạng thái `Chờ xác nhận`.
4. **Hồ sơ Thú cưng (`/pets`):**
   - Xem danh sách bé cưng (Milo - Golden, Bơ - Mèo Anh).
   - Thêm hồ sơ thú cưng mới (`/pets/new`) kèm loài, giống, cân nặng và ghi chú.
5. **Đặt lịch Grooming Spa (`/booking`):**
   - Luồng chọn trực quan 5 bước: Bé cưng ➔ Gói dịch vụ ➔ Ngày hẹn (cuộn 7 ngày tới) ➔ Khung giờ (`09:00`, `10:30`, `13:00`, `14:30`, `16:00`).
   - **Cơ chế chống trùng slot:** Slot nào đã có khách đặt sẽ bị gạch ngang và gắn nhãn đỏ **"Đầy"**, ngăn không cho đặt trùng.
   - Sau khi đặt, lịch hẹn xuất hiện ngay tại tab **"Lịch Của Tôi"** kèm nút **"Hủy Lịch Hẹn"**.

---

### 🛡️ B. Trải nghiệm Quản trị (Admin Flow):
1. Đăng nhập bằng tài khoản `admin@pawlocal.com` ➔ Vào tab **Cá nhân** ➔ Bấm **"🛠️ Vào Trang Quản Trị"** (`/admin`).
2. **Tổng Quan KPI (`/admin/dashboard`):**
   - 4 Thẻ KPI: Doanh thu thực tế, Số đơn hàng chờ xử lý, Lịch spa trong ngày hôm nay, Cảnh báo kho (sản phẩm tồn kho ≤ 5).
   - Danh sách tóm tắt các đơn hàng và lịch hẹn phát sinh gần nhất.
3. **Quản lý Đơn Hàng (`/admin/orders`):**
   - Lọc đơn theo trạng thái (Chờ duyệt, Chuẩn bị, Đang giao, Hoàn thành, Đã hủy).
   - Bấm nút chuyển trạng thái: `📦 Chuẩn bị` ➔ `🚚 Giao hàng` ➔ `✅ Hoàn thành`.
4. **Quản lý Lịch Spa (`/admin/bookings`):**
   - Xem chi tiết khách hàng, tên bé, dịch vụ và giờ hẹn.
   - Bấm `✓ Duyệt Hẹn` ➔ `★ Hoàn Thành Spa`.
5. **Quản lý Kho Hàng (`/admin/products`):**
   - Bấm `+ Thêm Sản Phẩm` để bổ sung hàng mới vào kho.
   - Bật/tắt công tắc nhanh: `✓ Đang bán` ➔ `⊘ Tạm ẩn`.

---

## 📚 4. Thư Mục Đặc Tả Kỹ Thuật (Docs)

Toàn bộ tài liệu chuẩn machine-readable cho nhà phát triển & AI agent nằm trong thư mục `docs/`:
- 🏛️ **[docs/SPEC_ARCHITECTURE.md](file:///e:/Hocki5/Angular/PawLocal/docs/SPEC_ARCHITECTURE.md)**: Kiến trúc hệ thống, Mongoose Schemas & Ma trận phân quyền RBAC.
- 🔌 **[docs/SPEC_API_CONTRACT.md](file:///e:/Hocki5/Angular/PawLocal/docs/SPEC_API_CONTRACT.md)**: Đặc tả toàn bộ REST API endpoints, Request/Response JSON schemas & mã lỗi.
- ⚡ **[docs/SPEC_ANGULAR_GUIDELINES.md](file:///e:/Hocki5/Angular/PawLocal/docs/SPEC_ANGULAR_GUIDELINES.md)**: Quy chuẩn code Angular Standalone, Signals, OnPush & Functional Interceptors/Guards.
- 🗺️ **[docs/SPEC_PHASES_ROADMAP.md](file:///e:/Hocki5/Angular/PawLocal/docs/SPEC_PHASES_ROADMAP.md)**: Tiến độ 6 giai đoạn kèm checklist DoD chi tiết.
