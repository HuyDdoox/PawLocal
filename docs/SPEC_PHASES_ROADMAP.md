# PawLocal — Phase-Based Implementation Roadmap (SPEC_PHASES_ROADMAP)

> **Document Type:** Machine-readable Task Execution Roadmap & Checklist
> **Structure:** 6 Phân đoạn (Giai đoạn 0 đến Giai đoạn 5)
> **Nguyên tắc bất di bất dịch:** Chỉ chuyển sang giai đoạn tiếp theo khi đã hoàn thành toàn bộ checklist và đạt **Definition of Done (DoD)** của giai đoạn hiện tại.

---

## 📌 GIAI ĐOẠN 0: Khởi tạo & Thiết lập Môi trường (Setup & Environment)

### 1. Mục tiêu

Chuẩn bị môi trường phát triển monorepo `PawLocal/` có sẵn 2 thư mục `client/` (Angular) và `server/` (Node/Express), kết nối thành công với MongoDB và thông luồng API Health Check.

### 2. Danh sách công việc (Tasks Checklist)

- [X] **Task 0.1:** Kiểm tra môi trường cục bộ: Node.js (`node -v` >= 18), Angular CLI (`ng version` >= 17), MongoDB (chạy service hoặc Docker).
- [X] **Task 0.2:** Khởi tạo thư mục `client/` bằng Angular CLI với cấu hình Standalone components, routing và SCSS/CSS:
  ```bash
  ng new client --standalone --routing --style=scss --skip-tests
  ```
- [X] **Task 0.3:** Khởi tạo thư mục `server/`, chạy `npm init -y` và cài đặt các phụ thuộc cốt lõi:
  ```bash
  cd server && npm install express mongoose dotenv cors morgan multer bcryptjs jsonwebtoken
  npm install -D nodemon
  ```
- [X] **Task 0.4:** Tạo file `.env` trong `server/`:
  ```env
  PORT=5000
  MONGO_URI=mongodb://127.0.0.1:27017/pawlocal
  JWT_SECRET=pawlocal_super_secret_jwt_key_2026
  CLIENT_URL=http://localhost:4200
  ```
- [X] **Task 0.5:** Xây dựng file kết nối MongoDB `server/src/config/db.js` và entry point `server/src/server.js` kích hoạt Express với `cors()`, `express.json()`, `morgan('dev')`.
- [X] **Task 0.6:** Viết endpoint kiểm tra `GET /api/health` trả về `{ "status": "ok", "uptime": ... }`.
- [X] **Task 0.7:** Cấu hình thư mục lưu ảnh tĩnh `server/uploads/products` và `server/uploads/pets`. Phục vụ route tĩnh `app.use('/uploads', express.static(...))`.
- [X] **Task 0.8:** Cấu hình script chạy: `npm run dev` (sử dụng nodemon) ở backend và `ng serve` ở frontend.

### 3. Tiêu chí kiểm thử & Nghiệm thu (DoD)

- Gọi `GET http://localhost:5000/api/health` qua trình duyệt hoặc cURL nhận về status 200 kèm JSON `{ "status": "ok" }`.
- Mở `http://localhost:4200` hiển thị trang chào mừng của Angular.
- Console của Node server in dòng chữ `MongoDB connected successfully`.

---

## 📌 GIAI ĐOẠN 1: Nền tảng cốt lõi, Xác thực & Layout (Core Foundation & Auth)

### 1. Mục tiêu

Xây dựng trọn vẹn hệ thống đăng ký, đăng nhập JWT, phân quyền 2 vai trò (`customer`, `admin`), thiết lập layout mobile-first và cơ chế bảo vệ route cho Angular.

### 2. Danh sách công việc (Tasks Checklist)

- [X] **Task 1.1:** [Backend] Xây dựng model `server/src/models/User.js` với các trường theo `SPEC_ARCHITECTURE.md`.
- [X] **Task 1.2:** [Backend] Viết `server/src/controllers/auth.controller.js` và route `server/src/routes/auth.routes.js`:
  - `POST /api/auth/register`: Validate email trùng, băm password bằng `bcryptjs`, tạo user.
  - `POST /api/auth/login`: So khớp password, sinh JWT token thời hạn 7 ngày, trả về `{ token, user }`.
  - `GET /api/auth/me`: Lấy thông tin tài khoản hiện tại.
