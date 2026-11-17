import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service, Booking, AvailableSlotsResponse } from '../models/booking.model';
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
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl;

  getServices(petType?: string): Observable<ApiResponse<Service[]>> {
    let params = new HttpParams();
    if (petType && petType !== 'all') {
      params = params.set('petType', petType);
    }
    return this.http.get<ApiResponse<Service[]>>(`${this.BASE_URL}/services`, { params });
  }

  getAvailableSlots(serviceId: string, date: string): Observable<ApiResponse<AvailableSlotsResponse>> {
    const params = new HttpParams()
      .set('serviceId', serviceId)
      .set('date', date);

    return this.http.get<ApiResponse<AvailableSlotsResponse>>(
      `${this.BASE_URL}/bookings/available-slots`,
      { params }
    );
  }

  createBooking(data: {
    petId: string;
    serviceId: string;
    date: string;
    timeSlot: string;
    paymentMethod?: 'COUNTER' | 'VIETQR';
    note?: string;
  }): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(`${this.BASE_URL}/bookings`, data);
  }

  confirmPayment(id: string): Observable<ApiResponse<Booking>> {
    return this.http.patch<ApiResponse<Booking>>(`${this.BASE_URL}/bookings/${id}/confirm-payment`, {});
  }

  getMyBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.BASE_URL}/bookings/my-bookings`);
  }

  cancelBooking(id: string): Observable<ApiResponse<Booking>> {
    return this.http.patch<ApiResponse<Booking>>(`${this.BASE_URL}/bookings/${id}/cancel`, {});
  }
}
