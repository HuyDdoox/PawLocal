import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'PawLocal - Cửa Hàng Thú Cưng & Grooming Spa',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    pathMatch: 'full',
  },
  {
    path: 'products',
    title: 'Sản phẩm - PawLocal',
    loadComponent: () => import('./pages/products/products').then((m) => m.Products),
  },
  {
    path: 'category/:slug',
    title: 'Danh mục sản phẩm - PawLocal',
    loadComponent: () => import('./pages/products/products').then((m) => m.Products),
  },
  {
    path: 'product/:slug',
    title: 'Chi tiết sản phẩm - PawLocal',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'products/:id',
    title: 'Chi tiết sản phẩm - PawLocal',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'bai_viet',
    title: 'Cẩm nang chăm sóc thú cưng - PawLocal',
    loadComponent: () => import('./pages/blogs/blogs').then((m) => m.Blogs),
  },
  {
    path: 'bai_viet/:slug',
    title: 'Chi tiết bài viết - PawLocal',
    loadComponent: () =>
      import('./pages/blogs/blog-detail/blog-detail').then((m) => m.BlogDetail),
  },
  {
    path: 'cart',
    title: 'Giỏ hàng - PawLocal',
    loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'checkout',
    title: 'Xác nhận đơn hàng - PawLocal',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/orders/checkout/checkout').then((m) => m.Checkout),
  },
  {
    path: 'my-orders',
    title: 'Đơn hàng của tôi - PawLocal',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/orders/my-orders/my-orders').then((m) => m.MyOrders),
  },
  {
    path: 'booking',
    title: 'Đặt lịch Spa & Grooming - PawLocal',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/booking/booking').then((m) => m.Booking),
  },
  {
    path: 'pets',
    title: 'Hồ sơ thú cưng - PawLocal',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/pets/pets').then((m) => m.Pets),
  },
  {
    path: 'pets/new',
    title: 'Thêm thú cưng - PawLocal',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/pets/pet-form/pet-form').then((m) => m.PetForm),
  },
  {
    path: 'pets/edit/:id',
    title: 'Chỉnh sửa thú cưng - PawLocal',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/pets/pet-form/pet-form').then((m) => m.PetForm),
  },
  {
    path: 'login',
    title: 'Đăng nhập - PawLocal',
    loadComponent: () => import('./pages/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    title: 'Đăng ký - PawLocal',
    loadComponent: () =>
      import('./pages/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'profile',
    title: 'Tài khoản của tôi - PawLocal',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/auth/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        title: 'Bảng điều khiển - PawLocal Admin',
        loadComponent: () =>
          import('./pages/admin/admin-dashboard/admin-dashboard').then(
            (m) => m.AdminDashboard
          ),
      },
      {
        path: 'orders',
        title: 'Quản lý đơn hàng - PawLocal Admin',
        loadComponent: () =>
          import('./pages/admin/admin-orders/admin-orders').then(
            (m) => m.AdminOrders
          ),
      },
      {
        path: 'bookings',
        title: 'Quản lý lịch Spa - PawLocal Admin',
        loadComponent: () =>
          import('./pages/admin/admin-bookings/admin-bookings').then(
            (m) => m.AdminBookings
          ),
      },
      {
        path: 'products',
        title: 'Quản lý kho hàng - PawLocal Admin',
        loadComponent: () =>
          import('./pages/admin/admin-products/admin-products').then(
            (m) => m.AdminProducts
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