- [X] **Task 1.3:** [Backend] Viết middleware xác thực `server/src/middleware/auth.middleware.js`:
  - `protect`: Giải mã JWT từ header `Authorization: Bearer <token>`, gán user vào `req.user`.
  - `adminOnly`: Kiểm tra `req.user.role === 'admin'`, nếu không từ chối 403 Forbidden.
- [X] **Task 1.4:** [Frontend] Cấu hình `provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))` trong `client/src/app/app.config.ts`.
- [X] **Task 1.5:** [Frontend] Viết Functional Interceptors:
  - `authInterceptor`: Tự động gắn header `Authorization: Bearer <token>` nếu đã lưu token.
  - `errorInterceptor`: Bắt mã lỗi 401 (xóa token, redirect về `/login`), báo lỗi tổng quát.
- [X] **Task 1.6:** [Frontend] Xây dựng `AuthService`:
  - Quản lý trạng thái bằng Signal: `currentUser = signal<User | null>(...)`.
  - `login()`, `register()`, `logout()`.
  - Khôi phục phiên đăng nhập khi F5 từ `localStorage`.
- [X] **Task 1.7:** [Frontend] Viết Functional Guards `authGuard` và `adminGuard` bảo vệ các route.
- [X] **Task 1.8:** [Frontend] Xây dựng Mobile-First Layout:
  - `MobileTopbarComponent`: Logo PawLocal, search icon, badge giỏ hàng.
  - `MobileBottomNavComponent`: Thanh 5 tab cố định đáy màn hình (Home, Shop, Booking, Pets, Profile).
  - Khung content linh hoạt tối ưu chiều rộng 390px.
- [X] **Task 1.9:** [Frontend] Thiết kế trang **Login** và **Register**:
  - Dùng Reactive Forms (`NonNullableFormBuilder`), validate bắt buộc nhập, định dạng email, độ dài password.
  - Hiển thị thông báo lỗi từ server nếu đăng nhập thất bại.

### 3. Tiêu chí kiểm thử & Nghiệm thu (DoD)

- Đăng ký thành công tài khoản mới qua form Angular.
- Đăng nhập thành công, nhận token, tự động chuyển về trang `/home`.
- F5 tải lại trang: trạng thái đăng nhập vẫn được giữ nguyên.
- Nhấn Đăng xuất: Xóa token khỏi `localStorage`, điều hướng về `/login`.
- Cố tình truy cập trang yêu cầu đăng nhập khi chưa login: Bị chặn và chuyển hướng về `/login`.

---

## 📌 GIAI ĐOẠN 2: Cửa hàng & Đặt hàng COD (Shop, Cart & Order)

### 1. Mục tiêu

Khách hàng có thể khám phá danh mục, lọc tìm sản phẩm, quản lý giỏ hàng cục bộ và hoàn tất đặt đơn hàng giao tận nơi thanh toán khi nhận (COD) có trừ tồn kho tự động.

### 2. Danh sách công việc (Tasks Checklist)

- [ ] **Task 2.1:** [Backend] Xây dựng model `Category` và `Product`.
- [ ] **Task 2.2:** [Backend] Cấu hình upload ảnh sản phẩm bằng `multer` lưu vào `server/uploads/products/`.
- [ ] **Task 2.3:** [Backend] Viết `product.controller.js` và `product.routes.js`:
  - `GET /api/products`: Hỗ trợ filter theo category, petType, khoảng giá, từ khóa tìm kiếm và phân trang.
  - `GET /api/products/:id`: Chi tiết 1 sản phẩm.
- [ ] **Task 2.4:** [Backend] Viết script seed dữ liệu mẫu `server/src/utils/seedProducts.js` tạo sẵn 10–12 sản phẩm kèm danh mục.
- [ ] **Task 2.5:** [Backend] Xây dựng model `Order` và `order.controller.js`:
  - `POST /api/orders`: Kiểm tra tồn kho từng món -> Trả lỗi 400 nếu không đủ -> Snapshot giá/tên sản phẩm -> Trừ `stock` trong DB -> Tạo order `pending`.
  - `GET /api/orders/my-orders`: Lấy danh sách đơn của user hiện tại.
  - `GET /api/orders/:id`: Lấy chi tiết đơn hàng.
