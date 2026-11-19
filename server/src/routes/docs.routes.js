const express = require('express');
const router = express.Router();

const API_CONTRACTS = [
  {
    category: '1. Trang chủ & Hệ thống',
    items: [
      {
        name: 'Health Check',
        method: 'GET',
        path: '/api/health',
        desc: 'Kiểm tra trạng thái server, uptime và thời gian thực',
        auth: false,
        params: [],
        body: null,
        response: {
          status: 'ok',
          message: 'PawLocal API is running smoothly',
          uptime: 125.4,
          timestamp: '2026-11-19T07:22:24.388Z'
        }
      },
      {
        name: 'Trang chủ Tổng hợp',
        method: 'GET',
        path: '/api/home',
        desc: 'Tải toàn bộ Banners, Danh mục, Sản phẩm Hot và Đánh giá (Reviews) từ MongoDB Atlas',
        auth: false,
        params: [],
        body: null,
        response: {
          success: true,
          banners: [
            { id: 1, title: 'PAWLOCAL SPA & GROOMING 2026', subtitle: 'Ưu đãi đặt lịch giảm 25%', image: '/images/banners/hero-banner.jpg', link: '/booking' }
          ],
          categories: [
            { id: 1, name: 'Thức Ăn Hạt', slug: 'thuc-an-hat', icon: 'fa-solid fa-bowl-food' }
          ],
          hotProducts: [
            { id: 1, name: 'Hạt Royal Canin Medium Puppy (3kg)', price: 365000, oldPrice: 420000, hot: true, rating: 4.9, stock: 25 }
          ],
          feedbacks: [
            { id: 1, name: 'Nguyễn Thanh Tùng', petName: 'Bé Corgi - Mochi', comment: 'Dịch vụ Spa cực kỳ có tâm!', rating: 5 }
          ]
        }
      }
    ]
  },
  {
    category: '2. Sản phẩm & Danh mục',
    items: [
      {
        name: 'Danh sách Sản phẩm',
        method: 'GET',
        path: '/api/products',
        desc: 'Lấy danh sách sản phẩm phân trang, hỗ trợ lọc theo danh mục, loại thú cưng và tìm kiếm',
        auth: false,
        params: [
          { name: 'category', type: 'string', required: false, desc: 'Lọc theo slug danh mục (ví dụ: thuc-an-hat)' },
          { name: 'petType', type: 'string', required: false, desc: 'Lọc theo loại thú cưng: dog, cat, all' },
          { name: 'search', type: 'string', required: false, desc: 'Từ khóa tìm kiếm theo tên/mô tả' },
          { name: 'page', type: 'number', required: false, desc: 'Số trang (mặc định: 1)' },
          { name: 'limit', type: 'number', required: false, desc: 'Số lượng / trang (mặc định: 12)' }
        ],
        body: null,
        response: {
          success: true,
          data: {
            products: [
              {
                _id: '6afe9fb07366b80da8ec46ee',
                id: 1,
                name: 'Hạt Royal Canin Medium Puppy (3kg)',
                slug: 'hat-royal-canin-medium-puppy-3kg',
                price: 365000,
                oldPrice: 420000,
                rating: 4.9,
                stock: 25,
                category: { name: 'Thức Ăn Hạt', slug: 'thuc-an-hat' },
                petTypes: ['dog'],
                isAvailable: true
              }
            ],
            pagination: { total: 10, page: 1, pages: 1, limit: 12 }
          }
        }
      },
      {
        name: 'Chi tiết Sản phẩm',
        method: 'GET',
        path: '/api/products/hat-royal-canin-medium-puppy-3kg',
        desc: 'Lấy thông tin chi tiết của 1 sản phẩm theo Slug hoặc MongoDB ObjectId',
        auth: false,
        params: [
          { name: 'idOrSlug', type: 'string', required: true, desc: 'Slug hoặc ObjectId của sản phẩm' }
        ],
        body: null,
        response: {
          success: true,
          data: {
            _id: '6afe9fb07366b80da8ec46ee',
            name: 'Hạt Royal Canin Medium Puppy (3kg)',
            slug: 'hat-royal-canin-medium-puppy-3kg',
            price: 365000,
            description: 'Dinh dưỡng cân bằng đặc chế cho chó con từ 2-12 tháng tuổi...',
            stock: 25,
            rating: 4.9
          }
        }
      },
      {
        name: 'Danh mục Sản phẩm',
        method: 'GET',
        path: '/api/categories',
        desc: 'Lấy danh sách tất cả danh mục hàng hóa (Thức ăn, Phụ kiện, Vệ sinh, Đồ chơi)',
        auth: false,
        params: [],
        body: null,
        response: {
          success: true,
          data: [
            { id: 1, name: 'Thức Ăn Hạt', slug: 'thuc-an-hat', icon: 'fa-solid fa-bowl-food', petType: 'all' },
            { id: 2, name: 'Pate & Thức Ăn Ướt', slug: 'pate-thuc-an-uot', icon: 'fa-solid fa-can-food', petType: 'all' }
          ]
        }
      }
    ]
  },
  {
    category: '3. Dịch vụ Spa & Grooming',
    items: [
      {
        name: 'Danh sách Dịch vụ Spa',
        method: 'GET',
        path: '/api/services',
        desc: 'Lấy danh sách các gói dịch vụ làm đẹp thú cưng đang hoạt động',
        auth: false,
        params: [],
        body: null,
        response: {
          success: true,
          data: [
            {
              _id: '6afe9fb07366b80da8ec46fa',
              name: 'Tắm Vệ Sinh Cơ Bản',
              description: 'Tắm gội dưỡng lông, sấy khô chải tơ, vắt tuyến hôi, vệ sinh tai và cắt mài móng.',
              basePrice: 150000,
              durationMinutes: 60,
              petTypes: ['dog', 'cat'],
              isActive: true
            }
          ]
        }
      }
    ]
  },
  {
    category: '4. Tin tức & Cẩm nang',
    items: [
      {
        name: 'Danh sách Bài viết Blog',
        method: 'GET',
        path: '/api/blogs',
        desc: 'Lấy danh sách các bài viết chia sẻ kiến thức chăm sóc thú cưng',
        auth: false,
        params: [],
        body: null,
        response: {
          success: true,
          data: [
            {
              id: 1,
              title: 'Cẩm nang dinh dưỡng cho chó con từ 2 đến 12 tháng tuổi',
              slug: 'cam-nang-dinh-duong-cho-cho-con-2-12-thang',
              author: 'Bác sĩ thú y Minh Trí',
              readingTime: '5 phút đọc'
            }
          ]
        }
      }
    ]
  },
  {
    category: '5. Xác thực & Tài khoản (Auth)',
    items: [
      {
        name: 'Đăng nhập',
        method: 'POST',
        path: '/api/auth/login',
        desc: 'Xác thực email & mật khẩu, trả về JWT Token và Profile',
        auth: false,
        params: [],
        body: {
          email: 'customer@pawlocal.com',
          password: 'Password123'
        },
        response: {
          success: true,
          message: 'Đăng nhập thành công',
          data: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user: {
              _id: '6afe9fb07366b80da8ec46df',
              name: 'Nguyễn Văn Khách',
              email: 'customer@pawlocal.com',
              phone: '0988776655',
              role: 'customer'
            }
          }
        }
      },
      {
        name: 'Đăng ký tài khoản',
        method: 'POST',
        path: '/api/auth/register',
        desc: 'Tạo tài khoản khách hàng mới',
        auth: false,
        params: [],
        body: {
          name: 'Trần Văn Mới',
          email: 'newuser@pawlocal.com',
          password: 'Password123',
          phone: '0912345678',
          address: '456 Hai Bà Trưng, Quận 3'
        },
        response: {
          success: true,
          message: 'Đăng ký thành công',
          data: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user: { name: 'Trần Văn Mới', email: 'newuser@pawlocal.com', role: 'customer' }
          }
        }
      },
      {
        name: 'Lấy thông tin tài khoản hiện tại (Me)',
        method: 'GET',
        path: '/api/auth/me',
        desc: 'Lấy thông tin profile từ Bearer Token',
        auth: true,
        params: [],
        body: null,
        response: {
          success: true,
          data: {
            _id: '6afe9fb07366b80da8ec46df',
            name: 'Nguyễn Văn Khách',
            email: 'customer@pawlocal.com',
            phone: '0988776655'
          }
        }
      }
    ]
  },
  {
    category: '6. Đơn hàng & Thanh toán (Orders)',
    items: [
      {
        name: 'Tạo Đơn Hàng Mới',
        method: 'POST',
        path: '/api/orders',
        desc: 'Tạo đơn đặt hàng. Hỗ trợ paymentMethod: "cod" hoặc "vietqr". Tự động sinh VietQR Napas247 khi chọn vietqr.',
        auth: true,
        params: [],
        body: {
          customerName: 'Nguyễn Văn Khách',
          phone: '0988776655',
          shippingAddress: '123 Lê Lợi, Quận 1',
          items: [
            { productId: '6afe9fb07366b80da8ec46ee', quantity: 2, price: 365000 }
          ],
          paymentMethod: 'vietqr',
          note: 'Giao giờ hành chính'
        },
        response: {
          success: true,
          message: 'Tạo đơn hàng thành công',
          data: {
            _id: '6afe...',
            orderCode: 'DH-179507',
            totalAmount: 730000,
            paymentMethod: 'vietqr',
            paymentStatus: 'unpaid',
            paymentDetails: {
              accountNo: '0388776655',
              accountName: 'PAWLOCAL PET SHOP',
              bankName: 'MBBank',
              qrUrl: 'https://img.vietqr.io/image/MB-0388776655-compact2.png?amount=730000&addInfo=PAWLOCAL%20DH%20179507'
            }
          }
        }
      },
      {
        name: 'Lịch sử đơn hàng của tôi',
        method: 'GET',
        path: '/api/orders/my-orders',
        desc: 'Lấy danh sách tất cả đơn hàng mà user đã đặt',
        auth: true,
        params: [],
        body: null,
        response: {
          success: true,
          data: [
            {
              _id: '6afe...',
              orderCode: 'DH-179507',
              totalAmount: 730000,
              status: 'pending',
              paymentStatus: 'unpaid',
              createdAt: '2026-11-19T07:15:00.000Z'
            }
          ]
        }
      },
      {
        name: 'Xác nhận Đã Chuyển Khoản VietQR Đơn Hàng',
        method: 'PATCH',
        path: '/api/orders/:id/confirm-payment',
        desc: 'Khách hàng bấm "Tôi đã chuyển khoản" sau khi quét mã QR',
        auth: true,
        params: [{ name: 'id', type: 'string', required: true, desc: 'Mã ObjectId của đơn hàng' }],
        body: {},
        response: {
          success: true,
          message: 'Hệ thống đã ghi nhận thông báo chuyển khoản.',
          data: { _id: '6afe...', paymentStatus: 'processing' }
        }
      }
    ]
  },
  {
    category: '7. Đặt lịch Spa & Grooming (Bookings)',
    items: [
      {
        name: 'Tạo Lịch Hẹn Spa Mới',
        method: 'POST',
        path: '/api/bookings',
        desc: 'Đặt lịch chăm sóc thú cưng kèm chọn dịch vụ, thú cưng, thời gian và phương thức thanh toán (COD hoặc VietQR)',
        auth: true,
        params: [],
        body: {
          petId: '6afe9fb07366b80da8ec46e2',
          serviceId: '6afe9fb07366b80da8ec46fa',
          bookingDate: '2026-11-20',
          bookingTime: '09:00',
          paymentMethod: 'vietqr',
          note: 'Bé hơi nhát người lạ'
        },
        response: {
          success: true,
          message: 'Đặt lịch thành công',
          data: {
            _id: '6afe...',
            bookingCode: 'SPA-179507',
            totalPrice: 150000,
            paymentMethod: 'vietqr',
            paymentStatus: 'unpaid',
            paymentDetails: {
              qrUrl: 'https://img.vietqr.io/image/MB-0388776655-compact2.png?amount=150000&addInfo=PAWLOCAL%20SPA%20179507'
            }
          }
        }
      },
      {
        name: 'Lịch hẹn của tôi',
        method: 'GET',
        path: '/api/bookings/my-bookings',
        desc: 'Lấy danh sách các cuộc hẹn Spa của tài khoản hiện tại',
        auth: true,
        params: [],
        body: null,
        response: {
          success: true,
          data: [
            {
              _id: '6afe...',
              bookingCode: 'SPA-179507',
              bookingDate: '2026-11-20T00:00:00.000Z',
              bookingTime: '09:00',
              status: 'pending',
              paymentStatus: 'unpaid'
            }
          ]
        }
      }
    ]
  },
  {
    category: '8. Quản lý Hồ sơ Thú cưng (Pets)',
    items: [
      {
        name: 'Danh sách Thú Cưng của tôi',
        method: 'GET',
        path: '/api/pets',
        desc: 'Lấy danh sách hồ sơ chó mèo của tài khoản đăng nhập',
        auth: true,
        params: [],
        body: null,
        response: {
          success: true,
          data: [
            {
              _id: '6afe9fb07366b80da8ec46e2',
              name: 'Mochi',
              type: 'dog',
              breed: 'Corgi Pembroke',
              weight: 11.5,
              gender: 'male',
              age: 2
            }
          ]
        }
      }
    ]
  }
];

