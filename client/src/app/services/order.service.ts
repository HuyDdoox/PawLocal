import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, ShippingAddress } from '../models/order.model';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/orders`;

  createOrder(data: {
    items: { productId: string; quantity: number }[];
    shippingAddress: ShippingAddress;
  }): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.API_URL, data);
  }

  getMyOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.API_URL}/my-orders`);
  }

  getOrderById(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.API_URL}/${id}`);
  }
}