- [ ] **Task 2.6:** [Frontend] Viết `ProductService` tích hợp các API lấy danh sách và chi tiết.
- [ ] **Task 2.7:** [Frontend] Màn hình **Home**: Banner chào mừng, danh sách nút danh mục dạng chip cuộn ngang, danh sách sản phẩm nổi bật.
- [ ] **Task 2.8:** [Frontend] Màn hình **Shop**:
  - Grid sản phẩm 2 cột chuẩn mobile.
  - Thanh tìm kiếm tức thời và các chip lọc (Chó, Mèo, Loại thức ăn, Phụ kiện).
  - Trạng thái `loading-skeleton` khi tải và `empty-state` khi không tìm thấy kết quả.
- [ ] **Task 2.9:** [Frontend] Màn hình **Product Detail**: Xem ảnh to, mô tả, tình trạng kho, bộ chọn số lượng, nút "Thêm vào giỏ hàng".
- [ ] **Task 2.10:** [Frontend] Xây dựng `CartService` dùng Signals:
  - Thêm, sửa số lượng, xóa item.
  - Chống thêm vượt quá `product.stock`.
  - Tự động lưu `localStorage` và hiển thị badge số lượng món trên Topbar.
- [ ] **Task 2.11:** [Frontend] Màn hình **Cart** & **Checkout**:
  - Danh sách món trong giỏ, điều chỉnh số lượng trực tiếp.
  - Form nhập thông tin nhận hàng (Tên, SĐT, Địa chỉ, Ghi chú giao hàng).
  - Tóm tắt chi phí (Tạm tính, Phí vận chuyển, Tổng thanh toán).
  - Nút bấm xác nhận "Đặt hàng COD".
- [ ] **Task 2.12:** [Frontend] Màn hình **My Orders**: Hiển thị danh sách các đơn đã đặt và trạng thái đơn hàng (Badge màu: pending, processing, shipped, completed, cancelled).

### 3. Tiêu chí kiểm thử & Nghiệm thu (DoD)

- Xem được danh sách sản phẩm, lọc theo loài chó/mèo và tìm kiếm theo tên ra đúng kết quả.
- Thêm sản phẩm vào giỏ, F5 tải lại trang giỏ hàng vẫn còn nguyên.
- Không thể thêm quá số lượng tồn kho `stock`.
- Đặt hàng COD thành công: Đơn hàng mới xuất hiện trong DB, trường `stock` của sản phẩm bị trừ chính xác.
- Đơn hàng xuất hiện ngay trong màn hình "Đơn của tôi".

---

## 📌 GIAI ĐOẠN 3: Hồ sơ Thú cưng & Đặt lịch Grooming (Pet & Booking)

### 1. Mục tiêu

Người dùng tạo và quản lý hồ sơ cho thú cưng của mình, sau đó đặt lịch hẹn dịch vụ cắt tỉa/tắm spa với cơ chế chọn ngày, chọn khung giờ không bị trùng lặp.

### 2. Danh sách công việc (Tasks Checklist)

- [ ] **Task 3.1:** [Backend] Xây dựng model `Pet` và route CRUD `/api/pets` (kèm upload ảnh pet qua multer). Đảm bảo chỉ chủ sở hữu (`req.user._id`) mới có quyền xem, sửa, xóa pet của mình.
- [ ] **Task 3.2:** [Backend] Xây dựng model `Service` (dịch vụ grooming) và seed dữ liệu mẫu 4 dịch vụ chính (Tắm sấy khử mùi, Cắt tỉa tạo kiểu, Cắt mài móng, Combo Spa toàn diện).
- [ ] **Task 3.3:** [Backend] Xây dựng model `Booking` và `booking.controller.js`:
  - `GET /api/bookings/available-slots?serviceId=...&date=...`: Trả về danh sách các slot còn trống trong ngày.
  - `POST /api/bookings`: Kiểm tra pet thuộc user, kiểm tra trùng lịch (cùng `serviceId + date + timeSlot` đang hoạt động), lưu booking trạng thái `pending`.
  - `GET /api/bookings/my-bookings`: Xem lịch hẹn của user.
  - `PATCH /api/bookings/:id/cancel`: Cho phép hủy lịch nếu trạng thái là `pending` hoặc `confirmed`.
- [ ] **Task 3.4:** [Frontend] Xây dựng `PetService` và Màn hình **My Pets**:
  - Danh sách thẻ thú cưng (Ảnh, Tên, Giống, Cân nặng, Tuổi).
  - Form thêm mới / chỉnh sửa hồ sơ thú cưng kèm chọn ảnh đại diện.
