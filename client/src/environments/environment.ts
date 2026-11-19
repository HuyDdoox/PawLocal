export const environment = {
  production: false,
  /**
   * Cấu hình URL Backend API:
   * - Khi chạy local dev: 'http://localhost:5000/api'
   * - Khi chạy trên Cloud/Vercel: Kết nối trực tiếp tới Render Backend API
   */
  apiUrl:
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
      ? 'https://pawlocal-api.onrender.com/api'
      : 'http://localhost:5000/api',
};