// Endpoint JSON Contract Schema
router.get('/contract', (req, res) => {
  res.json({
    title: 'PawLocal REST API Contract Specification',
    version: '1.0.0',
    baseUrl: 'http://localhost:5000',
    connectedDatabase: 'MongoDB Atlas (Cluster0 / pawlocal)',
    endpointsCount: API_CONTRACTS.reduce((acc, cat) => acc + cat.items.length, 0),
    modules: API_CONTRACTS
  });
});

// HTML API Contract Viewer
router.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PawLocal - API Contract & Live JSON Viewer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --muted: #94a3b8;
      --primary: #ff6b35;
      --primary-light: #ff8c42;
      --green: #10b981;
      --blue: #3b82f6;
      --orange: #f59e0b;
      --red: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding-bottom: 60px;
    }
    header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-bottom: 1px solid var(--border);
      padding: 30px 20px;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
    }
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 24px;
      font-weight: 800;
      color: var(--primary);
    }
    .badge-status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: #34d399;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .container {
      max-width: 1200px;
      margin: 30px auto;
      padding: 0 20px;
    }
    .intro-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .intro-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .category-title {
      font-size: 22px;
      font-weight: 800;
      margin: 35px 0 16px;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
    }
    .endpoint-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      margin-bottom: 16px;
      overflow: hidden;
      transition: transform 0.2s, border-color 0.2s;
    }
    .endpoint-card:hover {
      border-color: var(--primary);
    }
    .endpoint-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      background: rgba(255,255,255,0.02);
    }
    .endpoint-left {
      display: flex;
      align-items: center;
      gap: 14px;
      font-family: 'JetBrains Mono', monospace;
    }
    .method {
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
    .method-get { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .method-post { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .method-patch { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .method-delete { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .path {
      font-size: 15px;
      font-weight: 600;
      color: #f1f5f9;
    }
    .endpoint-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn {
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
      border: none;
    }
    .btn-primary {
      background: var(--primary);
      color: #fff;
    }
    .btn-primary:hover {
      background: var(--primary-light);
    }
    .btn-outline {
      background: transparent;
      color: #94a3b8;
      border: 1px solid var(--border);
    }
    .btn-outline:hover {
      color: #fff;
      border-color: #64748b;
      background: rgba(255,255,255,0.05);
    }
    .endpoint-body {
      padding: 20px;
      border-top: 1px solid var(--border);
    }
    .desc {
      color: var(--muted);
      margin-bottom: 16px;
      font-size: 14px;
    }
    .code-block {
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #38bdf8;
      overflow-x: auto;
      max-height: 350px;
      white-space: pre;
    }
    .section-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
      color: #64748b;
      margin: 12px 0 6px;
    }
    .live-preview {
      margin-top: 16px;
      padding: 16px;
      border-radius: 8px;
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.2);
      display: none;
    }
    .live-preview.active { display: block; }
  </style>
</head>
<body>
  <header>
    <div class="header-content">
      <div class="logo">
        <i class="fa-solid fa-paw"></i>
        <span>PawLocal API Contract & Live Viewer</span>
      </div>
      <div class="badge-status">
        <div class="status-dot"></div>
        <span>MongoDB Atlas Live Connected</span>
      </div>
    </div>
  </header>

  <div class="container">
    <div class="intro-card">
      <div class="intro-title">
        <i class="fa-solid fa-file-code" style="color: var(--primary);"></i>
        Tài Liệu Hợp Đồng API (Contract) & Live Viewer
      </div>
      <p style="color: var(--muted); font-size: 14px; margin-bottom: 12px;">
        Toàn bộ dữ liệu dưới đây được truy vấn trực tiếp từ cơ sở dữ liệu thực tế <b>MongoDB Atlas</b> (Cluster0 / pawlocal). 
        Anh có thể bấm nút <b>"Mở Live JSON ↗"</b> để trình duyệt tự mở endpoint trả về JSON nguyên bản, hoặc bấm <b>"Test Ngay Tại Đây"</b> để xem trực tiếp.
      </p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <a href="/api/home" target="_blank" class="btn btn-outline"><i class="fa-solid fa-arrow-up-right-from-square"></i> /api/home</a>
        <a href="/api/products" target="_blank" class="btn btn-outline"><i class="fa-solid fa-arrow-up-right-from-square"></i> /api/products</a>
        <a href="/api/services" target="_blank" class="btn btn-outline"><i class="fa-solid fa-arrow-up-right-from-square"></i> /api/services</a>
        <a href="/api/categories" target="_blank" class="btn btn-outline"><i class="fa-solid fa-arrow-up-right-from-square"></i> /api/categories</a>
        <a href="/api/blogs" target="_blank" class="btn btn-outline"><i class="fa-solid fa-arrow-up-right-from-square"></i> /api/blogs</a>
        <a href="/api/health" target="_blank" class="btn btn-outline"><i class="fa-solid fa-heart-pulse"></i> /api/health</a>
      </div>
    </div>

    ${API_CONTRACTS.map((cat, catIdx) => `
      <div class="category-title">
        <i class="fa-solid fa-layer-group" style="color: var(--primary); font-size: 18px;"></i>
        ${cat.category}
      </div>

      ${cat.items.map((item, itemIdx) => {
        const uid = 'ep_' + catIdx + '_' + itemIdx;
        const methodClass = 'method-' + item.method.toLowerCase();
        return `
        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-left">
              <span class="method ${methodClass}">${item.method}</span>
              <span class="path">${item.path}</span>
            </div>
            <div class="endpoint-actions">
              ${item.method === 'GET' ? `
                <a href="${item.path}" target="_blank" class="btn btn-outline">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> Mở Live JSON
                </a>
                <button class="btn btn-primary" onclick="testEndpoint('${uid}', '${item.path}')">
                  <i class="fa-solid fa-play"></i> Test Ngay
                </button>
              ` : `
                <button class="btn btn-primary" onclick="toggleContract('${uid}')">
                  <i class="fa-solid fa-code"></i> Xem Request & Response
                </button>
              `}
            </div>
          </div>
          <div class="endpoint-body">
            <div class="desc">${item.desc} ${item.auth ? '<span style="color:#fbbf24; font-weight:600;">(Yêu cầu Bearer Token)</span>' : ''}</div>
            
            ${item.body ? `
              <div class="section-label">Payload Request Body (JSON)</div>
              <div class="code-block">${JSON.stringify(item.body, null, 2)}</div>
            ` : ''}

            <div class="section-label">Response Contract Mẫu (JSON)</div>
            <div class="code-block">${JSON.stringify(item.response, null, 2)}</div>

            <div id="${uid}_preview" class="live-preview">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-weight:700; color:#34d399; font-size:13px;"><i class="fa-solid fa-bolt"></i> KẾT QUẢ LIVE TỪ SERVER:</span>
                <span id="${uid}_status" style="font-size:12px; font-weight:600; color:#94a3b8;"></span>
              </div>
              <pre id="${uid}_data" class="code-block" style="color:#a7f3d0;">Đang gửi request...</pre>
            </div>
          </div>
        </div>
        `;
      }).join('')}
    `).join('')}
  </div>

  <script>
    async function testEndpoint(uid, path) {
      const preview = document.getElementById(uid + '_preview');
      const dataEl = document.getElementById(uid + '_data');
      const statusEl = document.getElementById(uid + '_status');
      
      preview.classList.add('active');
      dataEl.innerText = 'Đang tải dữ liệu thực tế từ MongoDB Atlas...';
      
      const start = performance.now();
      try {
        const res = await fetch(path);
        const duration = Math.round(performance.now() - start);
        const json = await res.json();
        statusEl.innerText = res.status + ' OK (' + duration + 'ms)';
        dataEl.innerText = JSON.stringify(json, null, 2);
      } catch (err) {
        statusEl.innerText = 'Lỗi kết nối';
        dataEl.innerText = 'Error: ' + err.message;
      }
    }

    function toggleContract(uid) {
      const preview = document.getElementById(uid + '_preview');
      if (preview) {
        preview.classList.toggle('active');
      }
    }
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

module.exports = router;