- [ ] **Task 3.5:** [Frontend] Màn hình **Grooming Services**: Xem bảng giá và thời lượng từng dịch vụ làm đẹp, nút "Đặt lịch ngay".
- [ ] **Task 3.6:** [Frontend] Luồng đặt lịch **Booking Flow**:
  - Chọn thú cưng từ danh sách pet đã tạo (nếu chưa có pet -> nhắc tạo pet trước).
  - Chọn dịch vụ cần làm.
  - Chọn ngày (danh sách cuộn ngang 7 ngày tới).
  - Chọn khung giờ (các khung giờ `09:00`, `10:30`, `13:00`, `14:30`, `16:00` - disable slot đã có người đặt).
  - Xem tóm tắt thông tin và bấm nút "Xác nhận đặt lịch".
- [ ] **Task 3.7:** [Frontend] Màn hình **My Bookings**:
  - Phân tab: "Sắp tới" và "Lịch sử".
  - Hiển thị ngày, giờ, tên pet, tên dịch vụ, trạng thái.
  - Nút "Hủy lịch hẹn" có hộp thoại xác nhận (Confirm dialog).

### 3. Tiêu chí kiểm thử & Nghiệm thu (DoD)

- Tạo thành công 2 hồ sơ thú cưng (chó/mèo) có ảnh đại diện.
- Đặt lịch hẹn grooming thành công với 1 khung giờ.
- Khi người dùng khác (hoặc chính user đó) chọn lại đúng dịch vụ + ngày + khung giờ đó: slot đó bị disable hoặc server trả lỗi không cho đặt trùng.
- Lịch hẹn xuất hiện ngay trong tab "Lịch hẹn của tôi".

---

## 📌 GIAI ĐOẠN 4: Phân hệ Quản trị Cửa hàng (Admin Management)

### 1. Mục tiêu

Cung cấp giao diện riêng cho Admin để quản lý danh mục sản phẩm, theo dõi và đổi trạng thái đơn hàng, duyệt lịch hẹn grooming của khách.

### 2. Danh sách công việc (Tasks Checklist)

- [ ] **Task 4.1:** [Backend] Đảm bảo toàn bộ các route admin `/api/admin/*` đều được bọc bởi middleware `protect` và `adminOnly`.
- [ ] **Task 4.2:** [Backend] Viết các API quản trị:
  - Quản lý sản phẩm: `POST /api/products`, `PATCH /api/products/:id`, `DELETE /api/products/:id`.
  - Quản lý đơn hàng: `GET /api/admin/orders`, `PATCH /api/admin/orders/:id/status`.
  - Quản lý lịch hẹn: `GET /api/admin/bookings`, `PATCH /api/admin/bookings/:id/status`.
- [ ] **Task 4.3:** [Frontend] Xây dựng Layout Admin (`AdminLayoutComponent`): Khung header riêng, thanh điều hướng sidebar/drawer quản trị, thoát về giao diện khách hàng.
- [ ] **Task 4.4:** [Frontend] Bảo vệ toàn bộ route `/admin/*` bằng `adminGuard`. Khách hàng role `customer` nếu gõ URL `/admin` sẽ bị redirect về `/home` hoặc trang 403.
- [ ] **Task 4.5:** [Frontend] Màn hình **Admin Products**:
  - Bảng/danh sách sản phẩm: ảnh, tên, giá, số lượng tồn kho, trạng thái.
  - Form thêm mới sản phẩm có upload ảnh.
  - Form chỉnh sửa giá, số lượng kho, toggle bật/tắt còn bán (`isAvailable`).
  - Xóa sản phẩm có dialog xác nhận.
- [ ] **Task 4.6:** [Frontend] Màn hình **Admin Orders**:
  - Bộ lọc đơn hàng theo trạng thái (`pending`, `processing`, `shipped`, `completed`, `cancelled`).
  - Xem chi tiết đơn: thông tin người nhận, SĐT, địa chỉ, danh sách món.
  - Dropdown/nút bấm chuyển trạng thái đơn hàng.
- [ ] **Task 4.7:** [Frontend] Màn hình **Admin Bookings**:
  - Danh sách lịch hẹn lọc theo ngày hoặc trạng thái.
  - Nút bấm duyệt hẹn (`pending` -> `confirmed`), bấm hoàn tất (`completed`), hoặc hủy lịch (`cancelled`).

