import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../models/order.model';
import { Booking, BookingStatus } from '../models/booking.model';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  revenue: number;
  pendingOrdersCount: number;
  todayBookingsCount: number;
  lowStockProductsCount: number;
  recentOrders: Order[];
  recentBookings: Booking[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl;

  getStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.BASE_URL}/admin/stats`);
  }

  getOrders(status?: string): Observable<ApiResponse<Order[]>> {
    let params = new HttpParams();
    if (status && status !== 'all') {
      params = params.set('status', status);
    }
    return this.http.get<ApiResponse<Order[]>>(`${this.BASE_URL}/admin/orders`, { params });
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.BASE_URL}/admin/orders/${orderId}/status`, {
      status,
    });
  }

  getBookings(status?: string, date?: string): Observable<ApiResponse<Booking[]>> {
    let params = new HttpParams();
    if (status && status !== 'all') params = params.set('status', status);
    if (date) params = params.set('date', date);
    return this.http.get<ApiResponse<Booking[]>>(`${this.BASE_URL}/admin/bookings`, { params });
  }

  updateBookingStatus(bookingId: string, status: BookingStatus): Observable<ApiResponse<Booking>> {
    return this.http.patch<ApiResponse<Booking>>(`${this.BASE_URL}/admin/bookings/${bookingId}/status`, {
      status,
    });
  }

  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.BASE_URL}/admin/products`);
  }

  toggleProductAvailability(productId: string): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(`${this.BASE_URL}/admin/products/${productId}/toggle`, {});
  }
}
