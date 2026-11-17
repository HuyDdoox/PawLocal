export const environment = {
  production: false,
  /**
   * Cấu hình URL Backend API:
   * - Khi chạy local dev: 'http://localhost:5000/api'
   * - Khi deploy lên Vercel All-in-One: '/api' (cùng domain, không bị lỗi CORS)
   * - Nếu deploy backend riêng trên Render: 'https://pawlocal-backend.onrender.com/api'
   */
  apiUrl:
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
      ? '/api'
      : 'http://localhost:5000/api',
};