### 3. Tiêu chí kiểm thử & Nghiệm thu (DoD)

- Đăng nhập bằng tài khoản `customer`: không thể mở được trang `/admin`.
- Đăng nhập bằng tài khoản `admin`:
  - Thêm một sản phẩm mới kèm ảnh -> Sản phẩm xuất hiện ngay bên ngoài trang Shop.
  - Đổi trạng thái một đơn hàng sang `shipped` -> Đăng nhập tài khoản khách thấy trạng thái đơn đã đổi thành `Đang giao hàng`.
  - Duyệt lịch hẹn từ `pending` sang `confirmed` -> Khách thấy lịch hẹn đã được xác nhận.

---

## 📌 GIAI ĐOẠN 5: Dashboard thống kê, Tối ưu & Đóng gói (Dashboard & Polish)

### 1. Mục tiêu

Hoàn thiện bảng điều khiển doanh thu tổng quan, hoàn thiện trải nghiệm người dùng mobile mượt mà, viết script seed dữ liệu mẫu đầy đủ và đóng gói tài liệu sẵn sàng demo/chấm điểm.

### 2. Danh sách công việc (Tasks Checklist)

- [ ] **Task 5.1:** [Backend] Viết API thống kê `GET /api/admin/stats`:
  - Doanh thu thực tế: Tổng tiền của tất cả các đơn hàng có trạng thái `completed`.
  - Số đơn hàng mới đang chờ xử lý (`pending`).
  - Số lượng lịch hẹn grooming trong ngày hôm nay.
  - Cảnh báo số sản phẩm sắp hết hàng (`stock <= 5`).
- [ ] **Task 5.2:** [Backend] Xây dựng script tổng thể `server/src/utils/seedAll.js` (chạy qua lệnh `npm run seed`):
  - Tự động xóa dữ liệu cũ và tạo mới: 1 tài khoản Admin (`admin@pawlocal.com` / `Admin123!`), 1 tài khoản Customer (`customer@pawlocal.com` / `Customer123!`), 4 danh mục, 10 sản phẩm mẫu, 4 dịch vụ grooming, 3 đơn hàng và 3 lịch hẹn mẫu.
- [ ] **Task 5.3:** [Frontend] Màn hình **Admin Dashboard**:
  - 4 Thẻ KPI trực quan: Doanh thu, Đơn hàng mới, Lịch hẹn hôm nay, Cảnh báo tồn kho.
  - Bảng tóm tắt các đơn hàng và lịch hẹn phát sinh gần nhất.
- [ ] **Task 5.4:** [Frontend] Rà soát và hoàn thiện trải nghiệm Mobile (Polish):
  - Kiểm tra co giãn giao diện chuẩn xác trên các kích thước: 360px, 390px (iPhone), 768px (Tablet).
  - Đảm bảo 100% các màn hình đều có: `loading-skeleton` khi tải dữ liệu, `empty-state` khi không có dữ liệu, `error-banner` khi API gặp sự cố.
  - Mọi thao tác xóa/hủy đều phải có hộp thoại xác nhận (Confirm dialog).
- [ ] **Task 5.5:** Viết file `PawLocal/README.md` hướng dẫn chi tiết:
  - Yêu cầu cài đặt môi trường.
  - Hướng dẫn chạy backend (`npm run dev`) và frontend (`ng serve`).
  - Hướng dẫn chạy seed dữ liệu (`npm run seed`).
  - Danh sách tài khoản demo và kịch bản demo (User story flow).

### 3. Tiêu chí kiểm thử & Nghiệm thu (DoD Tổng thể Dự án)

- Toàn bộ app chạy trơn tru cục bộ không phát sinh lỗi console.
- Luồng demo chạy hoàn chỉnh từ đầu đến cuối:
  1. Đăng ký/Đăng nhập khách hàng.
  2. Tạo hồ sơ thú cưng.
  3. Chọn sản phẩm -> Thêm vào giỏ -> Đặt hàng COD.
  4. Đặt lịch hẹn grooming chọn ngày & giờ.
  5. Đăng nhập Admin -> Xem Dashboard thống kê -> Duyệt đơn hàng -> Duyệt lịch hẹn -> Thêm sản phẩm mới.
  6. Khách hàng thấy mọi trạng thái được cập nhật chuẩn xác.
